import { InvoiceForm } from "../../components/invoice-form";
import { getInvoices, getProducts } from "../../lib/api";

export default async function BillingPage() {
  const [productsResponse, invoicesResponse] = await Promise.all([getProducts(), getInvoices()]);
  const products = productsResponse?.data ?? [];
  const invoices = invoicesResponse?.data ?? [];

  return (
    <>
      <section className="page-header">
        <h2>Billing Desk</h2>
        <p>Create invoices for walk-in or internal customer records while keeping stock in sync.</p>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h3>Issue invoice</h3>
          <p>Invoices immediately deduct stock and create a traceable billing record.</p>
          <InvoiceForm products={products} />
        </div>

        <div className="panel">
          <h3>Recent invoices</h3>
          {invoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>${invoice.subtotal.toFixed(2)}</td>
                    <td>${invoice.taxAmount.toFixed(2)}</td>
                    <td>${invoice.totalAmount.toFixed(2)}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="hint">No invoices have been issued yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
