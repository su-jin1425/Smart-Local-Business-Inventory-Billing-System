import { pool } from "../../lib/db.js";
import type { Product } from "../../types.js";

const mapRow = (row: Record<string, unknown>): Product => ({
  id: String(row.id),
  sku: String(row.sku),
  name: String(row.name),
  category: String(row.category),
  price: Number(row.price),
  stockQuantity: Number(row.stock_quantity),
  reorderLevel: Number(row.reorder_level),
  createdAt: new Date(String(row.created_at)).toISOString()
});

export class ProductRepository {
  async list(): Promise<Product[]> {
    const result = await pool.query(
      `SELECT id, sku, name, category, price, stock_quantity, reorder_level, created_at
       FROM products
       ORDER BY created_at DESC`
    );

    return result.rows.map(mapRow);
  }

  async create(input: {
    sku: string;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
    reorderLevel: number;
  }): Promise<Product> {
    const result = await pool.query(
      `INSERT INTO products (sku, name, category, price, stock_quantity, reorder_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, sku, name, category, price, stock_quantity, reorder_level, created_at`,
      [
        input.sku,
        input.name,
        input.category,
        input.price,
        input.stockQuantity,
        input.reorderLevel
      ]
    );

    return mapRow(result.rows[0]);
  }
}

