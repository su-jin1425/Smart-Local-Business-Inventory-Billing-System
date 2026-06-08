import { Router } from "express";
import { z } from "zod";
import { InvoiceRepository } from "./invoice.repository.js";
import { createInvoiceSchema } from "./invoice.schemas.js";
import { InvoiceService } from "./invoice.service.js";

const repository = new InvoiceRepository();
const service = new InvoiceService(repository);

export const invoiceRouter = Router();

invoiceRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ data: await service.listInvoices() });
  } catch (error) {
    next(error);
  }
});

invoiceRouter.post("/", async (request, response, next) => {
  try {
    const input = createInvoiceSchema.parse({
      ...request.body,
      taxRate: Number(request.body.taxRate ?? 0.18),
      items: Array.isArray(request.body.items)
        ? request.body.items.map((item: Record<string, unknown>) => ({
            productId: String(item.productId),
            quantity: Number(item.quantity)
          }))
        : []
    });

    const invoice = await service.createInvoice(input);
    response.status(201).json({ data: invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: "Invalid invoice payload", issues: error.issues });
      return;
    }

    next(error);
  }
});

