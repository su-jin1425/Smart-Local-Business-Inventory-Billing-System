import { redis } from "../../lib/redis.js";
import type { Product } from "../../types.js";
import { ProductRepository } from "./product.repository.js";

const PRODUCT_CACHE_KEY = "v2:products:list";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async listProducts(): Promise<Product[]> {
    const cached = await redis.get(PRODUCT_CACHE_KEY);

    if (cached) {
      return JSON.parse(cached) as Product[];
    }

    const products = await this.repository.list();
    await redis.set(PRODUCT_CACHE_KEY, JSON.stringify(products), {
      EX: 60
    });
    return products;
  }

  async createProduct(input: {
    sku: string;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
    reorderLevel: number;
  }): Promise<Product> {
    const product = await this.repository.create(input);
    await redis.del(PRODUCT_CACHE_KEY);
    return product;
  }
}

