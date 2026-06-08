import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { healthRouter } from "./modules/health/health.routes.js";
import { inventoryRouter } from "./modules/inventory/inventory.routes.js";
import { invoiceRouter } from "./modules/invoices/invoice.routes.js";
import { productRouter } from "./modules/products/product.routes.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_request, response) => {
  response.json({
    name: "Smart Local Business Inventory & Billing System API",
    version: "v2"
  });
});

app.use("/health", healthRouter);
app.use("/products", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/invoices", invoiceRouter);

app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error.message || "Unexpected server error";
  const status = message === "Product not found" || message.includes("Insufficient stock") ? 400 : 500;
  response.status(status).json({ message });
});

