import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Project, 
  Sale, 
  Chapter, 
  Community 
} from "../types";
import { 
  BookOpen, 
  FileText, 
  Search, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Copy, 
  Check, 
  Printer, 
  Download,
  Calendar, 
  DollarSign, 
  Info,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2
} from "lucide-react";

interface ProjectTabsProps {
  project: Project;
  onUpdateMilestones: (milestones: Project["milestones"]) => void;
  onRegisterSale: (sale: Omit<Sale, "id">) => void;
  onDeleteSale?: (saleId: string) => void;
}

export default function ProjectTabs({ 
  project, 
  onUpdateMilestones, 
  onRegisterSale,
  onDeleteSale 
}: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"ebook" | "pdf" | "research" | "x1" | "execution" | "sales">("ebook");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // X1 active category (Facebook, WhatsApp, Telegram, Discord, Reddit, Forums)
  const [activeX1Category, setActiveX1Category] = useState<"facebook" | "telegram" | "whatsapp" | "discord" | "reddit" | "forums">("facebook");

  // Manual Sale Form state
  const [saleValue, setSaleValue] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [saleNote, setSaleNote] = useState("");
  const [saleFormSuccess, setSaleFormSuccess] = useState(false);

  // Reader chapters
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleMilestoneToggle = (key: keyof Project["milestones"]) => {
    const updated = { ...project.milestones, [key]: !project.milestones[key] };
    onUpdateMilestones(updated);
  };

  const handleSaleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(saleValue);
    if (isNaN(value) || value <= 0) return;

    onRegisterSale({
      value,
      date: saleDate,
      note: saleNote.trim() || undefined
    });

    setSaleValue("");
    setSaleNote("");
    setSaleFormSuccess(true);
    setTimeout(() => setSaleFormSuccess(false), 3000);
  };

  // Tabs definitions
  const tabs = [
    { id: "ebook", label: "Ebook", icon: BookOpen },
    { id: "pdf", label: "PDF / Exportar", icon: FileText },
    { id: "research", label: "Pesquisa", icon: Search },
    { id: "x1", label: "Módulo X1", icon: Users },
    { id: "execution", label: "Plano de Execução", icon: CheckSquare },
    { id: "sales", label: "Vendas", icon: DollarSign },
  ] as const;

  return (
    <div className="w-full select-none" id="project-tabs-container">
      {/* Top Project summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-nexus-card border border-nexus-border border-b-0 rounded-t-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-0.5 bg-nexus-red/10 border border-nexus-red/20 text-[10px] text-nexus-red font-mono font-bold rounded-lg">
              {project.niche}
            </span>
            <span className="text-xs text-zinc-500 font-mono">Criado em {project.createdAt}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-100 tracking-tight">
            {project.ebook.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            {project.objective}
          </p>
        </div>

        {/* Cover Preview Mini */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-nexus-black border border-nexus-border rounded-lg overflow-hidden relative shadow-md">
            <img 
              src={project.coverUrl} 
              alt="Capa Mini" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Volume Estimado</p>
            <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.pages} Páginas</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Idioma: {project.language}</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap border-b border-nexus-border bg-nexus-black px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? "text-nexus-red border-nexus-red bg-nexus-card/30 font-bold" 
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with AnimatePresence */}
      <div className="bg-nexus-card border border-nexus-border border-t-0 p-6 md:p-8 rounded-b-2xl min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DIGITAL EBOOK READER */}
          {activeTab === "ebook" && (
            <motion.div
              key="tab-ebook"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar chapters navigator */}
              <div className="lg:col-span-4 space-y-2">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold mb-3">
                  Estrutura Didática do Volume:
                </p>
                <button
                  onClick={() => setActiveChapterIndex(0)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeChapterIndex === 0 
                      ? "border-nexus-red bg-nexus-red/[0.02]" 
                      : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-100">Capa & Sumário Executivo</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-1">Sinopse oficial do produto</p>
                </button>

                <button
                  onClick={() => setActiveChapterIndex(1)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeChapterIndex === 1 
                      ? "border-nexus-red bg-nexus-red/[0.02]" 
                      : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-100">Introdução do Autor</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-1">O ponto de partida</p>
                </button>

                {project.ebook.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveChapterIndex(index + 2)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeChapterIndex === index + 2 
                        ? "border-nexus-red bg-nexus-red/[0.02]" 
                        : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                    }`}
                  >
                    <p className="text-xs font-bold text-zinc-100 truncate">{chapter.title}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-1">Capítulo de conteúdo prático</p>
                  </button>
                ))}

                <button
                  onClick={() => setActiveChapterIndex(project.ebook.chapters.length + 2)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeChapterIndex === project.ebook.chapters.length + 2 
                      ? "border-nexus-red bg-nexus-red/[0.02]" 
                      : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-100">Conclusão & CTA Final</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-1">Fechamento do funil</p>
                </button>
              </div>

              {/* Reader Stage */}
              <div className="lg:col-span-8 bg-nexus-black border border-nexus-border p-8 rounded-2xl relative min-h-[400px] flex flex-col justify-between">
                
                {/* Book header */}
                <div className="border-b border-nexus-border pb-4 mb-6 flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>NEXUS READER ENGINE</span>
                  <span>{project.language}</span>
                </div>

                {/* Reader Contents */}
                <div className="flex-1">
                  {/* Capa e sumário view */}
                  {activeChapterIndex === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 aspect-[3/4] rounded-xl overflow-hidden border border-nexus-border shadow-md">
                          <img src={project.coverUrl} className="w-full h-full object-cover" alt="Capa" referrerPolicy="no-referrer" />
                        </div>
                        <div className="md:col-span-8">
                          <h2 className="font-serif text-2xl font-bold text-nexus-red mb-2">{project.ebook.title}</h2>
                          <p className="text-xs text-zinc-300 font-medium italic mb-4">{project.ebook.subtitle}</p>
                          <p className="text-xs text-zinc-500 font-mono">AUTOR: SISTEMA INTEGRADO NEXUS</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-nexus-border">
                        <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold mb-3">Sumário Executivo e Sinopse:</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-serif indent-4">
                          {project.ebook.summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Introdução view */}
                  {activeChapterIndex === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-bold text-zinc-100 mb-2 border-b border-nexus-border pb-2">
                        Introdução do Volume
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-serif indent-6">
                        {project.ebook.introduction}
                      </p>
                    </div>
                  )}

                  {/* Chapters content views */}
                  {activeChapterIndex > 1 && activeChapterIndex <= project.ebook.chapters.length + 1 && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-bold text-zinc-100 mb-2 border-b border-nexus-border pb-2">
                        {project.ebook.chapters[activeChapterIndex - 2].title}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-serif indent-6">
                        {project.ebook.chapters[activeChapterIndex - 2].content}
                      </p>
                    </div>
                  )}

                  {/* Conclusão view */}
                  {activeChapterIndex === project.ebook.chapters.length + 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-zinc-100 mb-2 border-b border-nexus-border pb-2">
                          Considerações Finais
                        </h3>
                        <p className="text-xs text-zinc-300 leading-relaxed font-serif indent-6">
                          {project.ebook.conclusion}
                        </p>
                      </div>

                      <div className="p-5 bg-nexus-red/[0.02] border border-nexus-red/20 rounded-xl">
                        <h4 className="text-xs font-bold text-nexus-red mb-1.5 uppercase tracking-wide">Chamada para Ação (CTA):</h4>
                        <p className="text-xs text-zinc-400 leading-normal">{project.ebook.cta}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Page number */}
                <div className="border-t border-nexus-border pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500 font-semibold">
                  <span>PÁGINA {activeChapterIndex + 1} de {project.ebook.chapters.length + 3}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={activeChapterIndex === 0}
                      onClick={() => setActiveChapterIndex(p => p - 1)}
                      className="px-3 py-1.5 bg-nexus-card border border-nexus-border hover:border-nexus-red/40 text-zinc-300 hover:text-zinc-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed rounded-lg text-xs font-semibold transition-all"
                    >
                      Anterior
                    </button>
                    <button 
                      disabled={activeChapterIndex === project.ebook.chapters.length + 2}
                      onClick={() => setActiveChapterIndex(p => p + 1)}
                      className="px-3 py-1.5 bg-nexus-card border border-nexus-border hover:border-nexus-red/40 text-zinc-300 hover:text-zinc-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed rounded-lg text-xs font-semibold transition-all"
                    >
                      Próximo
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: PDF PREVIEW & EXPORT ACTIONS */}
          {activeTab === "pdf" && (
            <motion.div
              key="tab-pdf"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold flex items-center gap-2">
                      <Printer size={15} className="text-nexus-red" />
                      Mecanismo de Exportação PDF
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                      O arquivo está formatado e indexado para compilação imediata de canais de venda.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(JSON.stringify(project.ebook, null, 2), "CopyJSON")}
                      className="flex items-center gap-2 px-3 py-2 bg-nexus-card border border-nexus-border text-zinc-300 hover:text-zinc-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {copiedText === "CopyJSON" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      <span>{copiedText === "CopyJSON" ? "Copiado!" : "Copiar JSON"}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 bg-nexus-red hover:bg-nexus-red-hover text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all shadow-md shadow-nexus-red/10"
                    >
                      <Download size={12} />
                      <span>Baixar PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Frame Simulation */}
                <div className="bg-white text-zinc-900 p-12 rounded-xl shadow-2xl font-serif max-h-[500px] overflow-y-auto" id="printable-area-preview">
                  <div className="max-w-xl mx-auto space-y-12">
                    {/* Cover Section */}
                    <div className="text-center py-16 border-b border-zinc-200">
                      <p className="text-[10px] font-mono tracking-widest text-nexus-red font-bold uppercase mb-4">NEXUS SYSTEM PRESENTS</p>
                      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-2">{project.ebook.title}</h1>
                      <h3 className="text-sm italic text-zinc-600 max-w-md mx-auto">{project.ebook.subtitle}</h3>
                      <div className="w-16 h-0.5 bg-nexus-red mx-auto my-6" />
                      <p className="text-xs font-mono text-zinc-400 font-semibold uppercase">PRODUÇÃO EXCLUSIVA DE CONTEÚDO</p>
                    </div>

                    {/* Introdução section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-zinc-950">Introdução</h2>
                      <p className="text-xs text-zinc-700 leading-relaxed indent-6">
                        {project.ebook.introduction}
                      </p>
                    </div>

                    {/* Chapters section */}
                    {project.ebook.chapters.map((chapter, index) => (
                      <div key={index} className="space-y-4 pt-4 border-t border-zinc-100">
                        <h2 className="text-xl font-bold text-zinc-950">{chapter.title}</h2>
                        <p className="text-xs text-zinc-700 leading-relaxed indent-6">
                          {chapter.content}
                        </p>
                      </div>
                    ))}

                    {/* Conclusão section */}
                    <div className="space-y-4 pt-4 border-t border-zinc-100">
                      <h2 className="text-xl font-bold text-zinc-950">Conclusão</h2>
                      <p className="text-xs text-zinc-700 leading-relaxed indent-6">
                        {project.ebook.conclusion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PESQUISA INTELIGENTE CARDS */}
          {activeTab === "research" && (
            <motion.div
              key="tab-research"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Profile/Avatar header info summary */}
              <div className="bg-nexus-black border border-nexus-border p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                <div>
                  <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold mb-1">Avatar de Alta Conversão</p>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">{project.research.avatar.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-normal">{project.research.avatar.idealAudience}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500">Faixa Etária</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.age}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500">Profissão</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.profession}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500">Renda Estimada</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.income}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500">Gênero</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.gender}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 mb-1.5">Interesses Relevantes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.research.avatar.interests.map((interest, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-nexus-card border border-nexus-border rounded-lg text-[10px] text-zinc-400 font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid layout of other intelligence items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Dores */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Principais Dores</h4>
                  <ul className="space-y-3">
                    {project.research.avatar.pains.map((pain, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-nexus-red mt-1.5 shrink-0" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sonhos */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Principais Sonhos</h4>
                  <ul className="space-y-3">
                    {project.research.avatar.dreams.map((dream, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-nexus-red mt-1.5 shrink-0" />
                        <span>{dream}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objeções */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Objeções & Soluções</h4>
                  <ul className="space-y-3">
                    {project.research.objections.map((obj, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-nexus-red mt-1.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copywriting Elements */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Copywriting de Conversão</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1">Tom de voz ideal:</p>
                      <p className="text-xs text-zinc-300 font-semibold">{project.research.tomDeVoz}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1.5">Palavras que vendem:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.research.palavrasConvertem.map((word, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-nexus-card border border-nexus-border rounded-lg text-[10px] text-nexus-red font-bold font-mono">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promessas */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Grandes Promessas (Headlines)</h4>
                  <ul className="space-y-3">
                    {project.research.promessas.map((prom, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-nexus-red mt-1.5 shrink-0" />
                        <span>"{prom}"</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefícios & Argumentos */}
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4">Gatilhos & Argumentos</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1">Diferenciais e Benefícios:</p>
                      <ul className="space-y-1.5">
                        {project.research.beneficios.map((ben, idx) => (
                          <li key={idx} className="text-[11px] text-zinc-400 leading-normal flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-nexus-red" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1">Argumento Lógico Incontestável:</p>
                      <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                        "{project.research.argumentos[0]}"
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: MÓDULO X1 COPIABLE OUTREACH MESSAGE */}
          {activeTab === "x1" && (
            <motion.div
              key="tab-x1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Category side selector - accordian or clean tab button layout */}
              <div className="lg:col-span-4 space-y-2">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold mb-3">
                  Categorias de Divulgação:
                </p>
                
                {(Object.keys(project.x1) as Array<keyof Project["x1"]>).map((key) => {
                  const item = project.x1[key];
                  const isOpen = activeX1Category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveX1Category(key)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isOpen 
                          ? "border-nexus-red bg-nexus-red/[0.02]" 
                          : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{item.category}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{item.communities.length} Comunidades mapeadas</p>
                      </div>
                      <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  );
                })}
              </div>

              {/* Message Display Stage */}
              <div className="lg:col-span-8 bg-nexus-black border border-nexus-border p-6 md:p-8 rounded-2xl relative shadow-inner">
                
                {/* Active category details */}
                <div className="border-b border-nexus-border pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider">
                      Canais recomendados: {project.x1[activeX1Category].category}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Fóruns e ecossistemas ativos onde seu Avatar de compras se faz presente.
                    </p>
                  </div>
                </div>

                {/* Communities map */}
                <div className="mb-6">
                  <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-semibold mb-2.5">
                    Comunidades Recomendadas para Abordagem:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.x1[activeX1Category].communities.map((comm, idx) => (
                      <div key={idx} className="p-3 bg-nexus-card border border-nexus-border rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-bold text-zinc-200">{comm.name}</p>
                          <span className="text-[9px] font-mono text-nexus-red font-semibold">{comm.size}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">{comm.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outreach Template Box */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                      Script de Abordagem para Copiar:
                    </p>
                    
                    <button
                      onClick={() => handleCopy(project.x1[activeX1Category].templateMessage, activeX1Category)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-nexus-card border border-nexus-border text-zinc-300 hover:text-zinc-100 rounded-xl text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      {copiedText === activeX1Category ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                      <span>{copiedText === activeX1Category ? "Copiado!" : "Copiar Script"}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-nexus-black border border-nexus-border text-xs text-zinc-300 leading-relaxed font-sans rounded-xl whitespace-pre-wrap select-text">
                    {project.x1[activeX1Category].templateMessage}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: PLANO DE EXECUÇÃO CHECKLIST */}
          {activeTab === "execution" && (
            <motion.div
              key="tab-execution"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl">
                <div className="mb-6">
                  <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold flex items-center gap-2">
                    <CheckSquare size={15} className="text-nexus-red" />
                    Plano de Execução Comercial
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Seu mapa estratégico rumo ao primeiro faturamento. Controle de forma manual as etapas operacionais realizadas.
                  </p>
                </div>

                <div className="divide-y divide-nexus-border/60">
                  {/* Item 1 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("ebookCreated")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.ebookCreated 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.ebookCreated && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.ebookCreated ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Estruturação do Ebook concluída
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">O sistema organizou todos os capítulos, introdução, conclusão e CTA comercial de alta conversão.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("researchCompleted")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.researchCompleted 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.researchCompleted && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.researchCompleted ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Análise de público (Avatar) mapeada
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Dados demográficos, dores, sonhos e objeções de compra estruturados em cards.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("messagesReady")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.messagesReady 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.messagesReady && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.messagesReady ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Scripts de abordagem X1 gerados
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Mensagens exclusivas escritas especificamente para cada mídia de divulgação potencial.</p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("communitiesAnalyzed")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.communitiesAnalyzed 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.communitiesAnalyzed && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.communitiesAnalyzed ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Mapeamento de fóruns de tráfego orgânico
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Locais recomendados com tamanhos de público qualificados para realizar as divulgações do tráfego orgânico.</p>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("firstPromoDone")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.firstPromoDone 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.firstPromoDone && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.firstPromoDone ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Primeira divulgação oficial executada
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Você copiou os scripts gerados e os compartilhou em canais qualificados do Módulo X1.</p>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="py-4 flex items-start gap-4 cursor-pointer" onClick={() => handleMilestoneToggle("firstSaleRegistered")}>
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.firstSaleRegistered 
                          ? "bg-nexus-red border-nexus-red text-white" 
                          : "border-nexus-border bg-nexus-black"
                      }`}>
                        {project.milestones.firstSaleRegistered && <Check size={11} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${project.milestones.firstSaleRegistered ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
                        Primeira venda faturada e registrada
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Sua primeira receita confirmada e lançada no livro de vendas deste produto.</p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: SALES MANUAL RECORDING & HISTORY LEDGER */}
          {activeTab === "sales" && (
            <motion.div
              key="tab-sales"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Manual Form */}
              <div className="lg:col-span-5 bg-nexus-black border border-nexus-border p-6 rounded-2xl self-start shadow-sm">
                <h4 className="text-xs font-mono uppercase text-nexus-red font-bold mb-4 flex items-center gap-2">
                  <DollarSign size={14} />
                  Registrar Nova Venda Direta
                </h4>
                
                {saleFormSuccess && (
                  <div className="mb-4 p-3 bg-green-950/40 border border-green-800/60 rounded-xl text-green-400 text-xs text-center font-medium">
                    Venda registrada e integrada ao painel!
                  </div>
                )}

                <form onSubmit={handleSaleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Valor Vendido (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={saleValue}
                      onChange={(e) => setSaleValue(e.target.value)}
                      placeholder="Exemplo: 47.00"
                      className="w-full px-4.5 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Data da Transação</label>
                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      className="w-full px-4.5 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Observação / Canal (Opcional)</label>
                    <input
                      type="text"
                      value={saleNote}
                      onChange={(e) => setSaleNote(e.target.value)}
                      placeholder="Exemplo: Venda de indicação via WhatsApp"
                      className="w-full px-4.5 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-nexus-red hover:bg-nexus-red-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-nexus-red/10 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <Plus size={14} />
                    <span>Lançar Faturamento</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Ledger table */}
              <div className="lg:col-span-7 bg-nexus-black border border-nexus-border p-6 rounded-2xl flex flex-col justify-between min-h-[300px] shadow-sm">
                <div>
                  <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-nexus-red" />
                    Histórico de Lançamentos do Projeto
                  </h4>

                  {project.sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-3 bg-nexus-card border border-nexus-border rounded-full text-zinc-600 mb-3">
                        <DollarSign size={20} />
                      </div>
                      <p className="text-xs font-bold text-zinc-400">Nenhum faturamento registrado</p>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-xs">Use o painel lateral para registrar transações manuais de vendas realizadas.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-xs divide-y divide-nexus-border">
                        <thead className="bg-nexus-card text-zinc-500 uppercase text-[10px] font-mono font-bold">
                          <tr>
                            <th className="py-2.5 px-3">Data</th>
                            <th className="py-2.5 px-3">Valor</th>
                            <th className="py-2.5 px-3">Origem / Canal</th>
                            {onDeleteSale && <th className="py-2.5 px-3 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-nexus-border font-medium text-zinc-300">
                          {project.sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-nexus-card/30">
                              <td className="py-2.5 px-3 font-mono text-[10px]">
                                {new Date(sale.date).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3 text-nexus-red font-mono font-bold">
                                R$ {sale.value.toLocaleString()}
                              </td>
                              <td className="py-2.5 px-3 text-zinc-400 truncate max-w-[150px]">
                                {sale.note || "Venda Direta"}
                              </td>
                              {onDeleteSale && (
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => onDeleteSale(sale.id)}
                                    className="p-1 hover:text-red-400 text-zinc-600 rounded-lg cursor-pointer transition-colors"
                                    title="Remover lançamento"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Ledger summary footer */}
                {project.sales.length > 0 && (
                  <div className="border-t border-nexus-border pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                    <span>TOTAL DE TRANSAÇÕES: {project.sales.length}</span>
                    <span className="font-bold text-zinc-300">
                      ACUMULADO: R${" "}
                      {project.sales.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
