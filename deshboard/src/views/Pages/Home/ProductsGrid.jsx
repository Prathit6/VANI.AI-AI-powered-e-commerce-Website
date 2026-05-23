import { Product } from "./Product";

export function ProductsGrid({ products, loadCart }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "40px 20px",
      }}
    >
      {products.map((product) => (
        <Product key={product.id} product={product} loadCart={loadCart} />
      ))}
    </div>
  );
}

export default ProductsGrid;
