"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, MessageCircle, Loader2 } from "lucide-react";

export default function ChatBot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();

      const aiMessage = { sender: "ai", text: data.reply || "No response." };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] md:bg-[size:100px_100px]"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 max-w-4xl w-full h-[85vh] md:h-[700px] hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 flex flex-col shadow-xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6 flex-shrink-0">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Champak AI
            </span>
          </h2>
          <p className="text-white/70 text-xs md:text-sm">
            Powered by Champak AI Engine
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 overflow-y-auto mb-4 md:mb-6 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full p-6 mb-4">
                <MessageCircle className="w-8 h-8 md:w-12 md:h-12 text-white/60" />
              </div>
              <p className="text-white/80 text-lg md:text-xl mb-2 font-medium">Start a conversation</p>
              <p className="text-white/50 text-sm md:text-base">Ask me anything, I'm here to help!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 md:gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-green-500 to-blue-500"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-blue-600/40 to-purple-600/40 border border-blue-400/40 text-white"
                        : "bg-white/10 border border-white/20 text-white/90"
                    } backdrop-blur-sm`}
                  >
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start gap-2 md:gap-3 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="bg-white/10 border border-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex-shrink-0">
          <div className="flex gap-2 md:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                className="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none resize-none text-sm md:text-base"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '128px'
                }}
                disabled={loading}
              />
              <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold rounded-xl md:rounded-2xl transition-all duration-300 flex items-center gap-2 text-sm md:text-base min-h-[44px] ${
                loading || !input.trim()
                  ? "bg-white/10 text-white/50 cursor-not-allowed border border-white/20"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 border-none active:scale-95"
              }`}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>

          {/* Footer hint */}
          <div className="mt-2 md:mt-3 text-center">
            <p className="text-white/40 text-xs">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}