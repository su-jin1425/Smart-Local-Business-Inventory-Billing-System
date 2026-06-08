import { Router } from "express";
import { z } from "zod";
import { InventoryRepository } from "./inventory.repository.js";
import { adjustInventorySchema } from "./inventory.schemas.js";
import { InventoryService } from "./inventory.service.js";

const repository = new InventoryRepository();
const service = new InventoryService(repository);

export const inventoryRouter = Router();

inventoryRouter.get("/transactions", async (_request, response, next) => {
  try {
    response.json({ data: await service.listTransactions() });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.get("/low-stock", async (_request, response, next) => {
  try {
    response.json({ data: await service.lowStock() });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.post("/adjustments", async (request, response, next) => {
  try {
    const input = adjustInventorySchema.parse({
      ...request.body,
      quantity: Number(request.body.quantity)
    });

    await service.adjustInventory(input);
    response.status(201).json({ message: "Inventory updated" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: "Invalid inventory payload", issues: error.issues });
      return;
    }

    next(error);
  }
});

