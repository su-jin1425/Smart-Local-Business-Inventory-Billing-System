import { z } from "zod";

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid().nullable().optional(),
  taxRate: z.number().min(0).max(1).default(0.18),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive()
    })
  ).min(1)
});

