import { pool } from "../../lib/db.js";
import type { Invoice } from "../../types.js";

const mapInvoice = (row: Record<string, unknown>): Invoice => ({
  id: String(row.id),
  invoiceNumber: String(row.invoice_number),
  customerId: row.customer_id ? String(row.customer_id) : null,
  subtotal: Number(row.subtotal),
  taxAmount: Number(row.tax_amount),
  totalAmount: Number(row.total_amount),
  status: String(row.status),
  createdAt: new Date(String(row.created_at)).toISOString()
});

export class InvoiceRepository {
  async list(): Promise<Invoice[]> {
    const result = await pool.query(
      `SELECT id, invoice_number, customer_id, subtotal, tax_amount, total_amount, status, created_at
       FROM invoices
       ORDER BY created_at DESC`
    );

    return result.rows.map(mapInvoice);
  }

  async create(input: {
    customerId?: string | null;
    taxRate: number;
    items: Array<{ productId: string; quantity: number }>;
  }): Promise<Invoice> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      let subtotal = 0;
      const resolvedItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }> = [];

      for (const item of input.items) {
        const productResult = await client.query(
          `SELECT id, price, stock_quantity
           FROM products
           WHERE id = $1
           FOR UPDATE`,
          [item.productId]
        );

        if (productResult.rowCount === 0) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const row = productResult.rows[0];
        const currentStock = Number(row.stock_quantity);

        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        const unitPrice = Number(row.price);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        await client.query(
          `UPDATE products
           SET stock_quantity = stock_quantity - $2
           WHERE id = $1`,
          [item.productId, item.quantity]
        );

        await client.query(
          `INSERT INTO inventory_transactions (product_id, transaction_type, quantity, notes)
           VALUES ($1, 'stock_out', $2, $3)`,
          [item.productId, item.quantity, "Stock deducted from invoice creation"]
        );

        resolvedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          lineTotal
        });
      }

      const taxAmount = Number((subtotal * input.taxRate).toFixed(2));
      const totalAmount = Number((subtotal + taxAmount).toFixed(2));

      const counterResult = await client.query(
        `SELECT COUNT(*)::int AS invoice_count
         FROM invoices
         WHERE created_at::date = CURRENT_DATE`
      );

      const countForDay = Number(counterResult.rows[0].invoice_count) + 1;
      const invoiceNumber = `INV-V2-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(countForDay).padStart(4, "0")}`;

      const invoiceResult = await client.query(
        `INSERT INTO invoices (invoice_number, customer_id, subtotal, tax_amount, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, 'issued')
         RETURNING id, invoice_number, customer_id, subtotal, tax_amount, total_amount, status, created_at`,
        [invoiceNumber, input.customerId ?? null, subtotal, taxAmount, totalAmount]
      );

      const invoice = invoiceResult.rows[0];

      for (const item of resolvedItems) {
        await client.query(
          `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_total)
           VALUES ($1, $2, $3, $4, $5)`,
          [invoice.id, item.productId, item.quantity, item.unitPrice, item.lineTotal]
        );
      }

      await client.query("COMMIT");
      return mapInvoice(invoice);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

