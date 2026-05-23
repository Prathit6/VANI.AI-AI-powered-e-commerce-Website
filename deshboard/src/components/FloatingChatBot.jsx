// src/components/FloatingChatBot.jsx
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./FloatingChatBot.css";

const BACKEND_URL = "http://localhost:8000";

export default function FloatingChatBot() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);

  // Only show for logged-in users
  if (!userInfo) return null;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add greeting when panel opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([
        {
          id: Date.now(),
          content: "Hi! I'm your shopping assistant. Ask me anything about products!",
          isBot: true,
        },
      ]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content: text, isBot: false },
    ]);
    setIsLoading(true);

    const endpoint = threadId
      ? `${BACKEND_URL}/chat/${threadId}`
      : `${BACKEND_URL}/chat`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: data.response || "Sorry, something went wrong.",
          isBot: true,
          hasProducts: data.productIds && data.productIds.length > 0,
        },
      ]);

      if (data.threadId) setThreadId(data.threadId);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Couldn't connect to server. Please try again.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openFullChat = () => {
    setIsOpen(false);
    navigate("/aiassistant");
  };

  return (
    <>
      {/* Pulse ring behind the button */}
      {!isOpen && <div className="fcb-pulse" />}

      {/* Main FAB button */}
      <button
        className={`fcb-btn ${isOpen ? "fcb-btn--open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open AI shopping assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            // X icon when open
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            // Robot icon when closed
            <>
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <line x1="12" y1="7" x2="12" y2="11" />
              <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5" />
              <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </>
          )}
        </svg>

        {/* Tooltip on hover (only when closed) */}
        {!isOpen && (
          <span className="fcb-tooltip" role="tooltip">
            Use chatbot for product discovery
          </span>
        )}
      </button>

      {/* Slide-up chat panel */}
      <div className={`fcb-panel ${isOpen ? "fcb-panel--open" : ""}`} role="dialog" aria-label="AI Shopping Assistant">
        {/* Panel header */}
        <div className="fcb-panel-header">
          <div className="fcb-panel-header-left">
            <div className="fcb-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <line x1="12" y1="7" x2="12" y2="11" />
                <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5" />
                <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <p className="fcb-panel-title">Shopping Assistant</p>
              <p className="fcb-panel-sub">AI-powered product discovery</p>
            </div>
          </div>
          <button className="fcb-expand-btn" onClick={openFullChat} title="Open full chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="fcb-messages">
          {messages.map((m) => (
            <div key={m.id} className={`fcb-msg ${m.isBot ? "fcb-msg--bot" : "fcb-msg--user"}`}>
              {m.content}
              {m.isBot && m.hasProducts && (
                <button className="fcb-view-products-btn" onClick={openFullChat}>
                  View products →
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="fcb-msg fcb-msg--bot fcb-typing">
              <span /><span /><span />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input row */}
        <div className="fcb-input-row">
          <input
            type="text"
            className="fcb-input"
            placeholder="Ask about products..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            className="fcb-send-btn"
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop to close on outside click */}
      {isOpen && <div className="fcb-backdrop" onClick={() => setIsOpen(false)} />}
    </>
  );
}
