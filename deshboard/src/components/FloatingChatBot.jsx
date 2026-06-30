// src/components/FloatingChatBot.jsx
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./FloatingChatBot.css";

export default function FloatingChatBot() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Only show for logged-in users
  if (!userInfo) return null;

  // Don't show on the AI assistant page itself
  if (location.pathname === "/aiassistant") return null;

  return (
    <>
      <div className="fcb-pulse" />
      <button
        className="fcb-btn"
        onClick={() => navigate("/aiassistant")}
        aria-label="Open AI shopping assistant"
      >
        {/* Robot icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <line x1="12" y1="7" x2="12" y2="11" />
          <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5" />
          <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>

        <span className="fcb-tooltip" role="tooltip">
          AI Shopping Assistant
        </span>
      </button>
    </>
  );
}
