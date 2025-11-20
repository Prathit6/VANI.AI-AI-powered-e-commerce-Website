// src/pages/Home/ProductsGrid.jsx
import { Product } from "./Product";
import "../../../index.css";

export function ProductsGrid({ products, loadCart }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <Product key={product.id} product={product} loadCart={loadCart} />
      ))}
    </div>
  );
}
