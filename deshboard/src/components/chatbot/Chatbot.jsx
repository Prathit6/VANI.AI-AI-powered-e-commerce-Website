import { useState } from "react";
import axios from "axios";

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm your AI shopping assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 👇 This calls your backend Flask API
      const res = await axios.post("/api/chat", { message: input });
      const botMsg = { from: "bot", text: res.data.reply || "Sorry, I didn’t get that." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-3 font-semibold text-center">
        🛍️ AI Shopping Assistantiii
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[80%] ${
                msg.from === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic">AI is thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 outline-none text-sm"
          placeholder="Ask about products, prices, or categories..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};
