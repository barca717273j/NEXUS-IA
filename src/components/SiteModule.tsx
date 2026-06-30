import React from "react";
import { motion } from "motion/react";
import { Globe, Award } from "lucide-react";
import { Project } from "../types";

interface SiteModuleProps {
  project: Project;
  onUpdateProject?: (project: Project) => void;
}

export default function SiteModule({ project, onUpdateProject }: SiteModuleProps) {
  const defaultSite = project.site || {
    name: project.name || "Nexus Business",
    niche: project.niche,
    objective: project.objective,
    heroTitle: `Soluções Inteligentes em ${project.niche}`,
    heroSubtitle: `Capacitando profissionais e acelerando resultados com as melhores práticas do mercado global.`,
    aboutText: `Fundada sob a premissa de entregar valor tático imediato, nossa iniciativa visa desmitificar processos complexos. Acreditamos que a consistência metodológica é a única chave real para o sucesso sustentável.`,
    contactEmail: "suporte@nexusplataforma.com",
    contactPhone: "+55 (11) 99999-9999",
    faqs: [
      { question: "Quem somos?", answer: "Uma equipe dedicada a prover as melhores ferramentas operacionais para seu nicho." },
      { question: "Como funciona o suporte?", answer: "Atendimento de segunda a sexta-feira, das 9h às 18h, via e-mail corporativo." }
    ],
    features: [
      { title: "Metodologia Validada", description: "Todos os nossos caminhos são testados e focados em alta conversão e utilidade." },
      { title: "Material de Apoio", description: "Apostilas, checklists e ferramentas extras inclusas para potencializar sua execução." }
    ]
  };

  const handleSiteChange = (field: keyof typeof defaultSite, value: any) => {
    if (!onUpdateProject) return;
    const updatedSite = { ...defaultSite, [field]: value };
    onUpdateProject({ ...project, site: updatedSite });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Pane: Site Controls */}
      <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="border-b border-zinc-850 pb-4">
          <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2">
            <Globe size={15} />
            EDITOR DE SITE INSTITUCIONAL
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium mt-1">
            Configure os blocos institucionais do seu portal de apoio. As mudanças são replicadas na visualização ao lado.
          </p>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Título Principal do Site (Hero Title)</label>
            <textarea
              value={defaultSite.heroTitle}
              onChange={(e) => handleSiteChange("heroTitle", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Subtítulo Geral (Hero Subtitle)</label>
            <textarea
              value={defaultSite.heroSubtitle}
              onChange={(e) => handleSiteChange("heroSubtitle", e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Seção "Sobre Nós" / Quem Somos</label>
            <textarea
              value={defaultSite.aboutText}
              onChange={(e) => handleSiteChange("aboutText", e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">E-mail de Contato</label>
              <input
                type="email"
                value={defaultSite.contactEmail}
                onChange={(e) => handleSiteChange("contactEmail", e.target.value)}
                className="w-full px-3 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Telefone Comercial</label>
              <input
                type="text"
                value={defaultSite.contactPhone}
                onChange={(e) => handleSiteChange("contactPhone", e.target.value)}
                className="w-full px-3 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl text-[10px] text-zinc-500 leading-normal">
          Este portal institucional serve de ancoragem corporativa confiável e autoritativa para o público do seu funil X1 de vendas.
        </div>
      </div>

      {/* Right Pane: Live Site Mockup Preview */}
      <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
        {/* Browser address bar */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="flex-1 bg-black/60 text-zinc-500 text-[10px] font-mono text-center py-1 rounded-md border border-zinc-800/60 mx-4 max-w-sm">
            https://{defaultSite.name.toLowerCase().replace(/\s+/g, "")}.nexusportal.app
          </div>
        </div>

        {/* Simulated Institutional Site scrollable content */}
        <div className="flex-1 overflow-y-auto max-h-[600px] bg-zinc-950 text-zinc-300 space-y-12 select-none">
          {/* Top Header menu */}
          <div className="px-6 py-4 border-b border-zinc-900 bg-black/40 flex justify-between items-center">
            <span className="text-xs font-mono font-black tracking-widest text-white uppercase">{defaultSite.name}</span>
            <div className="flex gap-4 text-[9px] font-mono text-zinc-500 font-bold uppercase">
              <span>Início</span>
              <span>Sobre Nós</span>
              <span>Recursos</span>
              <span>Contato</span>
            </div>
          </div>

          {/* Hero Block */}
          <div className="text-center space-y-4 px-6 py-10">
            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight max-w-xl mx-auto">
              {defaultSite.heroTitle}
            </h1>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
              {defaultSite.heroSubtitle}
            </p>
            <div className="pt-2">
              <span className="px-5 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md cursor-default">
                Conhecer Mais
              </span>
            </div>
          </div>

          {/* About Block */}
          <div className="px-6 sm:px-12 py-8 bg-zinc-900/40 border-y border-zinc-900 space-y-3">
            <span className="text-[9px] font-mono uppercase text-red-500 font-bold tracking-wider">Quem Somos</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Comprometimento com seu Crescimento</h3>
            <p className="text-xs text-zinc-400 leading-relaxed text-justify">
              {defaultSite.aboutText}
            </p>
          </div>

          {/* Modular Features Block */}
          <div className="px-6 sm:px-12 space-y-4">
            <span className="text-[9px] font-mono uppercase text-red-500 font-bold tracking-wider block text-center">Nossos Pilares</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultSite.features.map((feat, idx) => (
                <div key={idx} className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-1.5">
                  <p className="text-xs font-bold text-white">{feat.title}</p>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Contact Footer Block */}
          <div className="px-6 py-8 border-t border-zinc-900 bg-black/60 text-center space-y-2">
            <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-widest">{defaultSite.name} — Suporte & Contatos Oficiais</p>
            <p className="text-xs text-zinc-300 font-medium">E-mail Corporativo: {defaultSite.contactEmail}</p>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">Telefone Comercial: {defaultSite.contactPhone}</p>
            <p className="text-[8px] text-zinc-600 font-mono pt-4">© {new Date().getFullYear()} {defaultSite.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
