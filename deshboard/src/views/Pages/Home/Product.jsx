import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../../utils/Money";

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function Product({ product }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();

  const stars = product.rating?.stars || 0;
  const count = product.rating?.count || 0;

  // ✅ Support both MongoDB _id and plain id
  const productId = product._id || product.id;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/products/${productId}`)}
    >
      {/* Image */}
      <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "#f2f2f2", position: "relative", marginBottom: 10 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hov ? "scale(1.10)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        {/* Badges */}
        {(product.isNew || product.isTrending) && (
          <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6 }}>
            {product.isNew && (
              <span style={{ background: "#f5d061", color: "#111", fontFamily: FONT, fontSize: 10, fontWeight: 500, padding: "2px 9px", borderRadius: 999, letterSpacing: "0.04em" }}>New</span>
            )}
            {product.isTrending && (
              <span style={{ background: "#7dd3c8", color: "#111", fontFamily: FONT, fontSize: 10, fontWeight: 500, padding: "2px 9px", borderRadius: 999, letterSpacing: "0.04em" }}>Trending</span>
            )}
          </div>
        )}
      </div>

      {/* Name */}
      <p style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#111",
        lineHeight: 1.4, margin: "0 0 4px",
        textDecoration: hov ? "underline" : "none",
        textUnderlineOffset: "2px", textDecorationThickness: "1px",
      }}>
        {product.name}
      </p>

      {/* Stars */}
      {count > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 4 }}>
          {Array(5).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 12, color: i < stars ? "#f5a623" : "#e0e0e0", lineHeight: 1 }}>★</span>
          ))}
          <span style={{ fontFamily: FONT, fontSize: 11, color: "#999", marginLeft: 3 }}>{count}</span>
        </div>
      )}

      {/* Price */}
      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#111", margin: 0 }}>
        {product.priceFrom && <span style={{ color: "#999", marginRight: 3, fontSize: 13 }}>From</span>}
        {formatMoney(product.priceCents)}
      </p>
    </div>
  );
}

export default Product;
