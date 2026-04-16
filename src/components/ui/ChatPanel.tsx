import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Square, Search, Globe, User, Bot, ExternalLink, Cpu, BarChart3, Palette, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';
import { buildRequestConfig, AIConfig } from '../../lib/ai-router';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: string;
  citations?: { title: string; url: string }[];
  config?: AIConfig;
}

interface ChatPanelProps {
  onGenerate: (result: { steps: any[]; megaPrompt: string }) => void;
  isLoading: boolean;
}

export default function ChatPanel({ onGenerate, isLoading }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour ! Je suis l'Assistant Kodia. Décris-moi ton idée de SaaS et je t'aiderai à construire un plan stratégique complet.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<AIConfig | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, status]);

  const getContextIcon = (config: AIConfig) => {
    if (config.systemPrompt.includes("developer")) return <Cpu size={14} />;
    if (config.systemPrompt.includes("advisor")) return <BarChart3 size={14} />;
    if (config.systemPrompt.includes("creative director")) return <Palette size={14} />;
    if (config.systemPrompt.includes("research analyst")) return <GraduationCap size={14} />;
    return <Bot size={14} />;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isThinking) return;

    const config = buildRequestConfig(input);
    setCurrentConfig(config);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [userMessage, ...prev]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);

    try {
      // PASS 1: Broad Discovery (Detective Mode)
      setStatus("Mode Détective : Scan large du marché (Pass 1)...");
      
      const response = await fetch("/api/kodia-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, idea: currentInput })
      });

      if (!response.ok) throw new Error("Erreur serveur");
      
      const data = await response.json();

      // PASS 2: Deep-Dive (Detective Mode)
      setStatus("Mode Détective : Analyse approfondie et stratégie (Pass 2)...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Visual buffer

      setStatus("Synthèse Chameleon : Adaptation du ton et de la structure...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus(null);
      setIsThinking(false);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        config: config,
        citations: data.citations.map((c: string, i: number) => ({ title: `Source ${i + 1}`, url: c }))
      };

      setMessages(prev => [assistantMessage, ...prev]);
      onGenerate({ steps: data.steps, megaPrompt: data.megaPrompt });
    } catch (error) {
      console.error("Chat Error:", error);
      setStatus(null);
      setIsThinking(false);
      toast.error("Erreur lors de la recherche autonome.");
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass overflow-hidden border-green-500/20">
      {/* Header */}
      <div className="p-4 border-b border-green-500/10 bg-green-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            {currentConfig ? getContextIcon(currentConfig) : <Bot size={20} />}
          </div>
          <div>
            <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-sm">
              Assistant Kodia
              {currentConfig && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20">
                  {currentConfig.model}
                </span>
              )}
            </h3>
            <p className="text-[10px] font-sans text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {currentConfig ? "Mode Expert Activé" : "Connecté au Web en temps réel"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-md bg-white/50 border border-green-500/10 text-[10px] font-medium text-gray-500 flex items-center gap-1">
            <Globe size={10} /> Web Search Active
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 flex flex-col-reverse gap-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-green-600" />
                </div>
                <div className="glass p-3 rounded-2xl rounded-tl-none border-green-500/20 max-w-[85%]">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" />
                  </div>
                </div>
              </div>
              {status && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-sans text-gray-400 ml-11 italic"
                >
                  {status}
                </motion.p>
              )}
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-3",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-white border border-green-500/20" : "bg-green-600 text-white"
              )}>
                {msg.role === 'user' ? (
                  <User size={16} className="text-green-600" />
                ) : (
                  msg.config ? getContextIcon(msg.config) : <Bot size={16} />
                )}
              </div>
              <div className={cn(
                "p-4 rounded-2xl max-w-[85%] shadow-sm",
                msg.role === 'user' 
                  ? "bg-white border border-green-500/10 rounded-tr-none text-green-700 font-medium" 
                  : "glass border-green-500/10 rounded-tl-none text-gray-800"
              )}>
                <div className="prose prose-sm prose-green max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.citations && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-green-500/10">
                    {msg.citations.map((cite, i) => (
                      <a 
                        key={i} 
                        href={cite.url} 
                        className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/5 text-green-600 hover:bg-green-500/10 transition-colors border border-green-500/10"
                      >
                        {cite.title} <ExternalLink size={8} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-green-500/10 bg-white/30 backdrop-blur-sm">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Décris ton idée de SaaS..."
            className="flex-grow bg-white border border-green-500/20 rounded-full px-5 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
            disabled={isLoading || isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isThinking}
            className={cn(
              "absolute right-1.5 p-2 rounded-full transition-all",
              (isLoading || isThinking) 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20"
            )}
          >
            {isLoading || isThinking ? <Square size={16} fill="currentColor" /> : <Send size={16} />}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4">
           <p className="text-[10px] text-gray-400 text-center">
            Appuie sur Entrée pour envoyer
          </p>
        </div>
      </div>
    </div>
  );
}
