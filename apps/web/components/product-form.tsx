"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function ProductForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      sku: String(formData.get("sku") ?? ""),
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      price: Number(formData.get("price") ?? 0),
      stockQuantity: Number(formData.get("stockQuantity") ?? 0),
      reorderLevel: Number(formData.get("reorderLevel") ?? 5)
    };

    const response = await fetch(`${apiBaseUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      setError("Could not add product. Check the API or validate the form values.");
      return;
    }

    setStatus("Product added to the operational catalog.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          SKU
          <input name="sku" required placeholder="V2-NEW-001" />
        </label>
        <label>
          Product name
          <input name="name" required placeholder="Thermal paper roll" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Category
          <input name="category" required placeholder="Billing Supplies" />
        </label>
        <label>
          Unit price
          <input name="price" type="number" min="0" step="0.01" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Opening stock
          <input name="stockQuantity" type="number" min="0" step="1" defaultValue="0" required />
        </label>
        <label>
          Reorder level
          <input name="reorderLevel" type="number" min="0" step="1" defaultValue="5" required />
        </label>
      </div>
      <div className="button-row">
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add product"}
        </button>
        {status ? <span className="success">{status}</span> : null}
        {error ? <span className="error">{error}</span> : null}
      </div>
    </form>
  );
}
