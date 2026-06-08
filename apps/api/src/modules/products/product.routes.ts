import { Router } from "express";
import { z } from "zod";
import { ProductRepository } from "./product.repository.js";
import { createProductSchema } from "./product.schemas.js";
import { ProductService } from "./product.service.js";

const repository = new ProductRepository();
const service = new ProductService(repository);

export const productRouter = Router();

productRouter.get("/", async (_request, response, next) => {
  try {
    const products = await service.listProducts();
    response.json({ data: products });
  } catch (error) {
    next(error);
  }
});

productRouter.post("/", async (request, response, next) => {
  try {
    const input = createProductSchema.parse({
      ...request.body,
      price: Number(request.body.price),
      stockQuantity: Number(request.body.stockQuantity ?? request.body.stock_quantity ?? 0),
      reorderLevel: Number(request.body.reorderLevel ?? request.body.reorder_level ?? 5)
    });

    const product = await service.createProduct(input);
    response.status(201).json({ data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: "Invalid product payload", issues: error.issues });
      return;
    }

    next(error);
  }
});

