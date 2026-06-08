import { z } from "zod";

export const adjustInventorySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  transactionType: z.enum(["stock_in", "stock_out", "adjustment"]),
  notes: z.string().max(250).optional()
});

