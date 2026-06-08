"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "../lib/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type LineItem = {
  productId: string;
  quantity: number;
};

export function InvoiceForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [items, setItems] = useState<LineItem[]>([{ productId: "", quantity: 1 }]);
  const [taxRate, setTaxRate] = useState("0.18");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateItem(index: number, next: Partial<LineItem>) {
    setItems((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...next } : item
      )
    );
  }

  function addLine() {
    setItems((current) => [...current, { productId: "", quantity: 1 }]);
  }

  async function submitInvoice() {
    setLoading(true);
    setError("");
    setStatus("");

    const response = await fetch(`${apiBaseUrl}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taxRate: Number(taxRate),
        items
      })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invoice could not be issued. Check stock and selected line items.");
      return;
    }

    setStatus("Invoice issued and stock deducted.");
    setItems([{ productId: "", quantity: 1 }]);
    router.refresh();
  }

  return (
    <div className="form">
      {items.map((item, index) => (
        <div className="form-row" key={`${index}-${item.productId}`}>
          <label>
            Product
            <select
              value={item.productId}
              onChange={(event) => updateItem(index, { productId: event.target.value })}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.name} ({product.stockQuantity} in stock)
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
            />
          </label>
        </div>
      ))}

      <div className="form-row">
        <label>
          Tax rate
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={taxRate}
            onChange={(event) => setTaxRate(event.target.value)}
          />
        </label>
        <div className="button-row" style={{ alignItems: "end" }}>
          <button className="button secondary" type="button" onClick={addLine}>
            Add line item
          </button>
        </div>
      </div>

      <div className="button-row">
        <button
          className="button"
          type="button"
          disabled={loading || items.some((item) => !item.productId || item.quantity < 1)}
          onClick={submitInvoice}
        >
          {loading ? "Issuing..." : "Issue invoice"}
        </button>
        {status ? <span className="success">{status}</span> : null}
        {error ? <span className="error">{error}</span> : null}
      </div>
    </div>
  );
}

