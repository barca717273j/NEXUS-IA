import React from "react";
import { motion } from "motion/react";
import { Layout, ShieldCheck, ShieldAlert, Award, Check } from "lucide-react";
import { Project } from "../types";

interface LandingPageModuleProps {
  project: Project;
  onUpdateProject?: (project: Project) => void;
}

export default function LandingPageModule({ project, onUpdateProject }: LandingPageModuleProps) {
  const defaultLandingPage = project.landingPage || {
    productName: project.ebook.title || "Método Exclusivo",
    niche: project.niche,
    objective: project.objective,
    headline: `Como Dominar ${project.niche} e Alcançar Resultados Extraordinários Sem Complicações`,
    subheadline: "O método definitivo passo a passo estruturado para quem deseja destravar seu potencial financeiro começando do zero.",
    benefits: [
      "Acesso imediato ao roteiro tático validado passo a passo",
      "Modelos copiáveis prontos para usar nas abordagens",
      "Garantia blindada de satisfação de 7 dias"
    ],
    problems: [
      "Perda de tempo tentando métodos antigos e obsoletos",
      "Falta de direcionamento claro e acompanhamento estruturado",
      "Overdose de informações contraditórias na internet"
    ],
    solutions: [
      "Cronograma didático direto ao ponto voltado para execução",
      "Exemplos reais e orientações de profissionais gabaritados",
      "Suporte exclusivo direto via canais de suporte"
    ],
    testimonials: [
      { name: "Carlos Eduardo", role: "Empreendedor Digital", text: "Este infoproduto mudou completamente a minha visão estratégica. O conteúdo é prático e direto." },
      { name: "Mariana Costa", role: "Consultora", text: "A facilidade de aplicação me surpreendeu. Em menos de duas semanas já tive os primeiros resultados." }
    ],
    guarantee: "Se em até 7 dias você achar que o conteúdo não agregou valor ao seu desenvolvimento profissional, devolvemos 100% do seu investimento sem burocracia.",
    faqs: [
      { question: "Como recebo o acesso ao produto?", answer: "Imediatamente após a confirmação da compra você receberá o link de download e instruções no seu e-mail cadastrado." },
      { question: "Preciso ter experiência prévia?", answer: "Não, o método foi estruturado desde os conceitos mais básicos até as técnicas mais avançadas do mercado." }
    ],
    cta: "Adquirir Infoproduto Agora"
  };

  const handleLPChange = (field: keyof typeof defaultLandingPage, value: any) => {
    if (!onUpdateProject) return;
    const updatedLP = { ...defaultLandingPage, [field]: value };
    onUpdateProject({ ...project, landingPage: updatedLP });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Pane: LP Editors */}
      <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="border-b border-zinc-850 pb-4">
          <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2">
            <Layout size={15} />
            EDITOR DE LANDING PAGE
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium mt-1">
            Edite as seções da sua página de vendas. Todas as alterações serão refletidas em tempo real.
          </p>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Título Principal (Headline)</label>
            <textarea
              value={defaultLandingPage.headline}
              onChange={(e) => handleLPChange("headline", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Subtítulo (Subheadline)</label>
            <textarea
              value={defaultLandingPage.subheadline}
              onChange={(e) => handleLPChange("subheadline", e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Modelo de Garantia (Editável)</label>
            <textarea
              value={defaultLandingPage.guarantee}
              onChange={(e) => handleLPChange("guarantee", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Chamada de Ação (CTA)</label>
            <input
              type="text"
              value={defaultLandingPage.cta}
              onChange={(e) => handleLPChange("cta", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck size={14} className="text-red-500 shrink-0 mt-0.5" />
          <span>Nenhum placeholder falso é gerado. Sua página está pronta para publicação. Use a visualização ao lado para revisar.</span>
        </div>
      </div>

      {/* Right Pane: Visual LP Preview */}
      <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
        {/* Browser top-bar */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="flex-1 bg-black/60 text-zinc-500 text-[10px] font-mono text-center py-1 rounded-md border border-zinc-800/60 mx-4 max-w-sm">
            https://nexuspages.io/live-preview
          </div>
        </div>

        {/* Simulated LP scrollable viewport */}
        <div className="flex-1 overflow-y-auto max-h-[600px] p-6 sm:p-10 bg-black text-zinc-200 space-y-12 select-none">
          {/* Hero section */}
          <div className="text-center space-y-4 py-6 border-b border-zinc-900">
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-500 font-mono font-black uppercase rounded-full">
              MÉTODO EXCLUSIVO REVELADO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight max-w-xl mx-auto">
              {defaultLandingPage.headline}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              {defaultLandingPage.subheadline}
            </p>
            <div className="pt-4">
              <span className="px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/10 hover:bg-red-500 transition-all cursor-default">
                {defaultLandingPage.cta}
              </span>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest text-center">Vantagens e Benefícios</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultLandingPage.benefits.map((benefit, idx) => (
                <div key={idx} className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl flex gap-3 items-start">
                  <div className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} className="text-emerald-500" />
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Problems vs Solutions split block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Problems */}
            <div className="p-5 bg-red-950/[0.02] border border-red-900/10 rounded-xl space-y-3">
              <p className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-red-500" /> O Problema
              </p>
              <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                {defaultLandingPage.problems.map((problem, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="p-5 bg-emerald-950/[0.02] border border-emerald-900/10 rounded-xl space-y-3">
              <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shrink-0">
                  <Check size={8} className="text-emerald-500" />
                </div>
                A Solução Nexus
              </p>
              <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                {defaultLandingPage.solutions.map((sol, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Testimonials Ficticios Claramente Marcados */}
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-1">
              <h4 className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest">Opinião de Clientes Validados</h4>
              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black bg-zinc-900 px-2 py-0.5 border border-zinc-800 rounded">Depoimentos Fictícios de Exemplo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultLandingPage.testimonials.map((t, i) => (
                <div key={i} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl relative">
                  <p className="text-xs text-zinc-300 italic mb-3">"{t.text}"</p>
                  <div className="border-t border-zinc-850 pt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-200">{t.name}</p>
                      <p className="text-[8px] text-zinc-500 font-mono mt-0.5">{t.role}</p>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold">Validado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee box */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex gap-4 items-center">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 shrink-0">
              <Award size={24} />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-zinc-100 uppercase font-mono tracking-wider">GARANTIA INCONDICIONAL DE SATISFAÇÃO DE 7 DIAS</h5>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{defaultLandingPage.guarantee}</p>
            </div>
          </div>

          {/* FAQs list */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest text-center">Perguntas Frequentes</h4>
            <div className="space-y-3 max-w-xl mx-auto">
              {defaultLandingPage.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-1.5">
                  <p className="text-xs font-bold text-zinc-100">{faq.question}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
