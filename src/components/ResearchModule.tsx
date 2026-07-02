import React from "react";
import { Target, ShieldAlert, Award } from "lucide-react";
import { Project } from "../types";

interface ResearchModuleProps {
  project: Project;
}

export default function ResearchModule({ project }: ResearchModuleProps) {
  const research = project.research || {
    avatar: {
      name: "Avatar Geral",
      idealAudience: "O público ideal de alta conversão para o nicho de " + project.niche + ".",
      age: "N/A",
      profession: "N/A",
      income: "N/A",
      city: "N/A",
      interests: ["Praticidade", "Desenvolvimento", "Resultados"],
      pains: [
        "Falta de tempo para estruturar um plano claro de evolução",
        "Sensação de sobrecarga por excesso de informações desorganizadas"
      ],
      dreams: [
        "Conquistar autonomia e clareza no processo",
        "Atingir alta performance com foco e consistência"
      ]
    },
    tomDeVoz: "Profissional, direto ao ponto e encorajador.",
    palavrasConvertem: ["Evolução", "Método Prático", "Resultados", "Estrutura", "Consistência"]
  };

  const avatar = research.avatar || {
    name: "Avatar Geral",
    idealAudience: "O público ideal de alta conversão para o nicho de " + project.niche + ".",
    age: "N/A",
    profession: "N/A",
    income: "N/A",
    city: "N/A",
    interests: ["Praticidade", "Desenvolvimento", "Resultados"],
    pains: [
      "Falta de tempo para estruturar um plano claro de evolução",
      "Sensação de sobrecarga por excesso de informações desorganizadas"
    ],
    dreams: [
      "Conquistar autonomia e clareza no processo",
      "Atingir alta performance com foco e consistência"
    ]
  };

  const interests = avatar.interests || [];
  const pains = avatar.pains || [];
  const dreams = avatar.dreams || [];
  const palavrasConvertem = research.palavrasConvertem || [];

  return (
    <div className="space-y-8">
      {/* Profile/Avatar Header Info Summary */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3 md:border-r md:border-zinc-800/80 md:pr-6">
          <p className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest flex items-center gap-1.5">
            <Target size={12} />
            AVATAR DE ALTA CONVERSÃO
          </p>
          <h3 className="text-2xl font-serif font-black text-white">{avatar.name}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">{avatar.idealAudience}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:border-r md:border-zinc-800/80 md:px-6">
          <div>
            <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Faixa Etária</p>
            <p className="text-xs font-bold text-zinc-200 mt-0.5">{avatar.age}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Profissão Principal</p>
            <p className="text-xs font-bold text-zinc-200 mt-0.5">{avatar.profession}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Renda Média</p>
            <p className="text-xs font-bold text-zinc-200 mt-0.5">{avatar.income}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Localidade</p>
            <p className="text-xs font-bold text-zinc-200 mt-0.5">{avatar.city}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Interesses Dominantes:</p>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest, idx) => (
              <span key={idx} className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 text-zinc-300 px-2 py-1 rounded">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pains and Dreams Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dores Recorrentes */}
        <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-red-500" />
            DORES & PONTOS DE FRUSTRAÇÃO REAIS
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
            Use estes tópicos como gatilhos de empatia na comunicação do 1x1. Demonstre compreender esses sentimentos para derrubar a desconfiança inicial.
          </p>
          <ul className="space-y-3 font-sans text-xs text-zinc-300 font-medium">
            {pains.map((pain, idx) => (
              <li key={idx} className="flex gap-2.5 items-start bg-red-950/40 border border-red-700/40 p-3 rounded-xl">
                <span className="text-red-500 font-bold mt-0.5 shrink-0">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sonhos e Desejos */}
        <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-xs font-mono uppercase text-emerald-500 font-bold tracking-widest flex items-center gap-1.5">
            <Award size={14} className="text-emerald-500" />
            SONHOS, OBJETIVOS & DESEJOS PRINCIPAIS
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
            Apresente o seu infoproduto como a ponte direta para alcançar estes estados emocionais e práticos de liberdade.
          </p>
          <ul className="space-y-3 font-sans text-xs text-zinc-300 font-medium">
            {dreams.map((dream, idx) => (
              <li key={idx} className="flex gap-2.5 items-start bg-emerald-950/5 border border-emerald-950/20 p-3 rounded-xl">
                <span className="text-emerald-500 font-bold mt-0.5 shrink-0">•</span>
                <span>{dream}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Marketing Promessas, Objeções and Tom de Voz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tom de voz */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Tom de Voz Recomendado</p>
          <p className="text-xs font-bold text-zinc-200">{research.tomDeVoz}</p>
        </div>
        
        {/* Palavras que convertem */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Palavras-Chave de Conversão</p>
          <p className="text-xs font-mono font-bold text-red-500">{palavrasConvertem.join(" • ")}</p>
        </div>

        {/* Tom geral do infoproduto */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Garantia Implícita Sugerida</p>
          <p className="text-xs font-bold text-zinc-200">Garantia incondicional de 7 dias com suporte via direct.</p>
        </div>
      </div>
    </div>
  );
}
