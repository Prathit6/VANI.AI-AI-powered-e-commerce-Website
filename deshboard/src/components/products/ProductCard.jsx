  // src/components/chat/ProductCard.jsx
  import { useState } from "react";
  import { Heart, ShoppingCart, Star } from "lucide-react";
  import { useCart } from "../../context/CartProvider";

  const formatPrice = (priceCents) => {
    const price = priceCents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  export function ProductCard({ product }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(product.rating?.count || 0);
    const [isAdding, setIsAdding] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const { addToCart } = useCart();

    const toggleLike = (e) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    };

    const handleAddToCart = async (e) => {
      e.stopPropagation();
      setIsAdding(true);

      try {
        const result = await addToCart(product, 1);
        if (result.success) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <>
        {showNotification && (
          <div className="toast-notification-right">
            <div className="toast-icon">✓</div>
            <div className="toast-content">
              <div className="toast-title">Added to Cart!</div>
              <div className="toast-message">{product.name}</div>
            </div>
          </div>
        )}

      <div className="product-card bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-700 rounded-xl p-3 flex flex-col hover:border-gray-600 transition-all w-full max-w-[230px] mx-auto shadow-lg shadow-black/30">


          {/* Image */}
          <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-800">
            <img
              src={product.image ? `/${product.image}` : "/images/products/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/images/products/placeholder.jpg")}
            />
          </div>

          {/* Content */}
          <div className="mt-3 flex flex-col">
            <h3 className="text-white font-bold text-sm line-clamp-2 min-h-[38px]">
              {product.name}
            </h3>

            {/* Rating from backend (no hardcoded stars) */}
            {product.rating?.stars && (
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < product.rating.stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-gray-400 text-xs">({product.rating.count})</span>
              </div>
            )}

            {/* Price */}
            <div className="text-white text-lg font-semibold mt-2">
              {formatPrice(product.priceCents)}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-3">
              
              {/* Like Button */}
              <button
                onClick={toggleLike}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border text-xs ${
                  isLiked
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                {likes > 0 && <span>{likes}</span>}
              </button>

              {/* Add to Cart Button (FIXED ALIGNMENT) */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-white text-gray-900 font-medium text-xs hover:bg-gray-100 transition disabled:opacity-50"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="leading-none">
                  {isAdding ? "Adding..." : "Add"}
                </span>
              </button>

            </div>
          </div>
        </div>
      </>
    );
  }
