import React from "react";
import { Cpu, Code, Brain, Database, Terminal, Sparkles } from "lucide-react";

const WelcomeScreen = ({ onExampleClick }) => {

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo and Title */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-slate-600">
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



      {/* Footer hint */}
      <p className="text-sm text-slate-500 mt-12 animate-fade-in">
        Type a message below to start the chat
      </p>
    </div>
  );
};

export default WelcomeScreen;
