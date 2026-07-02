import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Project, 
  Sale 
} from "../types";
import SiteModule from "./SiteModule";
import ResearchModule from "./ResearchModule";
import X1Module from "./X1Module";
import MessagesModule from "./MessagesModule";
import SettingsModule from "./SettingsModule";
import AIChatModule from "./AIChatModule";
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
  Coins,
  Layout,
  Globe,
  Settings,
  Upload,
  Image,
  ChevronLeft
} from "lucide-react";

interface ProjectTabsProps {
  project: Project;
  onUpdateMilestones: (milestones: Project["milestones"]) => void;
  onRegisterSale: (sale: Omit<Sale, "id">) => void;
  onDeleteSale?: (saleId: string) => void;
  onUpdateProject?: (project: Project) => void;
  onBack?: () => void;
  credits?: number;
  consumeCredits?: (amount: number) => boolean;
}

function renderLineSpans(line: string) {
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-white font-extrabold">{part}</strong>;
    }
    return part;
  });
}

function renderContent(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-4" />;
    
    // Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-sm font-bold text-zinc-100 font-mono tracking-wide uppercase mt-6 mb-2">
          {trimmed.slice(4)}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-lg font-bold text-white font-serif tracking-tight mt-8 mb-3 border-b border-zinc-850/60 pb-1.5">
          {trimmed.slice(3)}
        </h3>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={idx} className="text-xl font-serif font-black text-white tracking-tight mt-10 mb-4">
          {trimmed.slice(2)}
        </h2>
      );
    }
    
    // Blockquote
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={idx} className="pl-4 border-l-2 border-red-500 italic my-4 text-zinc-400 bg-red-500/[0.01] py-2 pr-2 rounded-r">
          {renderLineSpans(trimmed.slice(2))}
        </blockquote>
      );
    }
    
    // Bullet list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <li key={idx} className="ml-4 list-disc text-zinc-300 leading-relaxed pl-1 my-1.5">
          {renderLineSpans(trimmed.slice(2))}
        </li>
      );
    }
    
    // Numbered list items
    const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="ml-4 list-decimal text-zinc-300 leading-relaxed pl-1 my-1.5">
          <span className="font-bold text-red-500 mr-1">{numMatch[1]}.</span>
          {renderLineSpans(numMatch[2])}
        </li>
      );
    }
    
    // Regular paragraph
    return (
      <p key={idx} className="indent-6 text-zinc-300 leading-relaxed text-justify mb-4 whitespace-pre-line">
        {renderLineSpans(trimmed)}
      </p>
    );
  });
}

function renderLineSpansPrint(line: string) {
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-zinc-950 font-bold">{part}</strong>;
    }
    return part;
  });
}

function renderContentPrint(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-4" />;
    
    // Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-xs font-bold text-zinc-900 font-mono tracking-wide uppercase mt-4 mb-1">
          {trimmed.slice(4)}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-base font-bold text-zinc-950 font-serif tracking-tight mt-6 mb-2 border-b border-zinc-200 pb-1">
          {trimmed.slice(3)}
        </h3>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={idx} className="text-lg font-serif font-black text-zinc-950 tracking-tight mt-8 mb-3">
          {trimmed.slice(2)}
        </h2>
      );
    }
    
    // Blockquote
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={idx} className="pl-4 border-l-2 border-red-600 italic my-3 text-zinc-600 bg-zinc-50 py-1.5 pr-2 rounded-r">
          {renderLineSpansPrint(trimmed.slice(2))}
        </blockquote>
      );
    }
    
    // Bullet list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <li key={idx} className="ml-4 list-disc text-zinc-800 leading-relaxed pl-1 my-1">
          {renderLineSpansPrint(trimmed.slice(2))}
        </li>
      );
    }
    
    // Numbered list items
    const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="ml-4 list-decimal text-zinc-800 leading-relaxed pl-1 my-1">
          <span className="font-bold text-red-600 mr-1">{numMatch[1]}.</span>
          {renderLineSpansPrint(numMatch[2])}
        </li>
      );
    }
    
    // Regular paragraph
    return (
      <p key={idx} className="indent-6 text-zinc-800 leading-relaxed text-justify mb-3 whitespace-pre-line">
        {renderLineSpansPrint(trimmed)}
      </p>
    );
  });
}

const renderCSSCover = (title: string, subtitle: string, niche: string, isMini: boolean = false) => {
  // Determine gradient / colors based on niche
  const nicheLower = (niche || "").toLowerCase();
  let bgGradient = "from-zinc-900 to-black";
  let accentColor = "text-zinc-400";
  let borderColor = "border-zinc-800";
  let iconGlow = "shadow-[0_0_20px_rgba(255,255,255,0.05)]";
  let badgeBg = "bg-zinc-800/60";

  if (nicheLower.includes("emagrecer") || nicheLower.includes("saúde") || nicheLower.includes("nutri") || nicheLower.includes("fit") || nicheLower.includes("dieta")) {
    bgGradient = "from-emerald-950 to-zinc-950";
    accentColor = "text-emerald-400";
    borderColor = "border-emerald-500/30";
    iconGlow = "shadow-[0_0_20px_rgba(16,185,129,0.15)]";
    badgeBg = "bg-emerald-500/10";
  } else if (nicheLower.includes("dinheiro") || nicheLower.includes("finança") || nicheLower.includes("venda") || nicheLower.includes("invest") || nicheLower.includes("rico") || nicheLower.includes("negócio")) {
    bgGradient = "from-amber-950 via-zinc-950 to-neutral-950";
    accentColor = "text-amber-400";
    borderColor = "border-amber-500/30";
    iconGlow = "shadow-[0_0_20px_rgba(245,158,11,0.15)]";
    badgeBg = "bg-amber-500/10";
  } else if (nicheLower.includes("marketing") || nicheLower.includes("digital") || nicheLower.includes("tráfego") || nicheLower.includes("vendedor") || nicheLower.includes("copy") || nicheLower.includes("escala")) {
    bgGradient = "from-red-950 via-zinc-950 to-neutral-950";
    accentColor = "text-red-500";
    borderColor = "border-red-500/30";
    iconGlow = "shadow-[0_0_20px_rgba(239,68,68,0.15)]";
    badgeBg = "bg-red-500/10";
  } else if (nicheLower.includes("program") || nicheLower.includes("código") || nicheLower.includes("tech") || nicheLower.includes("web") || nicheLower.includes("software")) {
    bgGradient = "from-violet-950 via-zinc-950 to-black";
    accentColor = "text-violet-400";
    borderColor = "border-violet-500/30";
    iconGlow = "shadow-[0_0_20px_rgba(139,92,246,0.15)]";
    badgeBg = "bg-violet-500/10";
  } else if (nicheLower.includes("mental") || nicheLower.includes("mindset") || nicheLower.includes("produti") || nicheLower.includes("foco") || nicheLower.includes("tempo")) {
    bgGradient = "from-sky-950 via-zinc-950 to-neutral-950";
    accentColor = "text-sky-400";
    borderColor = "border-sky-500/30";
    iconGlow = "shadow-[0_0_20px_rgba(14,165,233,0.15)]";
    badgeBg = "bg-sky-500/10";
  }

  if (isMini) {
    return (
      <div className={`w-full h-full bg-gradient-to-b ${bgGradient} border ${borderColor} flex flex-col justify-between p-1.5 rounded-lg shadow-inner relative overflow-hidden text-[5px]`}>
        {/* Spine simulation */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/30 border-r border-white/5" />
        {/* Border frame */}
        <div className={`absolute inset-0.5 border border-dashed ${borderColor}/40 rounded`} />
        
        <div className="text-center z-10 pt-1">
          <p className="font-serif font-black text-white leading-[6px] tracking-tight truncate px-1 max-w-[40px]">{title}</p>
        </div>
        <div className="text-center z-10 pb-1">
          <span className="font-mono text-[3px] font-bold text-zinc-500 uppercase">NEXUS</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-b ${bgGradient} border-2 ${borderColor} flex flex-col justify-between p-6 sm:p-8 rounded-xl shadow-2xl relative overflow-hidden select-none`}>
      {/* 3D Spine Simulation overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent border-r border-white/5 z-20" />
      
      {/* Inner Elegant Border Frame */}
      <div className={`absolute inset-2 border border-dashed ${borderColor}/50 rounded-lg pointer-events-none z-10`} />
      
      {/* Top Banner */}
      <div className="text-center z-10 pt-3 flex flex-col items-center gap-1.5">
        <span className={`px-2 py-0.5 ${badgeBg} border ${borderColor}/50 rounded text-[8px] font-mono tracking-widest ${accentColor} font-black uppercase`}>
          {niche || "Edição Exclusiva"}
        </span>
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/40 to-transparent" />
      </div>

      {/* Main Typography Cluster */}
      <div className="text-center z-10 my-auto px-2 space-y-4">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-[1px] bg-zinc-600/50" />
          <span className={`text-[9px] font-mono tracking-wider ${accentColor} font-black uppercase`}>NEXUS PUBLISHING</span>
          <div className="w-5 h-[1px] bg-zinc-600/50" />
        </div>
        <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-relaxed max-w-sm mx-auto italic">
          {subtitle}
        </p>
      </div>

      {/* Bottom Authority Seal */}
      <div className="text-center z-10 pb-3 flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full bg-zinc-950 border ${borderColor} flex items-center justify-center ${iconGlow}`}>
          <Sparkles size={11} className={`${accentColor} animate-pulse`} />
        </div>
        <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 font-black uppercase">
          NEXUS OPERAÇÕES PREMIUM
        </span>
      </div>
    </div>
  );
};

export default function ProjectTabs({ 
  project, 
  onUpdateMilestones, 
  onRegisterSale,
  onDeleteSale,
  onUpdateProject,
  onBack,
  credits = 0,
  consumeCredits
}: ProjectTabsProps) {
  const activeCoverUrl = project.coverLocalUrl || project.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600";
  const [activeTab, setActiveTab] = useState<string>(
    project.type === "landing_page" ? "landingPage" : project.type === "site" ? "site" : "ebook"
  );
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

    // Check and consume 2 credits
    if (consumeCredits) {
      const success = consumeCredits(2);
      if (!success) {
        setShowImproveModal(false);
        return;
      }
    }

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
      const apiProvider = localStorage.getItem("nexus_api_provider") || "gemini";
      const claudeApiKey = localStorage.getItem("nexus_claude_api_key") || "";

      const res = await fetch("/api/improve-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          niche: project.niche,
          objective: project.objective,
          chapterTitle,
          currentContent,
          instructions: improveInstructions,
          apiProvider,
          claudeApiKey
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
      console.warn("Erro ao melhorar capítulo:", err);
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

  // Tabs definitions with clean styling based on project type
  const tabs = (() => {
    if (project.type === "site") {
      return [
        { id: "site", label: "Site", icon: Globe },
        { id: "ai_chat", label: "Assistente IA", icon: Sparkles },
        { id: "research", label: "Pesquisa", icon: Search },
        { id: "x1", label: "Módulo X1", icon: Users },
        { id: "messages", label: "Mensagens", icon: MessageSquare },
        { id: "sales", label: "Vendas", icon: DollarSign },
        { id: "settings", label: "Configurações", icon: Settings },
      ] as const;
    }
    return [
      { id: "ebook", label: "Ebook", icon: BookOpen },
      { id: "ai_chat", label: "Assistente IA", icon: Sparkles },
      { id: "research", label: "Pesquisa", icon: Search },
      { id: "x1", label: "Módulo X1", icon: Users },
      { id: "messages", label: "Mensagens", icon: MessageSquare },
      { id: "sales", label: "Vendas", icon: DollarSign },
      { id: "settings", label: "Configurações", icon: Settings },
    ] as const;
  })();

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
    <div className="w-full select-none space-y-4" id="project-tabs-container">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-white" />
            <span>Voltar para Meus Projetos</span>
          </button>
        </div>
      )}
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
            {project.ebook?.title || project.name}
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            {project.objective}
          </p>
        </div>
 
        {/* Cover Preview Mini */}
        <div className="flex items-center gap-4 bg-black/40 border border-zinc-800/80 p-3.5 rounded-xl shrink-0">
          <div className="w-11 h-15 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative shadow-lg">
            {project.coverLocalUrl ? (
              <img 
                src={project.coverLocalUrl} 
                alt="Capa Mini" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              renderCSSCover(project.ebook?.title || project.name, project.ebook?.subtitle || "", project.niche, true)
            )}
          </div>
          <div>
            {project.type === "ebook" || !project.type ? (
              <>
                <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Volume Editorial</p>
                <p className="text-sm font-black text-white mt-0.5">{project.pages} Páginas</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Idioma: {project.language}</p>
              </>
            ) : project.type === "landing_page" ? (
              <>
                <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Landing Page</p>
                <p className="text-sm font-black text-white mt-0.5">Pronta p/ Tráfego</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Status: Ativo</p>
              </>
            ) : (
              <>
                <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Site Oficial</p>
                <p className="text-sm font-black text-white mt-0.5">Estruturado</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Status: Ativo</p>
              </>
            )}
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
                        ? "border-red-500 bg-red-500/15 shadow-md shadow-red-500/15" 
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
                        ? "border-red-500 bg-red-500/15 shadow-md shadow-red-500/15" 
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
                          ? "border-red-500 bg-red-500/15 shadow-md shadow-red-500/15" 
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
                        ? "border-red-500 bg-red-500/15 shadow-md shadow-red-500/15" 
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
                      <div className="flex items-center gap-1.5">
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

                        <button
                          onClick={() => {
                            if (consumeCredits) {
                              const success = consumeCredits(1);
                              if (!success) return;
                            }
                            window.print();
                          }}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                          title="Exportar volume como PDF (Consome 1 crédito)"
                        >
                          <Download size={11} className="text-zinc-400" />
                          Exportar PDF
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Font and Size Controls */}
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                    <div className="flex border-r border-zinc-800 pr-1.5 mr-1.5">
                      <button 
                        onClick={() => setReaderFont("serif")} 
                        className={`px-2 py-0.5 rounded text-[10px] font-serif font-bold cursor-pointer transition-colors ${readerFont === "serif" ? "bg-red-500/20 text-red-500" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Fonte Serifada"
                      >
                        Serif
                      </button>
                      <button 
                        onClick={() => setReaderFont("sans")} 
                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold cursor-pointer transition-colors ${readerFont === "sans" ? "bg-red-500/20 text-red-500" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Fonte Bastão"
                      >
                        Sans
                      </button>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setReaderFontSize("sm")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${readerFontSize === "sm" ? "bg-red-500/20 text-red-500 border border-red-500/40" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Texto Pequeno"
                      >
                        A-
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("base")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold cursor-pointer transition-colors ${readerFontSize === "base" ? "bg-red-500/20 text-red-500 border border-red-500/40" : "text-zinc-500 hover:text-zinc-300"}`}
                        title="Texto Padrão"
                      >
                        A
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("lg")} 
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${readerFontSize === "lg" ? "bg-red-500/20 text-red-500 border border-red-500/40" : "text-zinc-500 hover:text-zinc-300"}`}
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
                        <div className="md:col-span-4 space-y-4">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative group w-full h-full">
                            {project.coverLocalUrl ? (
                              <>
                                <img src={project.coverLocalUrl} className="w-full h-full object-cover" alt="Capa" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
                              </>
                            ) : (
                              renderCSSCover(project.ebook?.title || project.name, project.ebook?.subtitle || "", project.niche)
                            )}
                          </div>
                          
                          {/* Custom Image Uploader */}
                          <div className="space-y-3 p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl shadow-md">
                            <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                              <Image size={12} className="text-red-500" />
                              <p className="text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-wider">Design da Capa</p>
                            </div>

                            {/* Option 1: Local Upload */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-zinc-400 font-bold">Upload de Capa</span>
                                {project.coverLocalUrl && (
                                  <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase bg-emerald-500/5 px-1.5 py-0.5 rounded">Ativa</span>
                                )}
                              </div>
                              <label className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-all text-center">
                                <Upload size={12} />
                                <span>{project.coverLocalUrl ? "Alterar Capa" : "Selecionar Imagem"}</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result && onUpdateProject) {
                                          onUpdateProject({
                                            ...project,
                                            coverLocalUrl: event.target.result as string
                                          });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              {project.coverLocalUrl && (
                                <button
                                  onClick={() => {
                                    if (onUpdateProject) {
                                      onUpdateProject({
                                        ...project,
                                        coverLocalUrl: undefined
                                      });
                                    }
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer"
                                >
                                  Remover Personalização
                                </button>
                              )}
                            </div>

                            {/* Option 2: AI Cover (future) */}
                            <div className="pt-2 border-t border-zinc-800 space-y-1">
                              <span className="text-[10px] text-zinc-500 font-mono font-bold block">Geração Inteligente</span>
                              <div className="px-2.5 py-2 bg-zinc-950/80 border border-zinc-850 rounded-lg text-[9px] text-zinc-500 font-medium leading-relaxed">
                                <span className="text-red-500 font-bold block mb-0.5">INDISPONÍVEL AGORA</span>
                                Geração automática indisponível nesta versão. Faça o upload manual acima.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold bg-red-500/15 border border-red-500/35 px-2.5 py-1 rounded-full uppercase">
                            EDICÃO ESPECIAL DE LANÇAMENTO
                          </span>
                          <h2 className="font-serif text-2xl sm:text-3.5xl font-black text-white tracking-tight leading-tight">{project.ebook?.title || project.name}</h2>
                          <p className="text-xs sm:text-sm text-zinc-400 font-medium italic">{project.ebook?.subtitle}</p>
                          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap gap-4 text-[10px] font-mono text-zinc-500 font-bold">
                            <span className="uppercase">Idioma: {project.language}</span>
                            <span>•</span>
                            <span className="uppercase">Volume: {project.pages} Páginas</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">Sumário Executivo & Sinopse do Produto:</h4>
                        <div className="text-zinc-400 font-serif leading-relaxed text-justify">
                          {renderContent(project.ebook.summary)}
                        </div>
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
                      <div className="text-zinc-300 font-serif leading-relaxed text-justify">
                        {renderContent(project.ebook.introduction)}
                      </div>
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
                      <div className="text-zinc-300 font-serif leading-relaxed text-justify">
                        {renderContent(project.ebook.chapters[activeChapterIndex - 2].content)}
                      </div>
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
                        <div className="text-zinc-300 font-serif leading-relaxed text-justify">
                          {renderContent(project.ebook.conclusion)}
                        </div>
                      </div>

                      <div className="p-6 bg-red-600/[0.02] border border-red-500/20 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/[0.01] rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest flex items-center gap-1.5">
                          <Sparkles size={12} className="text-red-500" />
                          CHAMADA PARA AÇÃO COMERCIAL (CTA)
                        </h4>
                        <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans font-medium text-justify">
                          {renderContent(project.ebook.cta)}
                        </div>
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

          {/* AI CHAT MODULE */}
          {activeTab === "ai_chat" && (
            <motion.div
              key="tab-ai-chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <AIChatModule 
                project={project} 
                onUpdateProject={onUpdateProject} 
                credits={credits}
                consumeCredits={consumeCredits}
              />
            </motion.div>
          )}

          {/* SITE MODULE */}
          {activeTab === "site" && (
            <motion.div
              key="tab-site"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <SiteModule project={project} onUpdateProject={onUpdateProject} />
            </motion.div>
          )}

          {/* RESEARCH MODULE */}
          {activeTab === "research" && (
            <motion.div
              key="tab-research"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ResearchModule project={project} />
            </motion.div>
          )}

          {/* X1 MODULE */}
          {activeTab === "x1" && (
            <motion.div
              key="tab-x1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <X1Module project={project} />
            </motion.div>
          )}

          {/* MESSAGES MODULE */}
          {activeTab === "messages" && (
            <motion.div
              key="tab-messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <MessagesModule project={project} />
            </motion.div>
          )}

          {/* SETTINGS MODULE */}
          {activeTab === "settings" && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <SettingsModule project={project} onUpdateProject={onUpdateProject} />
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
                    <div className="relative w-full min-w-0 overflow-hidden">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                        <Calendar size={14} />
                      </span>
                      <input
                        type="date"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        className="w-full min-w-0 pl-11 pr-3 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-bold font-mono cursor-pointer shadow-inner block appearance-none"
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
