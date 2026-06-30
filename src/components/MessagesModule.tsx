import React, { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";
import { Project } from "../types";

interface MessagesModuleProps {
  project: Project;
}

export default function MessagesModule({ project }: MessagesModuleProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl space-y-1.5">
        <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2">
          <MessageSquare size={15} />
          CADERNO DE COPYS & FLUXO DE RESPOSTAS NO 1X1
        </h3>
        <p className="text-xs text-zinc-500 font-medium">
          Roteiros estratégicos complementares de quebra de objeções e acompanhamentos (follow-up) para utilizar com as interações do funil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section A: Acompanhamentos */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">FLUXOS DE ACOMPANHAMENTO (FOLLOW-UP)</h4>
          
          {/* Follow-up 1 */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 relative">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-mono text-red-500 font-bold">F1 • 24 HORAS APÓS CONTATO</span>
              <button
                onClick={() => handleCopy("Olá! Passando para saber se conseguiu dar uma olhada no sumário executivo que te enviei ontem sobre as estratégias. Acredito de verdade que o pilar de transição prática faça muito sentido para o seu momento. Alguma dúvida?", "F1")}
                className="text-[9px] text-zinc-500 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedText === "F1" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                <span>{copiedText === "F1" ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Olá! Passando para saber se conseguiu dar uma olhada no sumário executivo que te enviei ontem sobre as estratégias. Acredito de verdade que o pilar de transição prática faça muito sentido para o seu momento. Alguma dúvida?"
            </p>
          </div>

          {/* Follow-up 2 */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 relative">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-mono text-red-500 font-bold">F2 • 3 DIAS APÓS SEM RETORNO</span>
              <button
                onClick={() => handleCopy("Opa! Tudo bem? Acabei de ver um insight novo sobre este mercado e lembrei da nossa conversa. Queria te liberar um bônus especial de acompanhamento se fecharmos o acesso hoje, topo?", "F2")}
                className="text-[9px] text-zinc-500 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedText === "F2" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                <span>{copiedText === "F2" ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Opa! Tudo bem? Acabei de ver um insight novo sobre este mercado e lembrei da nossa conversa. Queria te liberar um bônus especial de acompanhamento se fecharmos o acesso hoje, topo?"
            </p>
          </div>
        </div>

        {/* Section B: Objeções */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">QUEBRA DE OBJEÇÕES MAIS COMUNS</h4>

          {/* Objeção: "Está Caro" */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-mono text-amber-500 font-bold">OBJEÇÃO: ESTÁ CARO / SEM DINHEIRO</span>
              <button
                onClick={() => handleCopy("Compreendo totalmente! O valor é um investimento inicial pequeno comparado ao erro de continuar perdendo dinheiro todos os meses por falta de orientação. Além disso, você tem a garantia de satisfação ou reembolso total.", "OBJ_CARO")}
                className="text-[9px] text-zinc-500 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedText === "OBJ_CARO" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                <span>{copiedText === "OBJ_CARO" ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Compreendo totalmente! O valor é um investimento inicial pequeno comparado ao erro de continuar perdendo dinheiro todos os meses por falta de orientação. Além disso, você tem a garantia de satisfação ou reembolso total."
            </p>
          </div>

          {/* Objeção: "Não tenho certeza se serve para mim" */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-mono text-amber-500 font-bold">OBJEÇÃO: SERVE PARA MIM?</span>
              <button
                onClick={() => handleCopy("O método foi desenhado especificamente pensando em pessoas com rotinas ocupadas e dores similares às suas. Começamos do absoluto zero e de forma bem tática, sem enrolação teórica.", "OBJ_SERVE")}
                className="text-[9px] text-zinc-500 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedText === "OBJ_SERVE" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                <span>{copiedText === "OBJ_SERVE" ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "O método foi desenhado especificamente pensando em pessoas com rotinas ocupadas e dores similares às suas. Começamos do absoluto zero e de forma bem tática, sem enrolação teórica."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
