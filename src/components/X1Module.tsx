import React, { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Project } from "../types";

interface X1ModuleProps {
  project: Project;
}

export default function X1Module({ project }: X1ModuleProps) {
  const [activeX1Category, setActiveX1Category] = useState<keyof Project["x1"]>("whatsapp");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const labelMap: Record<string, string> = {
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    discord: "Discord",
    reddit: "Reddit",
    forums: "Fóruns"
  };

  return (
    <div className="space-y-6">
      {/* Inner Horizontal Subtabs for Categories */}
      <div className="flex flex-wrap gap-2.5 border-b border-zinc-800 pb-4">
        {(Object.keys(project.x1) as Array<keyof Project["x1"]>).map((key) => {
          const item = project.x1[key];
          const isSelected = activeX1Category === key;
          return (
            <button
              key={key}
              onClick={() => setActiveX1Category(key)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSelected 
                  ? "border-red-500 bg-red-500/10 text-white shadow-md font-black" 
                  : "border-zinc-800 bg-black/30 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {labelMap[key] || item.category}
            </button>
          );
        })}
      </div>

      {/* Main outreach card display */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl relative shadow-2xl space-y-6">
        <div className="border-b border-zinc-850 pb-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">NOME DO CANAL</span>
          <h3 className="text-base sm:text-lg font-mono font-black text-white mt-0.5">
            Canal Ativo: {labelMap[activeX1Category] || project.x1[activeX1Category].category} (Abordagem Orgânica)
          </h3>
          <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">
            <span className="text-zinc-500 uppercase font-mono text-[9px] block">DESCRIÇÃO E ESTRATÉGIA</span>
            Roteiro estruturado focado em conversão individual do avatar do nicho de {project.niche} no {labelMap[activeX1Category] || project.x1[activeX1Category].category}. Use com sabedoria para gerar confiança mútua antes de enviar ofertas.
          </p>
        </div>

        {/* Communities list inside card */}
        {project.x1[activeX1Category].communities && project.x1[activeX1Category].communities.length > 0 && (
          <div className="space-y-3">
            <p className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-1.5">
              <ExternalLink size={12} className="text-red-500" />
              Comunidades e Ecossistemas Recomendados:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.x1[activeX1Category].communities.map((comm, idx) => (
                <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-zinc-100">{comm.name}</p>
                    <span className="text-[9px] font-mono text-red-500 font-bold bg-red-500/5 border border-red-500/10 px-1.5 py-0.5 rounded">{comm.size}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{comm.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outreach Template Box */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-1.5">
              <Copy size={12} className="text-red-500" />
              MENSAGEM SUGERIDA / SCRIPT COPIÁVEL:
            </p>
            
            <button
              onClick={() => handleCopy(project.x1[activeX1Category].templateMessage, activeX1Category)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
            >
              {copiedText === activeX1Category ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              <span>{copiedText === activeX1Category ? "Copiado!" : "Copiar Script"}</span>
            </button>
          </div>

          <div className="p-5 bg-black border border-zinc-850 text-xs text-zinc-300 leading-relaxed font-sans rounded-xl whitespace-pre-wrap select-text shadow-inner border border-zinc-800">
            {project.x1[activeX1Category].templateMessage}
          </div>
        </div>

        {/* Tactical Observations / Guidelines */}
        <div className="p-4.5 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-1.5">
          <p className="text-[9px] font-mono uppercase text-red-500 font-black tracking-widest">OBSERVAÇÃO E RECOMENDAÇÃO TÁTICA</p>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            {activeX1Category === "whatsapp" && "Não envie links e faturas na primeira mensagem. Estimule o diálogo oferecendo ajudar honestamente com a sua experiência. Transmita credibilidade."}
            {activeX1Category === "facebook" && "Participe de discussões existentes respondendo dúvidas com alto valor. Use este script somente inbox para contatos selecionados."}
            {activeX1Category === "telegram" && "Evite importunar usuários em massa. Filtre as discussões ativas, solucione dúvidas e encaminhe o roteiro apenas se demonstrado interesse."}
            {activeX1Category === "discord" && "Evite postar scripts em canais gerais públicos se for contra as regras do servidor. Construa reputação profissional participando ativamente."}
            {activeX1Category === "reddit" && "O Reddit possui um filtro antipropaganda severo. Customize o linguajar para soar natural, humilde e direto de pessoa física para pessoa física."}
            {activeX1Category === "forums" && "Poste respostas completas nos fóruns e conclua oferecendo o material complementar de forma gratuita aos membros interessados."}
          </p>
        </div>
      </div>
    </div>
  );
}
