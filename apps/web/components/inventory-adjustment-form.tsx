"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import type { Product } from "../lib/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function InventoryAdjustmentForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      productId: String(formData.get("productId") ?? ""),
      transactionType: String(formData.get("transactionType") ?? "stock_in"),
      quantity: Number(formData.get("quantity") ?? 0),
      notes: String(formData.get("notes") ?? "")
    };

    const response = await fetch(`${apiBaseUrl}/inventory/adjustments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      setError("Inventory update failed. Check stock availability and form values.");
      return;
    }

    setStatus("Stock ledger updated.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Product
          <select name="productId" required defaultValue="">
            <option value="" disabled>
              Select product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.sku} - {product.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Transaction type
          <select name="transactionType" defaultValue="stock_in">
            <option value="stock_in">Stock in</option>
            <option value="stock_out">Stock out</option>
            <option value="adjustment">Set stock level</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Quantity
          <input name="quantity" type="number" min="1" step="1" required />
        </label>
        <label>
          Notes
          <input name="notes" placeholder="Supplier restock or correction note" />
        </label>
      </div>
      <div className="button-row">
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Post stock update"}
        </button>
        {status ? <span className="success">{status}</span> : null}
        {error ? <span className="error">{error}</span> : null}
      </div>
    </form>
  );
}
