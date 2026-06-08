import { pool } from "../../lib/db.js";
import type { InventoryTransaction, Product } from "../../types.js";

const mapProduct = (row: Record<string, unknown>): Product => ({
  id: String(row.id),
  sku: String(row.sku),
  name: String(row.name),
  category: String(row.category),
  price: Number(row.price),
  stockQuantity: Number(row.stock_quantity),
  reorderLevel: Number(row.reorder_level),
  createdAt: new Date(String(row.created_at)).toISOString()
});

const mapTransaction = (row: Record<string, unknown>): InventoryTransaction => ({
  id: String(row.id),
  productId: String(row.product_id),
  productName: String(row.product_name),
  productSku: String(row.product_sku),
  transactionType: String(row.transaction_type) as InventoryTransaction["transactionType"],
  quantity: Number(row.quantity),
  notes: row.notes ? String(row.notes) : null,
  createdAt: new Date(String(row.created_at)).toISOString()
});

export class InventoryRepository {
  async adjustStock(input: {
    productId: string;
    quantity: number;
    transactionType: "stock_in" | "stock_out" | "adjustment";
    notes?: string;
  }): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const productResult = await client.query(
        `SELECT id, stock_quantity
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [input.productId]
      );

      if (productResult.rowCount === 0) {
        throw new Error("Product not found");
      }

      const currentStock = Number(productResult.rows[0].stock_quantity);
      const nextStock =
        input.transactionType === "stock_in"
          ? currentStock + input.quantity
          : input.transactionType === "stock_out"
            ? currentStock - input.quantity
            : input.quantity;

      if (nextStock < 0) {
        throw new Error("Insufficient stock");
      }

      await client.query(
        `UPDATE products
         SET stock_quantity = $2
         WHERE id = $1`,
        [input.productId, nextStock]
      );

      await client.query(
        `INSERT INTO inventory_transactions (product_id, transaction_type, quantity, notes)
         VALUES ($1, $2, $3, $4)`,
        [input.productId, input.transactionType, input.quantity, input.notes ?? null]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listTransactions(): Promise<InventoryTransaction[]> {
    const result = await pool.query(
      `SELECT
         tx.id,
         tx.product_id,
         tx.transaction_type,
         tx.quantity,
         tx.notes,
         tx.created_at,
         p.name AS product_name,
         p.sku AS product_sku
       FROM inventory_transactions tx
       INNER JOIN products p ON p.id = tx.product_id
       ORDER BY created_at DESC
       LIMIT 50`
    );

    return result.rows.map(mapTransaction);
  }

  async lowStock(): Promise<Product[]> {
    const result = await pool.query(
      `SELECT id, sku, name, category, price, stock_quantity, reorder_level, created_at
       FROM products
       WHERE stock_quantity <= reorder_level
       ORDER BY stock_quantity ASC, created_at DESC`
    );

    return result.rows.map(mapProduct);
  }
}
