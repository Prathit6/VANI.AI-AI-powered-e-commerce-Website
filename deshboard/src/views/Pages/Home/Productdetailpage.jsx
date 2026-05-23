import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import { formatMoney } from "../../../utils/Money";
import { RelatedProducts } from "./Relatedproducts.jsx";
import api, { getImageUrl } from "../../../api/api";
import toast from "react-hot-toast";

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, allRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get("/products"),
        ]);

        const productData = productRes.data;
        const allData = allRes.data;

        console.log("Loaded product:", productData);
        console.log("Product ID field:", productData._id || productData.id);

        setProduct(productData);
        setAllProducts(allData);
      } catch (err) {
        console.error("Failed to load product:", err);

        if (err.response?.status === 404) {
          toast.error("Product not found.");
        }

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (adding) return;

    setAdding(true);
    await addToCart(product, quantity);
    toast.success("Added to cart!");
    setAdding(false);
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 1100,
          margin: "80px auto 0",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <div
          style={{
            aspectRatio: "1",
            background: "#f2f2f2",
            borderRadius: 8,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 24,
          }}
        >
          {[["75%", 28], ["35%", 20], ["100%", 48]].map(
            ([w, h], i) => (
              <div
                key={i}
                style={{
                  height: h,
                  width: w,
                  background: "#f2f2f2",
                  borderRadius: 6,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            )
          )}
        </div>

        <style>{`
          @keyframes pulse {
            0%,100% { opacity:1 }
            50% { opacity:.5 }
          }
        `}</style>
      </div>
    );
  }

  if (!product) return null;

  const currentProductId = product._id || product.id;

  const rawImages = product.images?.length
    ? product.images
    : [product.image];

  const images = rawImages.map((img) => getImageUrl(img));

  const stars = product.rating?.stars || 0;
  const count = product.rating?.count || 0;

  const relatedProducts = allProducts
    .filter((p) => {
      const pId = p._id || p.id;

      return (
        pId !== currentProductId &&
        p.category === product.category
      );
    })
    .slice(0, 6);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "20px 0 28px",
            fontFamily: FONT,
            fontSize: 12,
            color: "#999",
          }}
        >
          <span
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.color = "#111")}
            onMouseLeave={(e) => (e.target.style.color = "#999")}
            onClick={() => navigate("/")}
          >
            Home
          </span>

          <span style={{ color: "#ddd" }}>/</span>

          <span
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.color = "#111")}
            onMouseLeave={(e) => (e.target.style.color = "#999")}
            onClick={() => navigate("/")}
          >
            All Products
          </span>

          <span style={{ color: "#ddd" }}>/</span>

          <span style={{ color: "#111" }}>{product.name}</span>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* Left — images */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Thumbnails */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  style={{
                    width: 68,
                    height: 68,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImg === i
                        ? "2px solid #111"
                        : "1px solid #e5e5e5",
                    transition: "border-color 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    alt={`view ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div
              style={{
                flex: 1,
                aspectRatio: "1",
                overflow: "hidden",
                background: "#f2f2f2",
                position: "relative",
              }}
            >
              <img
                src={images[selectedImg]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {product.isNew && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "#f5d061",
                    color: "#111",
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT,
                    padding: "3px 10px",
                    borderRadius: 999,
                    letterSpacing: "0.04em",
                  }}
                >
                  New
                </span>
              )}
            </div>
          </div>

          {/* Right — info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Badges */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {product.isNew && (
                <span
                  style={{
                    background: "#f5d061",
                    color: "#111",
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  New
                </span>
              )}

              {product.isTrending && (
                <span
                  style={{
                    background: "#7dd3c8",
                    color: "#111",
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  Trending
                </span>
              )}
            </div>

            {/* Name */}
            <h1
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 600,
                color: "#111",
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h1>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      color: "#999",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stars */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 15,
                      color:
                        i < stars ? "#f5a623" : "#e0e0e0",
                      lineHeight: 1,
                    }}
                  >
                    ★
                  </span>
                ))}

              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#999",
                  marginLeft: 4,
                }}
              >
                {count} reviews
              </span>
            </div>

            {/* Price */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 600,
                color: "#111",
              }}
            >
              {product.priceFrom && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#999",
                    marginRight: 4,
                  }}
                >
                  From
                </span>
              )}

              {formatMoney(product.priceCents)}
            </div>

            <div style={{ borderTop: "1px solid #f0f0f0" }} />

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    color: "#777",
                    margin: 0,
                  }}
                >
                  Size:{" "}
                  <span
                    style={{
                      color: "#111",
                      fontWeight: 500,
                    }}
                  >
                    {selectedSize || "Select a size"}
                  </span>
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 400,
                        padding: "8px 16px",
                        border:
                          selectedSize === size
                            ? "1.5px solid #111"
                            : "1px solid #e0e0e0",
                        background:
                          selectedSize === size
                            ? "#111"
                            : "#fff",
                        color:
                          selectedSize === size
                            ? "#fff"
                            : "#111",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#777",
                }}
              >
                Quantity
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                }}
              >
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  style={{
                    width: 40,
                    height: 40,
                    background: "#fafafa",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    color: "#111",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  −
                </button>

                <span
                  style={{
                    width: 44,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontSize: 14,
                    color: "#111",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    background: "#fafafa",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    color: "#111",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              style={{
                width: "100%",
                padding: "14px 0",
                background: adding ? "#555" : "#111",
                color: "#fff",
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                cursor: adding
                  ? "not-allowed"
                  : "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!adding)
                  e.target.style.background = "#333";
              }}
              onMouseLeave={(e) => {
                if (!adding)
                  e.target.style.background = adding
                    ? "#555"
                    : "#111";
              }}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            {/* Description */}
            {product.description && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#777",
                  lineHeight: 1.7,
                  margin: 0,
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: 16,
                }}
              >
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 600,
                color: "#111",
                marginBottom: 28,
                letterSpacing: "-0.01em",
              }}
            >
              You May Also Like
            </h2>

            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
