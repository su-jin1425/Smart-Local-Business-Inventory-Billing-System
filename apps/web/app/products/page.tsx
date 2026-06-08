import { ProductForm } from "../../components/product-form";
import { getProducts } from "../../lib/api";

export default async function ProductsPage() {
  const productsResponse = await getProducts();
  const products = productsResponse?.data ?? [];

  return (
    <>
      <section className="page-header">
        <h2>Product Catalog</h2>
        <p>Maintain the internal catalog used by stock handlers and billing staff.</p>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h3>Add product</h3>
          <p>Register a new sellable item with starting stock and reorder rules.</p>
          <ProductForm />
        </div>

        <div className="panel">
          <h3>Catalog records</h3>
          {products.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="hint">No products available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

