// src/pages/AiChatWidget.jsx
import { useState, useEffect, useRef } from "react";
import { ChatInput } from "../components/chat/Chatinput";
import { ChatMessage } from "../components/chat/ChatMesage";
import { ProductsGrid } from "../components/products/ProductsGrid";
import { Card, CardContent } from "../utils/basic-ui";
import { PixelAnimation } from "../components/ui/pixel-animation";
import { ChatErrorBoundary } from "../components/ui/ChatErrorBoundary";
import "./AiChatWidget.css";

export default function AiChatWidget() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          content: "Hello! I'm your shopping assistant. How can I help you today?",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  const shouldShowProductGrid = (userQuery, productCount) => {
    const query = userQuery.toLowerCase();
    const browsingKeywords = [
      "show me", "list", "all products", "display", "browse",
      "find me", "search for", "looking for", "need some",
      "want to see", "recommend", "suggest", "under",
      "less than", "between", "price range",
    ];
    const specificKeywords = [
      "what is", "tell me about", "details about",
      "information about", "describe", "price of", "cost of",
    ];
    const isSpecific = specificKeywords.some((k) => query.includes(k));
    if (isSpecific) return false;
    const isBrowsing = browsingKeywords.some((k) => query.includes(k));
    return isBrowsing || productCount > 2;
  };

  const fetchProductsByIds = async (productIds) => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/by-ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: productIds }),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.products || [];
    } catch {
      return [];
    }
  };

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: Date.now(),
      content: text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const endpoint = threadId
      ? `${BACKEND_URL}/chat/${threadId}`
      : `${BACKEND_URL}/chat`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const showGrid =
        data.productIds && data.productIds.length > 0
          ? shouldShowProductGrid(text, data.productIds.length)
          : false;

      const botMessage = {
        id: Date.now() + 1,
        content: data.response || "I apologize, but I couldn't process your request.",
        isBot: true,
        timestamp: new Date(),
        products: [],
        loadingProducts: false,
        showProductGrid: showGrid,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (showGrid && data.productIds && data.productIds.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id ? { ...msg, loadingProducts: true } : msg
          )
        );
        const products = await fetchProductsByIds(data.productIds);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, products, loadingProducts: false }
              : msg
          )
        );
      }

      if (data.threadId) setThreadId(data.threadId);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatErrorBoundary>
      {/* No header here — header is handled by the global layout */}
      <div className="relative flex justify-center px-6 py-6 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-80px)]">
        <PixelAnimation className="absolute inset-0" opacity={0.05} speed={1} />

        <Card className="relative w-full max-w-7xl flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="flex flex-col flex-1 overflow-y-auto space-y-3 p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-300">
                <p className="text-lg font-medium">🛍️ AI Shopping Assistant</p>
                <p className="text-sm mt-2">Start chatting with your assistant below.</p>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <div key={m.id} className="space-y-3">
                    <ChatMessage message={m} />
                    {m.isBot && m.showProductGrid && m.products && m.products.length > 0 && (
                      <div className="ml-11">
                        <ProductsGrid
                          products={m.products}
                          loading={m.loadingProducts}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="flex space-x-1">
                      {[0, 150, 300].map((delay) => (
                        <div
                          key={delay}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-sm">AI is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </Card>
      </div>
    </ChatErrorBoundary>
  );
}
