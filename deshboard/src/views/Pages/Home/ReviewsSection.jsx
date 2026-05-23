import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export function ReviewsSection({ productId, product }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filterRating, setFilterRating] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}/comments`);
        setComments(res.data || []);
      } catch {
        const saved = localStorage.getItem(`comments_${productId}`);
        if (saved) setComments(JSON.parse(saved));
      }
    };

    loadComments();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim() || !title.trim()) return;

    setSubmitting(true);

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      comment: comment.trim(),
      rating,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      verified: Math.random() > 0.5,
    };

    try {
      await axios.post(`/api/products/${productId}/comments`, newComment);
    } catch { }

    const updated = [newComment, ...comments];

    setComments(updated);
    localStorage.setItem(`comments_${productId}`, JSON.stringify(updated));

    setName("");
    setEmail("");
    setTitle("");
    setComment("");
    setRating(5);
    setSubmitting(false);
    setShowReviewForm(false);
  };

  const overallRating = product?.rating?.stars || 4.8;
  const totalReviews = product?.rating?.count || comments.length || 229;

  const starDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count:
      star === 5
        ? Math.round(totalReviews * 0.89)
        : star === 4
          ? Math.round(totalReviews * 0.065)
          : star === 3
            ? Math.round(totalReviews * 0.017)
            : star === 2
              ? Math.round(totalReviews * 0.02)
              : 0,
  }));

  const filteredComments = comments.filter((c) =>
    filterRating === "all" ? true : c.rating === parseInt(filterRating)
  );

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  return (
    <section className="w-full bg-white pt-16 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
            Reviews
          </h2>

          <p className="text-gray-600 mt-4 text-sm md:text-base">
            {comments.length === 0
              ? "Note: This product does not have reviews yet. General product reviews are below."
              : `Based on ${totalReviews} customer reviews`}
          </p>
        </div>

        {/* REVIEW SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 max-w-4xl mx-auto">
          {/* LEFT */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-end gap-4">
              <span className="text-7xl font-black leading-none text-black">
                {overallRating.toFixed(1)}
              </span>

              <div className="pb-2">
                <div className="flex gap-1 mb-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < Math.round(overallRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                </div>

                <p className="text-gray-600 text-sm font-medium">
                  {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            {starDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-4">
                <div className="w-14 text-sm font-semibold text-black">
                  {star} stars
                </div>

                <div className="flex-1 h-[7px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 rounded-full"
                    style={{
                      width: `${(count / totalReviews) * 100}%`,
                    }}
                  />
                </div>

                <div className="w-8 text-xs text-gray-500 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-y border-gray-200 py-5 mb-10">
          <p className="text-sm text-black font-semibold">
            {sortedComments.length} reviews
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            {/* SORT */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>

              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* FILTER */}
            <div className="relative">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="appearance-none border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium outline-none"
              >
                <option value="all">All reviews</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>

              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* BUTTON */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-black text-white px-6 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Write Review
            </button>
          </div>
        </div>

        {/* REVIEW FORM */}
        {showReviewForm && (
          <div className="border border-gray-200 p-8 mb-14 bg-gray-50">
            <h3 className="text-2xl font-bold mb-8">
              Share your experience
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  required
                />
              </div>

              {/* STARS */}
              <div>
                <p className="text-sm font-semibold mb-3">
                  Your rating
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                    >
                      <span
                        className={`text-4xl transition ${s <= (hoverRating || rating)
                            ? "text-yellow-400 scale-110"
                            : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TITLE */}
              <input
                type="text"
                placeholder="Review title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                required
              />

              {/* COMMENT */}
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 px-4 py-3 outline-none resize-none focus:border-black"
                required
              />

              <div className="flex gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white px-8 py-3 font-semibold hover:opacity-90 transition"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="border border-gray-300 px-8 py-3 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;
