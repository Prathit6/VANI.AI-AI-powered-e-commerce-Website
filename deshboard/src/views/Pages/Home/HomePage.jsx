import axios from "axios";
import { useEffect, useState } from "react";
import { ProductsGrid } from "./ProductsGrid";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getHomeData();
  }, []);

  const tabs = ["ALL", "YOUTH", "ADULT"];

  const filtered =
    activeTab === "ALL"
      ? products
      : products.filter((p) => p.category?.toUpperCase() === activeTab);

  return (
    <>
      <title>VANI.AI — Shop</title>
      <div style={{ marginTop: "60px", minHeight: "100vh", backgroundColor: "#fff" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "48px 24px 32px" }}>
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#111",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}
          >
            All Products
          </h1>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#777",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Explore our full catalogue — from everyday essentials to top-rated picks, all in one place.
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: "32px", width: "fit-content", border: "2px solid #111" }}>
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "8px 28px",
                  backgroundColor: activeTab === tab ? "#111" : "#fff",
                  color: activeTab === tab ? "#fff" : "#111",
                  border: "none",
                  borderRight: i !== tabs.length - 1 ? "2px solid #111" : "none",
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px 20px" }}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i}>
                  <div style={{ aspectRatio: "1", backgroundColor: "#f2f2f2", marginBottom: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ height: "14px", backgroundColor: "#f2f2f2", marginBottom: "8px", width: "75%" }} />
                  <div style={{ height: "14px", backgroundColor: "#f2f2f2", width: "35%" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center", color: "#aaa", fontSize: "14px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              No products found
            </div>
          ) : (
            <ProductsGrid products={filtered} loadCart={loadCart} />
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
