import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./api";
import Sidebar from "./components/Sidebar.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import ChatInput from "./components/ChatInput.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import { Menu, RotateCcw, Download, Copy, Check, Cpu, Zap } from "lucide-react";

const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt:
    "You are Core, a helpful AI assistant. You are knowledgeable, precise, and provide clear, well-structured responses. You can help with coding, writing, analysis, and problem-solving.",
  streaming: true,
};

function App() {
  // State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("core-ai-settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("core-ai-settings", JSON.stringify(settings));
  }, [settings]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const loadConversations = async () => {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const conv = await api.getConversation(conversationId);
      setMessages(conv.messages || []);
      setActiveConversationId(conversationId);
      setError(null);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setError("Failed to load conversation");
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setStreamingContent("");
    setError(null);
  };

  const handleSelectConversation = (conversationId) => {
    if (conversationId !== activeConversationId) {
      loadConversation(conversationId);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await api.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleRenameConversation = async (conversationId, newTitle) => {
    try {
      await api.updateConversation(conversationId, newTitle);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, title: newTitle } : c,
        ),
      );
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  };

  const handleSendMessage = useCallback(
    async (message) => {
      setIsLoading(true);
      setError(null);
      setStreamingContent("");

      // Add user message immediately
      const userMessage = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        if (settings.streaming) {
          // Streaming mode
          let fullContent = "";
          let newConvId = activeConversationId;

          await api.sendMessageStream(
            message,
            activeConversationId,
            settings.systemPrompt,
            settings.temperature,
            // onChunk
            (text, convId) => {
              fullContent += text;
              setStreamingContent(fullContent);
              if (convId && !newConvId) {
                newConvId = convId;
                setActiveConversationId(convId);
              }
            },
            // onDone
            async (convId) => {
              const assistantMessage = {
                role: "assistant",
                content: fullContent,
                timestamp: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
              setStreamingContent("");
              setIsLoading(false);
              if (convId) {
                setActiveConversationId(convId);
              }
              await loadConversations();
            },
            // onError
            (errorMsg) => {
              setError(errorMsg);
              setIsLoading(false);
              setStreamingContent("");
            },
          );
        } else {
          // Non-streaming mode
          const response = await api.sendMessage(
            message,
            activeConversationId,
            settings.systemPrompt,
            settings.temperature,
          );

          setMessages((prev) => [...prev, response.message]);
          setActiveConversationId(response.conversation_id);
          await loadConversations();
          setIsLoading(false);
        }
      } catch (err) {
        setError(err.message || "Failed to send message");
        setIsLoading(false);
      }
    },
    [activeConversationId, settings],
  );

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    if (streamingContent) {
      const assistantMessage = {
        role: "assistant",
        content: streamingContent + "\n\n*[Response stopped by user]*",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
    }
  };

  const handleExampleClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleCopyConversation = async () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Core"}: ${m.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportConversation = () => {
    const data = {
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `core-conversation-${activeConversationId || "new"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearConversation = async () => {
    if (activeConversationId) {
      try {
        await api.clearConversation(activeConversationId);
        setMessages([]);
      } catch (err) {
        console.error("Failed to clear conversation:", err);
      }
    } else {
      setMessages([]);
    }
  };

  // Combine messages with streaming content for display
  const displayMessages = streamingContent
    ? [
        ...messages,
        { role: "assistant", content: streamingContent, isStreaming: true },
      ]
    : messages;

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-transparent pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-core-500 to-core-600 rounded-lg flex items-center justify-center">
                <Cpu size={18} className="text-white" />
              </div>
              <span className="font-semibold text-slate-200 text-lg">Core</span>
            </div>
          </div>

          {/* Header actions */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearConversation}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear conversation"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handleCopyConversation}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Copy conversation"
              >
                {copied ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
              <button
                onClick={handleExportConversation}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Export conversation"
              >
                <Download size={18} />
              </button>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto relative">
          {displayMessages.length === 0 ? (
            <WelcomeScreen onExampleClick={handleExampleClick} />
          ) : (
            <div className="pb-6">
              {displayMessages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isStreaming={message.isStreaming && isLoading}
                />
              ))}

              {/* Typing indicator when loading but no streaming content yet */}
              {isLoading && !streamingContent && (
                <ChatMessage
                  message={{ role: "assistant", content: "" }}
                  isStreaming={true}
                />
              )}

              {/* Error message */}
              {error && (
                <div className="max-w-3xl mx-auto px-4 py-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          onStop={handleStop}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}

export default App;
