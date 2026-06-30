import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Project, 
  Sale 
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
  ChevronDown,
  Plus,
  Trash2,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  Volume2,
  Flame,
  ShieldAlert,
  Clock,
  ExternalLink,
  MessageSquare,
  Lock,
  ListTodo,
  Coins
} from "lucide-react";

interface ProjectTabsProps {
  project: Project;
  onUpdateMilestones: (milestones: Project["milestones"]) => void;
  onRegisterSale: (sale: Omit<Sale, "id">) => void;
  onDeleteSale?: (saleId: string) => void;
  onUpdateProject?: (project: Project) => void;
}

export default function ProjectTabs({ 
  project, 
  onUpdateMilestones, 
  onRegisterSale,
  onDeleteSale,
  onUpdateProject
}: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"ebook" | "pdf" | "research" | "x1" | "execution" | "sales">("ebook");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Reader controls
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [readerFont, setReaderFont] = useState<"serif" | "sans" | "mono">("serif");
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  // X1 active category (Facebook, WhatsApp, Telegram, Discord, Reddit, Forums)
  const [activeX1Category, setActiveX1Category] = useState<"facebook" | "telegram" | "whatsapp" | "discord" | "reddit" | "forums">("facebook");

  // Manual Sale Form state with premium design alignment
  const [saleValue, setSaleValue] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [saleNote, setSaleNote] = useState("");
  const [saleFormSuccess, setSaleFormSuccess] = useState(false);

  // AI Chapter Improvement state
  const [isImprovingChapter, setIsImprovingChapter] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improveInstructions, setImproveInstructions] = useState("");
  const [improvementError, setImprovementError] = useState<string | null>(null);

  const handleImproveChapter = async () => {
    if (!improveInstructions.trim() || !onUpdateProject) return;
    setIsImprovingChapter(true);
    setImprovementError(null);

    // Identify what chapter/section we are looking at
    let chapterTitle = "";
    let currentContent = "";

    if (activeChapterIndex === 0) {
      chapterTitle = "Capa & Sumário Executivo";
      currentContent = project.ebook.summary;
    } else if (activeChapterIndex === 1) {
      chapterTitle = "Introdução Oficial";
      currentContent = project.ebook.introduction;
    } else if (activeChapterIndex > 1 && activeChapterIndex <= project.ebook.chapters.length + 1) {
      const idx = activeChapterIndex - 2;
      chapterTitle = project.ebook.chapters[idx].title;
      currentContent = project.ebook.chapters[idx].content;
    } else {
      chapterTitle = "Conclusão & CTA Comercial";
      currentContent = `${project.ebook.conclusion}\n\nCTA:\n${project.ebook.cta}`;
    }

    try {
      const res = await fetch("/api/improve-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          niche: project.niche,
          objective: project.objective,
          chapterTitle,
          currentContent,
          instructions: improveInstructions
        })
      });

      const resData = await res.json();

      if (resData && resData.success && resData.improvedContent) {
        // Build updated project object
        const updatedProject = { ...project };

        if (activeChapterIndex === 0) {
          updatedProject.ebook = {
            ...updatedProject.ebook,
            summary: resData.improvedContent
          };
        } else if (activeChapterIndex === 1) {
          updatedProject.ebook = {
            ...updatedProject.ebook,
            introduction: resData.improvedContent
          };
        } else if (activeChapterIndex > 1 && activeChapterIndex <= project.ebook.chapters.length + 1) {
          const idx = activeChapterIndex - 2;
          const updatedChapters = [...updatedProject.ebook.chapters];
          updatedChapters[idx] = {
            ...updatedChapters[idx],
            content: resData.improvedContent
          };
          updatedProject.ebook = {
            ...updatedProject.ebook,
            chapters: updatedChapters
          };
        } else {
          // If conclusion/cta, let's split back if possible, or just replace conclusion
          const text = resData.improvedContent;
          const ctaSplitIndex = text.toLowerCase().lastIndexOf("cta:");
          if (ctaSplitIndex !== -1) {
            updatedProject.ebook = {
              ...updatedProject.ebook,
              conclusion: text.substring(0, ctaSplitIndex).trim(),
              cta: text.substring(ctaSplitIndex + 4).trim()
            };
          } else {
            updatedProject.ebook = {
              ...updatedProject.ebook,
              conclusion: text
            };
          }
        }

        onUpdateProject(updatedProject);
        setShowImproveModal(false);
        setImproveInstructions("");
      } else {
        throw new Error("Resposta de melhoria inválida do servidor.");
      }
    } catch (err) {
      console.error("Erro ao melhorar capítulo:", err);
      setImprovementError("Não foi possível processar a melhoria com a IA no momento. Tente novamente.");
    } finally {
      setIsImprovingChapter(false);
    }
  };

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

  // Tabs definitions with clean styling
  const tabs = [
    { id: "ebook", label: "Ebook", icon: BookOpen },
    { id: "pdf", label: "PDF / Exportar", icon: FileText },
    { id: "research", label: "Pesquisas", icon: Search },
    { id: "x1", label: "Módulo X1", icon: Users },
    { id: "execution", label: "Plano de Execução", icon: CheckSquare },
    { id: "sales", label: "Vendas", icon: DollarSign },
  ] as const;

  // Font size mapping for readers
  const fontSizeClasses = {
    sm: "text-xs leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed sm:leading-loose",
    lg: "text-base sm:text-lg leading-loose",
    xl: "text-lg sm:text-xl leading-loose"
  };

  const fontStyleClasses = {
    serif: "font-serif text-zinc-300",
    sans: "font-sans text-zinc-300",
    mono: "font-mono text-emerald-400"
  };

  const totalProjectRevenue = project.sales.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="w-full select-none" id="project-tabs-container">
      {/* Top Project summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-t-2xl shadow-xl relative overflow-hidden">
        {/* Soft light glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.01] rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-500 font-mono font-black uppercase tracking-wider rounded-lg">
              {project.niche}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono font-semibold">Geração Concluída • {project.createdAt}</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-mono font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Lançado
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3.5xl font-black text-white tracking-tight">
            {project.ebook.title}
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            {project.objective}
          </p>
        </div>

        {/* Cover Preview Mini */}
        <div className="flex items-center gap-4 bg-black/40 border border-zinc-800/80 p-3.5 rounded-xl shrink-0">
          <div className="w-11 h-15 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative shadow-lg">
            <img 
              src={project.coverUrl} 
              alt="Capa Mini" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Volume Editorial</p>
            <p className="text-sm font-black text-white mt-0.5">{project.pages} Páginas</p>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Idioma: {project.language}</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Scroll layout smoothly
                const el = document.getElementById("project-tab-panel-header");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? "text-red-500 border-red-500 bg-zinc-900/30 font-black shadow-[inset_0_1px_0_0_rgba(239,68,68,0.05)]" 
                  : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/10"
              }`}
            >
              <Icon size={14} className={isActive ? "text-red-500" : "text-zinc-500"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with AnimatePresence */}
      <div className="bg-zinc-900/80 border border-zinc-800 border-t-0 p-5 sm:p-8 rounded-b-2xl min-h-[500px]" id="project-tab-panel-header">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DIGITAL EBOOK READER REFORMULATED */}
          {activeTab === "ebook" && (
            <motion.div
              key="tab-ebook"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar chapters navigator - Styled nicely */}
              <div className="lg:col-span-4 space-y-2">
                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <ListTodo size={12} className="text-red-500" />
                  Grade de Capítulos do Volume
                </p>
                
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  <button
                    onClick={() => setActiveChapterIndex(0)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      activeChapterIndex === 0 
                        ? "border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5" 
                        : "border-zinc-800 bg-black/30 hover:border-zinc-700/60"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">0</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-100 truncate">Capa & Sumário Executivo</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">Identidade editorial do infoproduto</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveChapterIndex(1)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      activeChapterIndex === 1 
                        ? "border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5" 
                        : "border-zinc-800 bg-black/30 hover:border-zinc-700/60"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">I</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-100 truncate">Introdução Oficial</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">Visão geral do volume</p>
                    </div>
                  </button>

                  {project.ebook.chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveChapterIndex(index + 2)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        activeChapterIndex === index + 2 
                          ? "border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5" 
                          : "border-zinc-800 bg-black/30 hover:border-zinc-700/60"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-100 truncate">{chapter.title}</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">Capítulo didático prático</p>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setActiveChapterIndex(project.ebook.chapters.length + 2)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      activeChapterIndex === project.ebook.chapters.length + 2 
                        ? "border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5" 
                        : "border-zinc-800 bg-black/30 hover:border-zinc-700/60"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">🏁</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-100 truncate">Conclusão & CTA Comercial</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">Fechamento estratégico do produto</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reader Stage - iPad/Paper reader experience */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950 border border-zinc-800 p-6 sm:p-10 rounded-2xl relative min-h-[500px]">
                
                {/* Book header / toolbar */}
                <div className="border-b border-zinc-800 pb-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                      NEXUS LEITOR EDITORIAL
                    </span>
                    {onUpdateProject && (
                      <button
                        onClick={() => {
                          setImprovementError(null);
                          setShowImproveModal(true);
                        }}
                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-red-500/10 ml-2"
                        title="Melhorar esta seção com Inteligência Artificial"
                      >
                        <Sparkles size={11} className="text-white animate-pulse" />
                        Melhorar com IA
                      </button>
                    )}
                  </div>
                  
                  {/* Font and Size Controls */}
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                    <div className="flex border-r border-zinc-800 pr-1.5 mr-1.5">
                      <button 
                        onClick={() => setReaderFont("serif")} 
                        className={`px-2 py-0.5 rounded text-[10px] font-serif font-bold cursor-pointer transition-colors ${readerFont === "serif" ? "bg-red-500/10 text-red-500" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Fonte Serifada"
                      >
                        Serif
                      </button>
                      <button 
                        onClick={() => setReaderFont("sans")} 
                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold cursor-pointer transition-colors ${readerFont === "sans" ? "bg-red-500/10 text-red-500" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Fonte Bastão"
                      >
                        Sans
                      </button>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setReaderFontSize("sm")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${readerFontSize === "sm" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Texto Pequeno"
                      >
                        A-
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("base")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold cursor-pointer transition-colors ${readerFontSize === "base" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Texto Padrão"
                      >
                        A
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("lg")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${readerFontSize === "lg" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Texto Grande"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reader Contents Pane */}
                <div className={`flex-1 select-text ${fontStyleClasses[readerFont]} ${fontSizeClasses[readerFontSize]} max-w-2xl mx-auto w-full`}>
                  {activeChapterIndex === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-zinc-800/60 pb-8">
                        <div className="md:col-span-4 aspect-[3/4] rounded-xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative group">
                          <img src={project.coverUrl} className="w-full h-full object-cover" alt="Capa" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold bg-red-500/5 border border-red-500/10 px-2.5 py-1 rounded-full uppercase">
                            EDICÃO ESPECIAL DE LANÇAMENTO
                          </span>
                          <h2 className="font-serif text-2xl sm:text-3.5xl font-black text-white tracking-tight leading-tight">{project.ebook.title}</h2>
                          <p className="text-xs sm:text-sm text-zinc-400 font-medium italic">{project.ebook.subtitle}</p>
                          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap gap-4 text-[10px] font-mono text-zinc-500 font-bold">
                            <span className="uppercase">Idioma: {project.language}</span>
                            <span>•</span>
                            <span className="uppercase">Volume: {project.pages} Páginas</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">Sumário Executivo & Sinopse do Produto:</h4>
                        <p className="indent-6 text-zinc-400 font-serif leading-relaxed text-justify">
                          {project.ebook.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeChapterIndex === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-6"
                    >
                      <h3 className="font-serif text-2xl font-bold text-white tracking-tight mb-2 border-b border-zinc-800/80 pb-3">
                        Introdução do Volume
                      </h3>
                      <p className="indent-6 text-zinc-300 font-serif leading-relaxed text-justify whitespace-pre-line">
                        {project.ebook.introduction}
                      </p>
                    </motion.div>
                  )}

                  {activeChapterIndex > 1 && activeChapterIndex <= project.ebook.chapters.length + 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-6"
                    >
                      <h3 className="font-serif text-2xl font-bold text-white tracking-tight mb-2 border-b border-zinc-800/80 pb-3">
                        Capítulo {activeChapterIndex - 1}: {project.ebook.chapters[activeChapterIndex - 2].title}
                      </h3>
                      <p className="indent-6 text-zinc-300 font-serif leading-relaxed text-justify whitespace-pre-line">
                        {project.ebook.chapters[activeChapterIndex - 2].content}
                      </p>
                    </motion.div>
                  )}

                  {activeChapterIndex === project.ebook.chapters.length + 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <h3 className="font-serif text-2xl font-bold text-white tracking-tight mb-2 border-b border-zinc-800/80 pb-3">
                          Considerações Finais & Conclusão
                        </h3>
                        <p className="indent-6 text-zinc-300 font-serif leading-relaxed text-justify whitespace-pre-line">
                          {project.ebook.conclusion}
                        </p>
                      </div>

                      <div className="p-6 bg-red-600/[0.02] border border-red-500/20 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/[0.01] rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest flex items-center gap-1.5">
                          <Sparkles size={12} className="text-red-500" />
                          CHAMADA PARA AÇÃO COMERCIAL (CTA)
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans font-medium text-justify">
                          {project.ebook.cta}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono italic">
                          Dica de conversão: Esta chamada está presente no fechamento do seu livro digital para incentivar a compra de serviços complementares, consultorias ou mentorias diretas no 1x1.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Reader Footer Controls */}
                <div className="border-t border-zinc-800 pt-5 mt-8 flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold">
                  <span>PÁGINA {activeChapterIndex + 1} DE {project.ebook.chapters.length + 3}</span>
                  <div className="flex gap-2.5">
                    <button 
                      disabled={activeChapterIndex === 0}
                      onClick={() => {
                        setActiveChapterIndex(p => p - 1);
                        const el = document.getElementById("project-tab-panel-header");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-all"
                    >
                      Anterior
                    </button>
                    <button 
                      disabled={activeChapterIndex === project.ebook.chapters.length + 2}
                      onClick={() => {
                        setActiveChapterIndex(p => p + 1);
                        const el = document.getElementById("project-tab-panel-header");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-all"
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
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.01] rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-800 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                      <Printer size={15} className="text-red-500" />
                      HUB DE EXPORTAÇÃO EDITORIAL
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      Compilação pronta para impressão ou exportação digital imediata dos canais de vendas.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleCopy(JSON.stringify(project.ebook, null, 2), "CopyJSON")}
                      className="flex items-center gap-2 px-4.5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {copiedText === "CopyJSON" ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      <span>{copiedText === "CopyJSON" ? "Copiado!" : "Copiar Metadados JSON"}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all shadow-lg shadow-red-600/10"
                    >
                      <Download size={13} />
                      <span>Baixar Livro (PDF)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">FORMATO DE SAÍDA</p>
                    <p className="text-xs font-bold text-zinc-200">PDF Editorial A4 Padrão</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">DIAGRAMAÇÃO</p>
                    <p className="text-xs font-bold text-zinc-200">Margens Simétricas Otimizadas</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                    <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">SEGURANÇA DO CONTEÚDO</p>
                    <p className="text-xs font-bold text-zinc-200">Proteção de Cópia Integrada</p>
                  </div>
                </div>

                {/* Printable Frame Preview */}
                <div className="bg-white text-zinc-900 p-8 sm:p-14 rounded-xl shadow-2xl font-serif max-h-[500px] overflow-y-auto border border-zinc-300" id="printable-area-preview">
                  <div className="max-w-2xl mx-auto space-y-12">
                    {/* Cover Section */}
                    <div className="text-center py-20 border-b-2 border-zinc-200">
                      <p className="text-[10px] font-mono tracking-widest text-red-600 font-bold uppercase mb-4">NEXUS PREMIUM PRINTING HOUSES</p>
                      <h1 className="text-4xl font-serif font-black tracking-tight text-zinc-950 mb-3">{project.ebook.title}</h1>
                      <h3 className="text-base italic text-zinc-600 max-w-lg mx-auto leading-relaxed">{project.ebook.subtitle}</h3>
                      <div className="w-16 h-0.5 bg-red-600 mx-auto my-8" />
                      <p className="text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">REGISTRO DA OBRA EDITADA SOB SISTEMA INTEGRADO NEXUS</p>
                    </div>

                    {/* Introdução section */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-bold text-zinc-950">Introdução</h2>
                      <p className="text-sm text-zinc-800 leading-relaxed text-justify indent-6 whitespace-pre-line">
                        {project.ebook.introduction}
                      </p>
                    </div>

                    {/* Chapters section */}
                    {project.ebook.chapters.map((chapter, index) => (
                      <div key={index} className="space-y-4 pt-8 border-t border-zinc-200">
                        <h2 className="text-2xl font-serif font-bold text-zinc-950">Capítulo {index + 1}: {chapter.title}</h2>
                        <p className="text-sm text-zinc-800 leading-relaxed text-justify indent-6 whitespace-pre-line">
                          {chapter.content}
                        </p>
                      </div>
                    ))}

                    {/* Conclusão section */}
                    <div className="space-y-4 pt-8 border-t border-zinc-200">
                      <h2 className="text-2xl font-serif font-bold text-zinc-950">Conclusão</h2>
                      <p className="text-sm text-zinc-800 leading-relaxed text-justify indent-6 whitespace-pre-line">
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
              className="space-y-8"
            >
              {/* Profile/Avatar header info summary */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.01] rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-3 md:border-r md:border-zinc-800/80 md:pr-6">
                  <p className="text-[10px] font-mono uppercase text-red-500 font-bold tracking-widest flex items-center gap-1.5">
                    <Target size={12} />
                    AVATAR DE ALTA CONVERSÃO
                  </p>
                  <h3 className="text-2xl font-serif font-black text-white">{project.research.avatar.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">{project.research.avatar.idealAudience}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:border-r md:border-zinc-800/80 md:px-6">
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Faixa Etária</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.age}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Profissão Principal</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.profession}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Renda Média</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.income}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Gênero</p>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{project.research.avatar.gender}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold mb-2">Interesses Principais mapeados</p>
                    <div className="flex flex-wrap gap-2">
                      {project.research.avatar.interests.map((interest, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-bold font-mono">
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
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/20" />
                  <h4 className="text-xs font-mono uppercase text-red-500 font-bold mb-4 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-red-500" />
                    PONTOS DE DOR (DORES)
                  </h4>
                  <ul className="space-y-3.5">
                    {project.research.avatar.pains.map((pain, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                        <span className="font-medium text-zinc-300">{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sonhos */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-600/20" />
                  <h4 className="text-xs font-mono uppercase text-emerald-500 font-bold mb-4 flex items-center gap-2">
                    <Flame size={14} className="text-emerald-500 animate-pulse" />
                    DESEJOS PRINCIPAIS (SONHOS)
                  </h4>
                  <ul className="space-y-3.5">
                    {project.research.avatar.dreams.map((dream, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="font-medium text-zinc-300">{dream}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objeções */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-600/20" />
                  <h4 className="text-xs font-mono uppercase text-yellow-500 font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-yellow-500" />
                    OBJEÇÕES & RESPOSTAS LÓGICAS
                  </h4>
                  <ul className="space-y-3.5">
                    {project.research.objections.map((obj, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        <span className="font-medium text-zinc-300">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copywriting Elements */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-600/20" />
                  <h4 className="text-xs font-mono uppercase text-purple-400 font-bold mb-4 flex items-center gap-2">
                    <Volume2 size={14} className="text-purple-400" />
                    BRAND VOICE & PALAVRAS-CHAVE
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5">Tom de Voz da Marca:</p>
                      <p className="text-xs text-zinc-200 font-bold">{project.research.tomDeVoz}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-2">Palavras que Convertem:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.research.palavrasConvertem.map((word, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-red-500 font-bold font-mono">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promessas */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/20" />
                  <h4 className="text-xs font-mono uppercase text-red-500 font-bold mb-4 flex items-center gap-2">
                    <Award size={14} className="text-red-500" />
                    GRANDES PROMESSAS (HEADLINES)
                  </h4>
                  <ul className="space-y-3.5">
                    {project.research.promessas.map((prom, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span className="font-medium text-zinc-300 italic">"{prom}"</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefícios & Argumentos */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-600/20" />
                  <h4 className="text-xs font-mono uppercase text-emerald-500 font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500 animate-pulse" />
                    ARGUMENTOS INCONTESTÁVEIS
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5">Diferenciais da Proposta:</p>
                      <ul className="space-y-1.5">
                        {project.research.beneficios.map((ben, idx) => (
                          <li key={idx} className="text-[11px] text-zinc-300 leading-normal flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5">Raciocínio Lógico Proposto:</p>
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
              {/* Category side selector */}
              <div className="lg:col-span-4 space-y-2.5">
                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-red-500 animate-pulse" />
                  Canais de Divulgação Mapeados
                </p>
                
                <div className="space-y-2">
                  {(Object.keys(project.x1) as Array<keyof Project["x1"]>).map((key) => {
                    const item = project.x1[key];
                    const isOpen = activeX1Category === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveX1Category(key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          isOpen 
                            ? "border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5 font-black" 
                            : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{item.category}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 font-mono">{item.communities.length} Ecossistemas ativos</p>
                        </div>
                        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Display Stage */}
              <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl relative shadow-2xl space-y-6">
                
                {/* Active category details */}
                <div className="border-b border-zinc-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider">
                      Canal Alvo: {project.x1[activeX1Category].category}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      Fóruns e redes onde o avatar interage de forma genuína. Utilize com sabedoria para gerar confiança orgânica.
                    </p>
                  </div>
                </div>

                {/* Communities map */}
                <div>
                  <p className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider font-bold mb-3 flex items-center gap-1.5">
                    <ExternalLink size={12} className="text-red-500" />
                    Comunidades Recomendadas:
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

                {/* Outreach Template Box */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-1.5">
                      <Copy size={12} className="text-red-500" />
                      Script Copiável de Abordagem:
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
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                      <CheckSquare size={15} className="text-red-500" />
                      ROTEIRO OPERACIONAL DE ATIVAÇÃO
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      Controle as etapas operacionais concluídas para consolidar seu faturamento e acompanhar seu progresso comercial.
                    </p>
                  </div>
                  
                  {/* Progress tracker */}
                  <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-center shrink-0">
                    <p className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Conclusão</p>
                    <p className="text-lg font-mono font-black text-red-500 mt-0.5">
                      {Math.round(
                        (Object.values(project.milestones).filter(Boolean).length / 
                        Object.keys(project.milestones).length) * 100
                      )}%
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-zinc-850">
                  {/* Item 1 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("ebookCreated")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.ebookCreated 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.ebookCreated && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.ebookCreated ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Estruturação editorial do Ebook concluída
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Mapeamento didático de capítulos, introdução, conclusão e CTA comercial de alta conversão estruturados de forma coerente.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("researchCompleted")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.researchCompleted 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.researchCompleted && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.researchCompleted ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Mapeamento de avatar concluído (Módulo de Pesquisas)
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Análise profunda de dores, sonhos, objeções lógicas e tom de voz ideal para a comunicação com o cliente alvo.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("messagesReady")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.messagesReady 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.messagesReady && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.messagesReady ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Scripts de abordagem do Módulo X1 prontos
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Copys personalizadas prontas e adaptadas especificamente para cada ecossistema digital recomendado.
                      </p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("communitiesAnalyzed")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.communitiesAnalyzed 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.communitiesAnalyzed && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.communitiesAnalyzed ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Análise de tráfego e ecossistemas realizada
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Identificação e listagem dos fóruns de alta conversão onde se encontra o público-alvo qualificado.
                      </p>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("firstPromoDone")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.firstPromoDone 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.firstPromoDone && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.firstPromoDone ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Primeira abordagem oficial executada com sucesso
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Execução prática de postagem ou abordagem direta com base nos scripts fornecidos no Módulo X1.
                      </p>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="py-4.5 flex items-start gap-4.5 cursor-pointer hover:bg-zinc-900/10 px-2 rounded-lg transition-colors" onClick={() => handleMilestoneToggle("firstSaleRegistered")}>
                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        project.milestones.firstSaleRegistered 
                          ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20" 
                          : "border-zinc-800 bg-black hover:border-zinc-700"
                      }`}>
                        {project.milestones.firstSaleRegistered && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${project.milestones.firstSaleRegistered ? "text-zinc-500 line-through font-normal" : "text-zinc-200"}`}>
                        Primeira venda liquidada e faturada
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Primeiro faturamento do infoproduto registrado no ledger de vendas, confirmando a tração comercial.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: SALES MANUAL RECORDING & HISTORY LEDGER - DESIGN CRITIQUE CORRECTED */}
          {activeTab === "sales" && (
            <motion.div
              key="tab-sales"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Manual Form - High-End Gateway Input Style (NOT messy!) */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl self-start shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.01] rounded-full blur-2xl pointer-events-none" />
                
                <h4 className="text-xs font-mono uppercase text-red-500 font-bold mb-4 flex items-center gap-2 tracking-widest border-b border-zinc-900 pb-3">
                  <Coins size={14} className="text-red-500 animate-pulse" />
                  REGISTRAR TRANSAÇÃO COMERCIAL
                </h4>
                
                {saleFormSuccess && (
                  <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs text-center font-bold font-mono">
                    ✓ Transação Registrada e Liquidada!
                  </div>
                )}

                <form onSubmit={handleSaleSubmit} className="space-y-5">
                  {/* Field 1: Value with elegant prefix */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Valor Vendido (BRL)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center text-zinc-500 font-mono font-bold text-xs">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={saleValue}
                        onChange={(e) => setSaleValue(e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-11 pr-4 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-black font-mono shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 2: Transaction Date styled with Calendar icon */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Data da Transação</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                        <Calendar size={14} />
                      </span>
                      <input
                        type="date"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-bold font-mono cursor-pointer shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 3: Note */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Origem de Venda / Observação</label>
                    <input
                      type="text"
                      value={saleNote}
                      onChange={(e) => setSaleNote(e.target.value)}
                      placeholder="Exemplo: Conversão de indicação via WhatsApp"
                      className="w-full px-4.5 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-all font-medium shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/10 cursor-pointer transition-all hover:translate-y-[-1px] active:scale-[0.98]"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>Lançar no Caixa Geral</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Ledger table with proper ledger design */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between min-h-[350px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.01] rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-widest font-bold mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
                    <TrendingUp size={14} className="text-red-500" />
                    EXTRATO DE TRANSAÇÕES VALIDADAS
                  </h4>

                  {project.sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 mb-3 animate-pulse">
                        <DollarSign size={22} />
                      </div>
                      <p className="text-xs font-bold text-zinc-400">Nenhuma transação lançada no projeto</p>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-xs">Use o painel ao lado para registrar vendas manuais e consolidar sua receita.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[320px] overflow-y-auto pr-1">
                      <table className="w-full text-left text-xs divide-y divide-zinc-850">
                        <thead className="bg-black text-zinc-500 uppercase text-[9px] font-mono font-bold tracking-wider">
                          <tr>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Data</th>
                            <th className="py-3 px-3">Valor</th>
                            <th className="py-3 px-3">Origem / Canal</th>
                            {onDeleteSale && <th className="py-3 px-3 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850 font-medium text-zinc-300">
                          {project.sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-zinc-900/40">
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 text-[8px] font-mono font-black text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                                  Liquidada
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-[10px] text-zinc-400">
                                {new Date(sale.date).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="py-3 px-3 text-red-500 font-mono font-black text-sm">
                                R$ {sale.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-3 text-zinc-400 truncate max-w-[120px] font-bold">
                                {sale.note || "Venda Direta"}
                              </td>
                              {onDeleteSale && (
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={() => onDeleteSale(sale.id)}
                                    className="p-1 hover:text-red-400 text-zinc-600 rounded-lg cursor-pointer transition-colors"
                                    title="Remover transação"
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
                  <div className="border-t border-zinc-800 pt-4 mt-6 flex flex-wrap gap-4 justify-between items-center text-[10px] font-mono text-zinc-500 font-bold uppercase">
                    <span>Lançamentos consolidados: {project.sales.length}</span>
                    <span className="font-black text-zinc-200 text-xs tracking-wide">
                      Total Acumulado: R${" "}
                      {totalProjectRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* AI Improvement Modal Overlay */}
      <AnimatePresence>
        {showImproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl max-w-lg w-full relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-red-500 animate-pulse" />
                <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono tracking-tight">Engenharia de IA Nexus</h3>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Instrua a inteligência artificial sobre como você deseja reescrever ou complementar a seção atual do seu ebook comercial. O novo conteúdo será integrado de forma totalmente autoral e profissional.
              </p>

              <div className="bg-black/40 border border-zinc-800/80 p-3 rounded-xl mb-4 text-[11px] font-mono">
                <span className="text-zinc-500 uppercase font-bold">Seção ativa:</span>{" "}
                <span className="text-red-400 font-bold">
                  {activeChapterIndex === 0 && "Capa & Sumário Executivo"}
                  {activeChapterIndex === 1 && "Introdução do Volume"}
                  {activeChapterIndex > 1 && activeChapterIndex <= project.ebook.chapters.length + 1 && `Capítulo ${activeChapterIndex - 1}: ${project.ebook.chapters[activeChapterIndex - 2]?.title}`}
                  {activeChapterIndex === project.ebook.chapters.length + 2 && "Considerações Finais / CTA"}
                </span>
              </div>

              {/* Presets Grid */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">Sugestões Rápidas de Prompt:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Deixar o conteúdo 2x mais persuasivo e magnético",
                    "Adicionar um passo a passo tático com checklist real",
                    "Inserir mais gatilhos mentais voltados para fechamento X1",
                    "Deixar o tom mais premium, formal e focado em alta renda"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImproveInstructions(preset)}
                      className="text-[10px] bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-2">
                <textarea
                  value={improveInstructions}
                  onChange={(e) => setImproveInstructions(e.target.value)}
                  placeholder="Exemplo: Adicione um exemplo prático real de como aplicar este pilar com foco no público de mães empreendedoras."
                  rows={4}
                  className="w-full px-3.5 py-3 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none"
                  disabled={isImprovingChapter}
                />
              </div>

              {improvementError && (
                <p className="text-[10px] font-mono text-red-400 mt-2 font-bold">{improvementError}</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (!isImprovingChapter) {
                      setShowImproveModal(false);
                      setImproveInstructions("");
                    }
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold uppercase transition-all disabled:opacity-30 cursor-pointer"
                  disabled={isImprovingChapter}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImproveChapter}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-red-500/10 cursor-pointer"
                  disabled={isImprovingChapter || !improveInstructions.trim()}
                >
                  {isImprovingChapter ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando IA...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Aplicar Melhoria
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
