export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  createdAt: string;
};

export type InventoryTransaction = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  transactionType: "stock_in" | "stock_out" | "adjustment";
  quantity: number;
  notes: string | null;
  createdAt: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export type HealthResponse = {
  status: string;
  checks: {
    database: string;
    redis: string;
  };
  version: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts() {
  return fetchJson<{ data: Product[] }>("/products");
}

export async function getLowStockProducts() {
  return fetchJson<{ data: Product[] }>("/inventory/low-stock");
}

export async function getInventoryTransactions() {
  return fetchJson<{ data: InventoryTransaction[] }>("/inventory/transactions");
}

export async function getInvoices() {
  return fetchJson<{ data: Invoice[] }>("/invoices");
}

export async function getHealth() {
  return fetchJson<HealthResponse>("/health");
}
