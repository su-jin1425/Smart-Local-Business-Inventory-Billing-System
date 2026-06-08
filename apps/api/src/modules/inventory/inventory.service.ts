import { redis } from "../../lib/redis.js";
import type { InventoryTransaction, Product } from "../../types.js";
import { InventoryRepository } from "./inventory.repository.js";

const PRODUCT_CACHE_KEY = "v2:products:list";

export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}

  async adjustInventory(input: {
    productId: string;
    quantity: number;
    transactionType: "stock_in" | "stock_out" | "adjustment";
    notes?: string;
  }): Promise<void> {
    await this.repository.adjustStock(input);
    await redis.del(PRODUCT_CACHE_KEY);
  }

  async listTransactions(): Promise<InventoryTransaction[]> {
    return this.repository.listTransactions();
  }

  async lowStock(): Promise<Product[]> {
    return this.repository.lowStock();
  }
}

