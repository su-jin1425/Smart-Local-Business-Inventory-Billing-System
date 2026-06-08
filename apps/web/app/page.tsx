import { StatusBadge } from "../components/status-badge";
import { getHealth, getInvoices, getLowStockProducts, getProducts } from "../lib/api";

export default async function HomePage() {
  const [productsResponse, lowStockResponse, invoicesResponse, health] = await Promise.all([
    getProducts(),
    getLowStockProducts(),
    getInvoices(),
    getHealth()
  ]);

  const products = productsResponse?.data ?? [];
  const lowStock = lowStockResponse?.data ?? [];
  const invoices = invoicesResponse?.data ?? [];

  return (
    <>
      <section className="page-header">
        <h2>Operations Overview</h2>
        <p>
          Daily visibility for internal staff across product availability, billing throughput, and
          system health.
        </p>
      </section>

      <section className="grid grid-3">
        <div className="panel kpi">
          <span className="hint">Active catalog items</span>
          <span className="kpi-value">{products.length}</span>
          <span className="hint">Products currently managed by the internal catalog team.</span>
        </div>
        <div className="panel kpi">
          <span className="hint">Low-stock items</span>
          <span className="kpi-value">{lowStock.length}</span>
          <span className="hint">Products at or below reorder threshold.</span>
        </div>
        <div className="panel kpi">
          <span className="hint">Invoices issued</span>
          <span className="kpi-value">{invoices.length}</span>
          <span className="hint">Billing records currently available in V2.</span>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h3>Platform health</h3>
          {health ? (
            <div className="stack">
              <StatusBadge
                label={`Overall status: ${health.status}`}
                tone={health.status === "ok" ? "ok" : "warn"}
              />
              <StatusBadge
                label={`Database: ${health.checks.database}`}
                tone={health.checks.database === "ok" ? "ok" : "warn"}
              />
              <StatusBadge
                label={`Redis: ${health.checks.redis}`}
                tone={health.checks.redis === "ok" ? "ok" : "warn"}
              />
              <p>Running version: {health.version}</p>
            </div>
          ) : (
            <p className="error">
              API health data is unavailable. Start the backend to restore operational visibility.
            </p>
          )}
        </div>

        <div className="panel">
          <h3>Restock watchlist</h3>
          {lowStock.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Reorder level</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.slice(0, 5).map((product) => (
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
            <p className="hint">No low-stock alerts right now.</p>
          )}
        </div>
      </section>
    </>
  );
}

