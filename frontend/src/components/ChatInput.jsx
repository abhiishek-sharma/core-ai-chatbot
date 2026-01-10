import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Zap, Command } from "lucide-react";

const ChatInput = ({ onSend, isLoading, onStop }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-core-500/50 transition-colors shadow-lg">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Core..."
              rows={1}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 py-3 px-4 focus:outline-none resize-none max-h-[200px]"
              disabled={isLoading}
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-1 p-2">
              {/* Send/Stop button */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  title="Stop generating"
                >
                  <Square size={20} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`p-2 rounded-lg transition-all ${
                    message.trim()
                      ? "bg-core-500 text-white hover:bg-core-600"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-slate-500 mt-3">
            Core can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
