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
