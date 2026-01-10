import React from "react";
import { Cpu, Code, Brain, Database, Terminal, Sparkles } from "lucide-react";

const WelcomeScreen = ({ onExampleClick }) => {
  const examples = [
    {
      icon: Code,
      title: "Write Code",
      prompt:
        "Write a Python function to implement a binary search tree with insert, search, and delete operations",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Explain Concepts",
      prompt: "Explain how neural networks work in simple terms",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Terminal,
      title: "Debug Problems",
      prompt:
        "Help me debug this JavaScript error: 'Cannot read property of undefined'",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Database,
      title: "Design Systems",
      prompt: "Design a scalable database schema for an e-commerce platform",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Sparkles,
      title: "Creative Tasks",
      prompt: "Help me brainstorm ideas for a mobile app",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo and Title */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-core-500 to-core-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Cpu size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">
          Welcome to Core
        </h1>
        <p className="text-lg text-slate-400 max-w-md">
          Your AI assistant powered by advanced language models. I can help you
          with coding, writing, analysis, and much more.
        </p>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full animate-slide-up">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example.prompt)}
            className="group relative p-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`w-10 h-10 bg-gradient-to-br ${example.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <example.icon size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-slate-100 mb-1">
              {example.title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2">
              {example.prompt}
            </p>

            {/* Hover arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-sm text-slate-500 mt-12 animate-fade-in">
        Type a message below or click an example to get started
      </p>
    </div>
  );
};

export default WelcomeScreen;
