import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Sparkles, 
  Coins, 
  User, 
  Bot, 
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Project } from "../types";

interface AIChatModuleProps {
  project: Project;
  onUpdateProject?: (project: Project) => void;
  credits: number;
  consumeCredits?: (amount: number) => boolean;
}

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export default function AIChatModule({
  project,
  onUpdateProject,
  credits,
  consumeCredits
}: AIChatModuleProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    return project.aiChatHistory || [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sync messages if project changes
  useEffect(() => {
    setMessages(project.aiChatHistory || []);
  }, [project.id, project.aiChatHistory]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText) return;

    // Check and consume 1 credit
    if (consumeCredits) {
      const success = consumeCredits(1);
      if (!success) {
        // Insufficient credits (consumeCredits handles opening the modal)
        return;
      }
    }

    if (!textToSend) {
      setInput("");
    }
    setError(null);
    setIsLoading(true);

    const userMsg: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);

    try {
      const response = await fetch("/api/project-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          messages: updatedHistory
        })
      });

      const resData = await response.json();

      if (resData && resData.success && resData.reply) {
        const modelMsg: Message = {
          role: "model",
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        };

        const finalHistory = [...updatedHistory, modelMsg];
        setMessages(finalHistory);

        // Update project state persistently
        if (onUpdateProject) {
          const currentCreditsUsed = project.creditsUsed || (project.type === "site" ? 20 : project.type === "landing_page" ? 12 : 10);
          onUpdateProject({
            ...project,
            aiChatHistory: finalHistory,
            chatMessagesCount: (project.chatMessagesCount || 0) + 1,
            creditsUsed: currentCreditsUsed + 1,
            lastEditAt: new Date().toLocaleDateString("pt-BR")
          });
        }
      } else {
        throw new Error(resData.error || "Formato de resposta inválido.");
      }
    } catch (err: any) {
      console.error("Erro no chat do projeto:", err);
      setError("Não foi possível obter resposta do Assistente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    { text: "Melhore o capítulo 2.", label: "Melhorar Cap. 2" },
    { text: "Deixe esse Ebook mais profissional.", label: "Ebook Profissional" },
    { text: "Escreva de forma mais persuasiva.", label: "Mais Persuasivo" },
    { text: "Troque o título por um melhor.", label: "Trocar Título" },
    { text: "Crie uma oferta irresistível.", label: "Criar Oferta" },
    { text: "Crie um bônus exclusivo.", label: "Criar Bônus" },
    { text: "Melhore a chamada de ação (CTA).", label: "Melhorar CTA" },
    { text: "Escreva com foco no público feminino.", label: "Público Feminino" },
    { text: "Escreva simplificado para iniciantes.", label: "Para Iniciantes" }
  ];

  return (
    <div className="flex flex-col h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative" id="ai-chat-module">
      {/* Top Header details */}
      <div className="p-4 sm:p-5 border-b border-zinc-900 bg-zinc-900/40 flex justify-between items-center flex-wrap gap-4 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">
              ASSISTENTE IA NEXUS
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium">
              Especialista em marketing alinhado ao seu projeto
            </p>
          </div>
        </div>

        {/* Credits counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-850 rounded-xl shadow-inner">
          <Coins size={12} className="text-red-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Créditos Restantes:</span>
          <span className="text-xs font-mono font-black text-white">{credits} cr</span>
        </div>
      </div>

      {/* Message space */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 min-h-0 bg-black/10 select-text">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5 py-8 select-none">
            <div className="w-14 h-14 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
              <Bot size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-200">
                Olá! Eu sou o seu Assistente de Copy & Estratégia
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Estudei todo o seu projeto de <strong>{project.type === "site" ? "Site Oficial" : project.type === "landing_page" ? "Landing Page" : "Ebook"}</strong> ("{project.name}"). Pergunte-me qualquer melhoria, reformulação ou scripts promocionais para alavancar suas vendas no X1!
              </p>
            </div>

            <div className="w-full text-left bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold mb-2">Sugestões Rápidas:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {suggestedPrompts.slice(0, 4).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p.text)}
                    className="text-[10px] text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-750 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer truncate font-medium"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[9px] font-mono text-zinc-600 font-bold uppercase">
              • Custo: 1 crédito por mensagem enviada •
            </div>
          </div>
        ) : (
          <div className="space-y-4 pr-1">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                  }`}>
                    {isUser ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser 
                        ? "bg-red-600 text-white rounded-tr-none" 
                        : "bg-zinc-900 border border-zinc-850/80 text-zinc-200 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[8px] text-zinc-600 font-mono font-bold uppercase tracking-wider px-1 ${
                      isUser ? "text-right" : "text-left"
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3 max-w-3xl mr-auto">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Bot size={13} className="animate-pulse" />
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-850/80 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested prompts horizontal scroll (Only shows when chat already has content) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950 flex gap-2 overflow-x-auto select-none no-scrollbar">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isLoading) handleSend(p.text);
              }}
              disabled={isLoading}
              className="shrink-0 text-[10px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 items-center"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte ao Assistente IA sobre o seu projeto... (ex: 'Escreva de forma mais persuasiva.')"
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl px-3.5 py-3 h-11 text-xs sm:text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none overflow-hidden max-h-11"
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md shadow-red-600/10 cursor-pointer"
          >
            <Send size={14} className="stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}
