import { redis } from "../../lib/redis.js";
import type { Invoice } from "../../types.js";
import { InvoiceRepository } from "./invoice.repository.js";

const PRODUCT_CACHE_KEY = "v2:products:list";

export class InvoiceService {
  constructor(private readonly repository: InvoiceRepository) {}

  async listInvoices(): Promise<Invoice[]> {
    return this.repository.list();
  }

  async createInvoice(input: {
    customerId?: string | null;
    taxRate: number;
    items: Array<{ productId: string; quantity: number }>;
  }): Promise<Invoice> {
    const invoice = await this.repository.create(input);
    await redis.del(PRODUCT_CACHE_KEY);
    return invoice;
  }
}

