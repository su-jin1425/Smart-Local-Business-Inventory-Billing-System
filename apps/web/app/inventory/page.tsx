import { InventoryAdjustmentForm } from "../../components/inventory-adjustment-form";
import { getInventoryTransactions, getLowStockProducts, getProducts } from "../../lib/api";

export default async function InventoryPage() {
  const [productsResponse, lowStockResponse, transactionsResponse] = await Promise.all([
    getProducts(),
    getLowStockProducts(),
    getInventoryTransactions()
  ]);

  const products = productsResponse?.data ?? [];
  const lowStock = lowStockResponse?.data ?? [];
  const transactions = transactionsResponse?.data ?? [];

  return (
    <>
      <section className="page-header">
        <h2>Stock Control</h2>
        <p>Post adjustments, restocks, and stock-outs into the operational ledger.</p>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h3>Post inventory update</h3>
          <p>Use this form for supplier restocks, shrinkage, corrections, and manual adjustments.</p>
          <InventoryAdjustmentForm products={products} />
        </div>

        <div className="panel">
          <h3>Low-stock queue</h3>
          {lowStock.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Available</th>
                  <th>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.name}
                      <div className="hint">{product.sku}</div>
                    </td>
                    <td>{product.stockQuantity}</td>
                    <td>{product.reorderLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="hint">Nothing currently needs reorder attention.</p>
          )}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h3>Recent stock transactions</h3>
        {transactions.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {transaction.productName}
                    <div className="hint">{transaction.productSku}</div>
                  </td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.notes ?? "-"}</td>
                  <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="hint">No stock transactions recorded yet.</p>
        )}
      </section>
    </>
  );
}
