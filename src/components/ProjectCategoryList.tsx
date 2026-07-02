import { useState } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Layout, 
  Globe, 
  Search, 
  Plus, 
  ArrowRight, 
  Calendar, 
  Coins 
} from "lucide-react";
import { Project } from "../types";

interface ProjectCategoryListProps {
  projects: Project[];
  type: "ebook" | "landing_page" | "site";
  onSelectProject: (id: string) => void;
  onCreateNew: () => void;
  onDeleteProject?: (id: string) => void;
}

export default function ProjectCategoryList({
  projects,
  type,
  onSelectProject,
  onCreateNew,
  onDeleteProject
}: ProjectCategoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects by type and search term
  const filteredProjects = projects.filter(proj => {
    // Determine type: default is "ebook" if undefined
    const projType = proj.type || "ebook";
    if (projType !== type) return false;

    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    const title = type === "ebook" ? proj.ebook?.title || "" : proj.name;
    return (
      title.toLowerCase().includes(term) ||
      proj.niche.toLowerCase().includes(term) ||
      proj.objective.toLowerCase().includes(term)
    );
  });

  const getCategoryMeta = () => {
    switch (type) {
      case "landing_page":
        return {
          title: "Landing Pages de Vendas",
          subtitle: "Estruturas de alta conversão de resposta direta com copys persuasivas, depoimentos e sessões estratégicas de fechamento.",
          icon: Layout,
          emptyTitle: "Nenhuma Landing Page criada",
          emptyDesc: "Inicie o gerador inteligente e crie uma página de vendas otimizada para capturar compradores de alto valor em seu nicho.",
          buttonText: "Gerar Landing Page",
          tag: "RESPOSTA DIRETA"
        };
      case "site":
        return {
          title: "Sites Institucionais",
          subtitle: "Páginas corporativas profissionais para consolidar a autoridade da sua marca, detalhar seus serviços práticos e engajar contatos.",
          icon: Globe,
          emptyTitle: "Nenhum Site Institucional",
          emptyDesc: "Produza um site limpo, moderno e tático para estruturar o posicionamento oficial da sua empresa ou consultoria.",
          buttonText: "Gerar Site Oficial",
          tag: "MARCA & AUTORIDADE"
        };
      default:
        return {
          title: "Livros Digitais (Ebooks)",
          subtitle: "Volumes editoriais premium e completos estruturados em capítulos didáticos e práticos para servir como iscas digitais ou infoprodutos.",
          icon: BookOpen,
          emptyTitle: "Nenhum Ebook criado",
          emptyDesc: "Desenvolva um livro digital de alta performance para monetizar seu conhecimento especializado com funis integrados.",
          buttonText: "Gerar Novo Ebook",
          tag: "PRODUTOS EDITORIAIS"
        };
    }
  };

  const meta = getCategoryMeta();
  const IconHeader = meta.icon;

  // Render CSS cover preview if no custom cover URL is present (fallback styling)
  const renderCardCover = (proj: Project) => {
    const title = proj.type === "ebook" ? proj.ebook?.title : proj.name;
    const isCustom = !!proj.coverLocalUrl;
    
    if (isCustom) {
      return (
        <img 
          src={proj.coverLocalUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      );
    }

    if (proj.type === "landing_page") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-[#121217] to-zinc-900 flex flex-col justify-between p-4 font-sans select-none border border-zinc-800/20">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[7px] font-mono text-zinc-500 tracking-wider">LANDING PAGE</span>
          </div>
          <div className="my-auto space-y-1.5 text-center">
            <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded inline-block text-[7px] font-mono font-bold text-red-500">
              {proj.niche.toUpperCase()}
            </div>
            <h4 className="text-[10px] font-black tracking-tight text-white line-clamp-3 leading-snug">
              {proj.name}
            </h4>
          </div>
          <div className="flex items-center justify-center p-2.5 bg-red-600/10 border border-red-500/20 rounded-lg">
            <span className="text-[8px] font-mono font-black text-red-500 uppercase tracking-widest">CTA DE CONVERSÃO</span>
          </div>
        </div>
      );
    }

    if (proj.type === "site") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-[#0a0f12] to-zinc-900 flex flex-col justify-between p-4 font-sans select-none border border-zinc-800/20">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-1">
              <Globe size={10} className="text-zinc-400" />
              <span className="text-[7px] font-mono font-black text-zinc-300 truncate max-w-[80px]">
                {proj.name.toUpperCase()}
              </span>
            </div>
            <span className="text-[7px] font-mono text-zinc-500 tracking-wider">WWW</span>
          </div>
          <div className="my-auto space-y-2">
            <h4 className="text-[10px] font-extrabold text-white leading-normal">
              A Solução Definitiva para Dominar {proj.niche}
            </h4>
            <p className="text-[7.5px] text-zinc-400 font-medium line-clamp-3">
              Capacitando você a atingir seu objetivo de {proj.objective.toLowerCase()} com clareza.
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800 pt-2 text-[7px] font-mono text-zinc-500 font-bold">
            <span>HOME</span>
            <span>SOBRE</span>
            <span>FAQ</span>
            <span>CONTATO</span>
          </div>
        </div>
      );
    }

    // Default Ebook styling (Book Spine / Jacket Representation)
    return (
      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex flex-col justify-between p-4 font-serif select-none border-l-4 border-l-red-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/[0.02] rounded-full blur-xl pointer-events-none" />
        <div className="space-y-1">
          <span className="text-[7px] font-mono text-red-500 uppercase font-black tracking-widest bg-red-500/5 px-1.5 py-0.5 rounded-full border border-red-500/10">
            {proj.niche.toUpperCase()}
          </span>
          <h4 className="text-[11px] font-black text-white leading-snug tracking-tight mt-1 line-clamp-3">
            {proj.ebook?.title || proj.name}
          </h4>
        </div>
        <div>
          <p className="text-[7.5px] font-sans text-zinc-400 font-semibold truncate italic mt-1">
            {proj.ebook?.subtitle || "Volume Exclusivo"}
          </p>
          <div className="border-t border-zinc-800/80 pt-2.5 mt-2.5 flex justify-between items-center font-sans font-bold text-[7px] text-zinc-500">
            <span className="uppercase">NEXUS EDITORIAL</span>
            <span>{proj.pages} PGS</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id={`category-list-${type}`}>
      {/* Upper header action bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Soft back-glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/[0.015] rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-[9px] text-red-500 font-mono font-black uppercase tracking-wider rounded-lg">
              {meta.tag}
            </span>
            <span className="inline-flex items-center text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider bg-zinc-800/50 px-2.5 py-0.5 rounded-lg">
              {filteredProjects.length} {filteredProjects.length === 1 ? "Projeto Ativo" : "Projetos Ativos"}
            </span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-3">
            <IconHeader size={24} className="text-red-500 shrink-0" />
            <span>{meta.title}</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
            {meta.subtitle}
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-red-600/10 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>{meta.buttonText}</span>
        </button>
      </div>

      {/* Search Input bar */}
      {projects.filter(p => (p.type || "ebook") === type).length > 0 && (
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={`Filtrar projetos por título, nicho ou objetivo...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all shadow-inner"
          />
        </div>
      )}

      {/* Grid of cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((proj) => {
            const totalProjRevenue = proj.sales.reduce((sum, s) => sum + s.value, 0);
            const title = proj.type === "ebook" ? proj.ebook?.title || proj.name : proj.name;
            
            return (
              <div 
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="group bg-zinc-950 border border-zinc-850 hover:border-zinc-700 rounded-2xl overflow-hidden cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/40 flex flex-col h-[380px]"
              >
                {/* Visual Cover stage */}
                <div className="h-[210px] w-full bg-zinc-900 border-b border-zinc-850/80 overflow-hidden relative">
                  {renderCardCover(proj)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-xl scale-95 group-hover:scale-100 transition-all duration-300 flex items-center gap-1.5">
                      <span>Gerenciar Operação</span>
                      <ArrowRight size={12} className="stroke-[2.5]" />
                    </span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[8px] font-mono text-zinc-500 font-bold uppercase truncate tracking-wider">
                        #{proj.id}
                      </span>
                      <span className="text-[8.5px] font-mono text-zinc-400 font-black truncate max-w-[120px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {proj.niche}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white truncate" title={title}>
                      {title}
                    </h3>

                    <p className="text-[10px] text-zinc-500 font-medium line-clamp-1 leading-relaxed" title={proj.objective}>
                      {proj.objective}
                    </p>

                    {/* Meta Detalhado do Projeto */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[9px] text-zinc-400 border-t border-zinc-900 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] text-zinc-600 font-mono uppercase font-semibold">Créditos Usados</span>
                        <span className="font-mono font-bold text-zinc-300">
                          {proj.creditsUsed || (proj.type === "site" ? 20 : proj.type === "landing_page" ? 12 : 10)} cr
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] text-zinc-600 font-mono uppercase font-semibold">Última Edição</span>
                        <span className="font-mono font-bold text-zinc-300">
                          {proj.lastEditAt || proj.createdAt}
                        </span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-[7.5px] text-zinc-600 font-mono uppercase font-semibold">Mensagens Chat</span>
                        <span className="font-mono font-bold text-zinc-300">
                          {proj.chatMessagesCount || 0} msgs
                        </span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-[7.5px] text-zinc-600 font-mono uppercase font-semibold">Criação</span>
                        <span className="font-mono font-bold text-zinc-300 text-ellipsis truncate">
                          {proj.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-900 pt-3 flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1.5 text-red-500 font-mono font-bold text-xs">
                      <Coins size={12} className="shrink-0" />
                      <span>R$ {totalProjRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-mono font-bold bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800">
                      <Calendar size={10} className="shrink-0 text-zinc-500" />
                      <span>{proj.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-950/60 border border-zinc-850 rounded-2xl max-w-2xl mx-auto p-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <IconHeader size={24} className="stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-200">{meta.emptyTitle}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
              {meta.emptyDesc}
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold uppercase text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Plus size={13} className="stroke-[2.5]" />
            <span>Começar Agora</span>
          </button>
        </div>
      )}
    </div>
  );
}
