import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../../utils/Money";
import { getImageUrl } from "../../../api/api"; // ✅ add this import

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function RelatedCard({ product }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);

  const productId = product._id || product.id;

  // ✅ use getImageUrl exactly like ProductDetailPage does
  const rawImage = product.images?.[0] || product.image;
  const imageUrl = getImageUrl(rawImage);

  return (
    <div
      onClick={() => navigate(`/products/${productId}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ cursor: "pointer" }}
    >
      <div style={{ aspectRatio: "1", overflow: "hidden", background: "#f2f2f2", position: "relative", marginBottom: 10 }}>
        <img
          src={imageUrl}  // ✅ now uses full URL
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hov ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        {product.isNew && (
          <span style={{
            position: "absolute", bottom: 8, left: 8,
            background: "#f5d061", color: "#111",
            fontSize: 10, fontWeight: 500, fontFamily: FONT,
            padding: "2px 8px", borderRadius: 999, letterSpacing: "0.04em",
          }}>New</span>
        )}
      </div>

      <p style={{
        fontFamily: FONT, fontSize: 13, fontWeight: 400, color: "#111",
        lineHeight: 1.4, margin: "0 0 4px",
        textDecoration: hov ? "underline" : "none",
        textUnderlineOffset: "2px", textDecorationThickness: "1px",
      }}>
        {product.name}
      </p>

      <p style={{ fontFamily: FONT, fontSize: 13, color: "#111", margin: 0 }}>
        {product.priceFrom && (
          <span style={{ color: "#999", marginRight: 3, fontSize: 12 }}>From</span>
        )}
        {formatMoney(product.priceCents)}
      </p>
    </div>
  );
}

export function RelatedProducts({ products }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "32px 16px" }}>
      {products.map((product) => {
        const key = product._id || product.id;
        return <RelatedCard key={key} product={product} />;
      })}
    </div>
  );
}

export default RelatedProducts;
