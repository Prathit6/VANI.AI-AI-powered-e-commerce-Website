import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import land from "/land.jpg";
import authApi from "../../../api/authApi.js"; // adjust path to match your project
import Footer from "./Footer";

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = 18, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: `${size}px`,
            color: star <= (interactive ? hovered || rating : rating) ? "#f97316" : "#d1d5db",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.15s",
            lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  if (role === "admin")
    return <span style={{ background: "#fde047", color: "#000", fontSize: "10px", fontWeight: 900, letterSpacing: "1px", padding: "2px 7px", border: "1.5px solid #000", textTransform: "uppercase" }}>ADMIN</span>;
  if (role === "seller")
    return <span style={{ background: "#000", color: "#fde047", fontSize: "10px", fontWeight: 900, letterSpacing: "1px", padding: "2px 7px", border: "1.5px solid #000", textTransform: "uppercase" }}>SELLER</span>;
  return null;
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review }) => {
  const initials = review.userName
    ? review.userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const shortName = review.userName
    ? review.userName.split(" ").map((w, i, arr) => i === arr.length - 1 ? w[0] + "." : w).join(" ")
    : "Anonymous";

  const imgSrc = review.userImage
    ? review.userImage.startsWith("data:") || review.userImage.startsWith("http")
      ? review.userImage
      : `http://localhost:5001/${review.userImage}`
    : null;

  return (
    <div
      style={{ background: "#fff", border: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "3px 3px 0px 0px #000", fontFamily: "'Work Sans', sans-serif", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "5px 5px 0px 0px #000"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "3px 3px 0px 0px #000"; }}
    >
      {/* Avatar block */}
      <div style={{ height: "140px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1.5px solid #e5e7eb", overflow: "hidden" }}>
        {imgSrc ? (
          <img src={imgSrc} alt={review.userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "64px", height: "64px", background: "#000", color: "#fde047", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900, border: "2px solid #fde047", fontFamily: "'Work Sans', sans-serif" }}>
            {initials}
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontWeight: 800, fontSize: "15px", color: "#000", margin: 0, lineHeight: 1.2 }}>
          {review.title || "Great product!"}
        </p>
        <StarRating rating={review.rating || 5} size={16} />
        <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {review.comment}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px", paddingTop: "10px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{shortName}</span>
            <RoleBadge role={review.userRole} />
          </div>
          <div title="Verified" style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: "12px", fontWeight: 900 }}>✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Add Review Modal ─────────────────────────────────────────────────────────
const AddReviewForm = ({ onSubmit, onClose, loading }) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const canSubmit = !loading && comment.trim().length > 0;

  const handlePost = () => {
    if (!canSubmit) return;
    onSubmit({ title, comment, rating, imageFile });
  };

  return (
    <div
      onMouseDown={handleBackdropClick}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#ffffff", border: "3px solid #000", boxShadow: "8px 8px 0px 0px #000", padding: "32px", maxWidth: "500px", width: "100%", fontFamily: "'Work Sans', sans-serif", position: "relative", color: "#111", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Close */}
        <button type="button" onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#111", fontWeight: 700, padding: "4px 8px", lineHeight: 1 }}>✕</button>

        <h3 style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 22px 0", letterSpacing: "-1px", textTransform: "uppercase", color: "#111" }}>Write a Review</h3>

        {/* Rating */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "#111" }}>Rating</label>
          <StarRating rating={rating} size={30} interactive onRate={setRating} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "6px", color: "#111" }}>Title</label>
          <input
            type="text"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Great quality!"
            style={{ width: "100%", padding: "10px 12px", border: "2px solid #000", fontSize: "14px", fontFamily: "'Work Sans', sans-serif", outline: "none", boxSizing: "border-box", display: "block", color: "#111", background: "#f9fafb" }}
          />
        </div>

        {/* Comment */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "6px", color: "#111" }}>
            Review <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            style={{ width: "100%", padding: "10px 12px", border: "2px solid #000", fontSize: "14px", fontFamily: "'Work Sans', sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box", display: "block", color: "#111", background: "#f9fafb" }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "22px" }}>
          <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "#111" }}>
            Photo <span style={{ color: "#9ca3af", fontWeight: 500, letterSpacing: "0", textTransform: "none", fontSize: "11px" }}>(optional)</span>
          </label>

          {imagePreview ? (
            /* Preview */
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={imagePreview} alt="preview" style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #000", display: "block" }} />
              <button
                type="button"
                onClick={removeImage}
                style={{ position: "absolute", top: "-8px", right: "-8px", width: "22px", height: "22px", background: "#ef4444", border: "2px solid #fff", borderRadius: "50%", color: "#fff", fontSize: "11px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
              >✕</button>
            </div>
          ) : (
            /* Upload zone */
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ width: "100px", height: "100px", border: "2px dashed #9ca3af", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f9fafb", gap: "4px", transition: "border-color 0.15s, background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.background = "#f3f4f6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#9ca3af"; e.currentTarget.style.background = "#f9fafb"; }}
            >
              <span style={{ fontSize: "24px", lineHeight: 1 }}>📷</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 700, letterSpacing: "0.5px", textAlign: "center", lineHeight: 1.3 }}>ADD<br />PHOTO</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={handlePost}
            disabled={!canSubmit}
            style={{ flex: 1, padding: "12px", background: canSubmit ? "#fde047" : "#e5e7eb", color: "#000", fontWeight: 900, fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", border: "2px solid #000", boxShadow: canSubmit ? "4px 4px 0px 0px #000" : "none", cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'Work Sans', sans-serif", transition: "all 0.15s" }}
          >
            {loading ? "Posting..." : "Post Review →"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "12px 20px", background: "#fff", color: "#111", fontWeight: 700, fontSize: "13px", border: "2px solid #000", cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reviews Section ──────────────────────────────────────────────────────────
const ReviewsSection = ({ userInfo }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const isLoggedIn = !!userInfo;

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true); setError(null);
      const res = await authApi.get("/reviews");
      setReviews(res.data.reviews || []);
    } catch {
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async ({ title, comment, rating, imageFile }) => {
    try {
      setSubmitting(true);
      // Use FormData so image file goes with the request
      const fd = new FormData();
      fd.append("title", title);
      fd.append("comment", comment);
      fd.append("rating", rating);
      if (imageFile) fd.append("image", imageFile);

      await authApi.post("/reviews", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowForm(false);
      setSuccessMsg("Review posted! Thank you 🙌");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : null;

  return (
    <section style={{ background: "#fff", padding: "64px 24px 80px", fontFamily: "'Work Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(32px, 5vw, 52px)", margin: "0 0 10px 0", letterSpacing: "-2px", color: "#000" }}>Reviews</h2>

        {avgRating && (
          <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 6px 0", fontWeight: 500 }}>
            {totalReviews} review{totalReviews !== 1 ? "s" : ""} — avg <strong style={{ color: "#f97316" }}>{avgRating} ★</strong>
          </p>
        )}

        <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 24px 0", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>
          Real reviews from real customers
        </p>

        {isLoggedIn && (
          <button
            onClick={() => setShowForm(true)}
            style={{ padding: "12px 32px", background: "#fde047", color: "#000", fontWeight: 900, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", border: "2.5px solid #000", boxShadow: "5px 5px 0px 0px #000", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#fde047"; e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "3px 3px 0px 0px #fde047"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fde047"; e.currentTarget.style.color = "#000"; e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "5px 5px 0px 0px #000"; }}
          >
            + Write a Review
          </button>
        )}

        {successMsg && (
          <div style={{ marginTop: "16px", display: "inline-block", background: "#f0fdf4", border: "2px solid #16a34a", padding: "8px 20px", fontSize: "13px", fontWeight: 700, color: "#15803d" }}>
            {successMsg}
          </div>
        )}
      </div>

      {/* Content states */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", padding: "40px 0" }}>Loading reviews...</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#ef4444", fontSize: "14px", padding: "40px 0" }}>{error}</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", border: "2px dashed #d1d5db", maxWidth: "480px", margin: "0 auto" }}>
          <p style={{ fontSize: "32px", margin: "0 0 12px 0" }}>📝</p>
          <p style={{ fontWeight: 800, fontSize: "18px", color: "#000", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "-0.5px" }}>No reviews yet</p>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
            {isLoggedIn ? "Be the first to leave a review!" : "Log in to be the first to review."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", maxWidth: "1100px", margin: "0 auto" }}>
          {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
        </div>
      )}

      {showForm && (
        <AddReviewForm onSubmit={handleSubmitReview} onClose={() => setShowForm(false)} loading={submitting} />
      )}
    </section>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white p-0 m-0" style={{ fontFamily: "'Work Sans', sans-serif" }}>

      {/* HERO */}
      <div className="relative w-full h-[82vh] overflow-hidden p-0 m-0">
        <img src={land} alt="Summer Vibes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center h-full">
          <div style={{ paddingLeft: "2vw" }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl md:text-3xl">🔥</span>
              <span className="text-white font-black text-xl md:text-2xl uppercase italic tracking-widest drop-shadow-md">NEW DROP</span>
            </div>
            <h1 className="font-black uppercase italic leading-[0.85] tracking-[-4px]" style={{ fontSize: "clamp(60px, 9vw, 120px)", color: "#ffffff", textShadow: "3px 3px 0px rgba(0,0,0,0.25)" }}>
              INDIAN<br /><span style={{ color: "#fde047" }}>HEAT</span><br />WAVE
            </h1>
            <p className="mt-6 text-white text-lg md:text-xl font-semibold leading-snug max-w-md drop-shadow-md opacity-90">
              The ultimate starter pack<br />for an epic summer adventure.
            </p>
            <button
              onClick={() => navigate("/home")}
              style={{ marginTop: "2.5rem", padding: "18px 52px", fontSize: "clamp(14px, 1.5vw, 17px)", fontFamily: "'Work Sans', sans-serif", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", background: "#fde047", color: "#000", border: "3px solid #000", boxShadow: "6px 6px 0px 0px #000", cursor: "pointer", transition: "all 0.2s ease", display: "inline-block" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#fde047"; e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "3px 3px 0px 0px #fde047"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fde047"; e.currentTarget.style.color = "#000"; e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "6px 6px 0px 0px #000"; }}
            >
              SHOP NOW →
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <ReviewsSection userInfo={userInfo} />

      {/* FOOTER */}
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');
        body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default LandingPage;
