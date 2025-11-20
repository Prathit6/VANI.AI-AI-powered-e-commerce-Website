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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show initial greeting message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage = {
        id: Date.now(),
        content: "Hello! I'm your shopping assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [messages.length]);

  // Check if user query is asking for product listing/browsing
  const shouldShowProductGrid = (userQuery, productCount) => {
    const query = userQuery.toLowerCase();
    
    // Keywords that indicate browsing/listing (show grid)
    const browsingKeywords = [
      'show me',
      'list',
      'all products',
      'display',
      'browse',
      'find me',
      'search for',
      'looking for',
      'need some',
      'want to see',
      'recommend',
      'suggest',
      'under',
      'less than',
      'between',
      'price range'
    ];
    
    // Keywords that indicate specific product query (don't show grid)
    const specificKeywords = [
      'what is',
      'tell me about',
      'details about',
      'information about',
      'describe',
      'price of',
      'cost of'
    ];
    
    // Check if it's a specific product query
    const isSpecific = specificKeywords.some(keyword => query.includes(keyword));
    if (isSpecific) {
      return false; // Don't show grid for specific queries
    }
    
    // Check if it's a browsing query
    const isBrowsing = browsingKeywords.some(keyword => query.includes(keyword));
    
    // Show grid if:
    // 1. It's a browsing query OR
    // 2. Multiple products returned (more than 2)
    return isBrowsing || productCount > 2;
  };

  // Fetch full product details by IDs
  const fetchProductsByIds = async (productIds) => {
    try {
      console.log("🔍 Fetching products for IDs:", productIds);
      
      const response = await fetch(`${BACKEND_URL}/products/by-ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: productIds,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log("✅ Fetched products:", data.products?.length || 0);
      return data.products || [];
    } catch (error) {
      console.error("❌ Error fetching products:", error);
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
      console.log("📤 Sending message:", text);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Backend response:", data);

      // Check if we should show product grid based on query and product count
      const showGrid = data.productIds && data.productIds.length > 0 
        ? shouldShowProductGrid(text, data.productIds.length)
        : false;

      console.log(`🎨 Show product grid: ${showGrid} (${data.productIds?.length || 0} products)`);

      // Create initial bot message
      const botMessage = {
        id: Date.now() + 1,
        content: data.response || "I apologize, but I couldn't process your request.",
        isBot: true,
        timestamp: new Date(),
        products: [],
        loadingProducts: false,
        showProductGrid: showGrid, // NEW: Flag to control grid display
      };

      setMessages((prev) => [...prev, botMessage]);

      // Only fetch and show products if showGrid is true
      if (showGrid && data.productIds && data.productIds.length > 0) {
        console.log("📦 Fetching product details for grid...");
        
        // Set loading state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, loadingProducts: true }
              : msg
          )
        );

        const products = await fetchProductsByIds(data.productIds);
        
        console.log("✅ Products fetched:", products.length);
        
        // Update the message with fetched products
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, products, loadingProducts: false }
              : msg
          )
        );
      }

      if (data.threadId) {
        setThreadId(data.threadId);
        console.log("🔗 Thread ID:", data.threadId);
      }
    } catch (error) {
      console.error("❌ Error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatErrorBoundary>
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
                    
                    {/* Only display ProductsGrid if showProductGrid flag is true */}
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
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-sm">AI is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading}
            />
          </div>
        </Card>
      </div>
    </ChatErrorBoundary>
  );
}