import { useState } from "react";
import config from '../config';

function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm your Cyclone Assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // user message
    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "⚠️ Sorry, I'm having trouble connecting. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border">
          <div className="bg-blue-600 text-white p-3 font-bold">Cyclone Assistant</div>
          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[75%] ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              placeholder={isLoading ? "Sending..." : "Type a message..."}
              disabled={isLoading}
              className="flex-1 p-2 outline-none dark:bg-gray-900 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotFab;
