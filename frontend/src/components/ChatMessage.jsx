import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, User, Cpu, Zap } from "lucide-react";

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 glass border-b border-core-500/20 rounded-t-xl backdrop-blur-xl z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider ml-2">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-core-400 bg-slate-800/50 hover:bg-core-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-core-500/30"
        >
          {copied ? (
            <>
              <Check size={14} className="text-cyber-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-core-500/30 shadow-glow">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 12px 12px",
            paddingTop: "3.5rem",
            paddingBottom: "1.5rem",
            background: "linear-gradient(135deg, #0c1220 0%, #0a0a0f 100%)",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "#475569",
            userSelect: "none",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const MessageContent = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose max-w-none"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          if (!inline && (match || String(children).includes("\n"))) {
            return (
              <CodeBlock language={language}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1 py-2">
    <div className="w-2 h-2 bg-core-500 rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-core-500 rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-core-500 rounded-full typing-dot"></div>
  </div>
);

const ChatMessage = ({ message, isStreaming }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-enter py-6 ${
        isUser ? "bg-transparent" : "bg-slate-900/50"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              isUser
                ? "bg-gradient-to-br from-slate-600 to-slate-700"
                : "bg-gradient-to-br from-core-500 to-core-600"
            }`}
          >
            {isUser ? (
              <User size={18} className="text-slate-200" />
            ) : (
              <Cpu size={18} className="text-white" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-100 text-sm">
                {isUser ? "You" : "Core"}
              </span>
              {message.timestamp && (
                <span className="text-xs text-slate-500">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {isStreaming && !message.content ? (
              <TypingIndicator />
            ) : (
              <MessageContent content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
