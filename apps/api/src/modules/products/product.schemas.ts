import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative().default(0),
  reorderLevel: z.number().int().nonnegative().default(5)
});

