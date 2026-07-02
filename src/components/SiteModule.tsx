import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Award, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  Grid, 
  Palette, 
  HelpCircle, 
  Mail, 
  Phone, 
  FileText, 
  Home, 
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Project, SiteContent, SiteFeature } from "../types";

interface SiteModuleProps {
  project: Project;
  onUpdateProject?: (project: Project) => void;
}

type EditorTab = "design" | "hero" | "about" | "features" | "faqs" | "contact";
type ViewMode = "desktop" | "tablet" | "mobile";

export default function SiteModule({ project, onUpdateProject }: SiteModuleProps) {
  // Setup the site data with rich fallback settings matching selected options
  const defaultSite: SiteContent = {
    name: project.site?.name || project.name || "Nexus Business",
    niche: project.site?.niche || project.niche,
    objective: project.site?.objective || project.objective,
    heroTitle: project.site?.heroTitle || `Soluções Inteligentes em ${project.niche}`,
    heroSubtitle: project.site?.heroSubtitle || `Capacitando profissionais e acelerando resultados com as melhores práticas do mercado global.`,
    aboutText: project.site?.aboutText || `Fundada sob a premissa de entregar valor tático imediato, nossa iniciativa visa desmitificar processos complexos. Acreditamos que a consistência metodológica é a única chave real para o sucesso sustentável.`,
    contactEmail: project.site?.contactEmail || "suporte@nexusplataforma.com",
    contactPhone: project.site?.contactPhone || "+55 (11) 99999-9999",
    faqs: project.site?.faqs || [
      { question: "Como funciona o suporte?", answer: "Atendimento de segunda a sexta-feira via e-mail corporativo." },
      { question: "Qual a metodologia do negócio?", answer: "Focamos na entrega rápida de valor e soluções táticas descomplicadas." }
    ],
    features: project.site?.features || [
      { title: "Metodologia Validada", description: "Todos os nossos caminhos são testados e focados em alta conversão e utilidade." },
      { title: "Material de Apoio", description: "Apostilas, checklists e ferramentas extras inclusas para potencializar sua execução." }
    ],
    theme: project.site?.theme || "nexus",
    layout: project.site?.layout || "tech",
    pages: project.site?.pages || ["home", "about", "features", "contact", "faq"]
  };

  const [activeEditorTab, setActiveEditorTab] = useState<EditorTab>("design");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // States for adding new items live
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDesc, setNewFeatureDesc] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const handleSiteChange = (field: keyof SiteContent, value: any) => {
    if (!onUpdateProject) return;
    const updatedSite = { ...defaultSite, [field]: value };
    onUpdateProject({ ...project, site: updatedSite });
  };

  const handleAddFeature = () => {
    if (!newFeatureTitle.trim() || !newFeatureDesc.trim()) return;
    const updatedFeatures = [...defaultSite.features, { title: newFeatureTitle.trim(), description: newFeatureDesc.trim() }];
    handleSiteChange("features", updatedFeatures);
    setNewFeatureTitle("");
    setNewFeatureDesc("");
  };

  const handleRemoveFeature = (idx: number) => {
    const updatedFeatures = defaultSite.features.filter((_, i) => i !== idx);
    handleSiteChange("features", updatedFeatures);
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const updatedFaqs = [...defaultSite.faqs, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }];
    handleSiteChange("faqs", updatedFaqs);
    setNewFaqQuestion("");
    setNewFaqAnswer("");
  };

  const handleRemoveFaq = (idx: number) => {
    const updatedFaqs = defaultSite.faqs.filter((_, i) => i !== idx);
    handleSiteChange("faqs", updatedFaqs);
  };

  // Theme-specific styling classes provider
  const getThemeStyles = () => {
    const theme = defaultSite.theme || "nexus";
    switch (theme) {
      case "oceanic":
        return {
          wrapper: "bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-white",
          headerBg: "bg-slate-950/80 border-slate-900/80 backdrop-blur-md",
          logo: "text-cyan-400 font-extrabold tracking-widest uppercase",
          badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
          navActive: "text-cyan-400 font-bold",
          heading: "text-white font-black tracking-tight font-sans",
          buttonPrimary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-cyan-500/10",
          cardBg: "bg-slate-900/60 border border-slate-800/80 shadow-md",
          cardText: "text-slate-400",
          accentColor: "text-cyan-400",
          sectionYBg: "bg-slate-900/30 border-y border-slate-900",
          faqActiveQuestion: "text-cyan-300",
          footerBg: "bg-slate-950 border-t border-slate-900",
          iconColor: "text-cyan-400",
        };
      case "amber":
        return {
          wrapper: "bg-neutral-950 text-neutral-200 selection:bg-amber-500/30 selection:text-white",
          headerBg: "bg-neutral-950/80 border-neutral-900 backdrop-blur-md",
          logo: "text-amber-500 font-extrabold tracking-wider uppercase",
          badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
          navActive: "text-amber-500 font-bold",
          heading: "text-white font-extrabold tracking-tight font-sans",
          buttonPrimary: "bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/10 font-bold",
          cardBg: "bg-neutral-900/50 border border-neutral-800 shadow-md",
          cardText: "text-neutral-400",
          accentColor: "text-amber-500",
          sectionYBg: "bg-neutral-900/20 border-y border-neutral-900",
          faqActiveQuestion: "text-amber-400",
          footerBg: "bg-black border-t border-neutral-900",
          iconColor: "text-amber-500",
        };
      case "slate":
        return {
          wrapper: "bg-zinc-50 text-zinc-800 selection:bg-zinc-200",
          headerBg: "bg-white/80 border-zinc-200/80 backdrop-blur-md",
          logo: "text-zinc-950 font-black tracking-tight uppercase",
          badge: "bg-zinc-100 text-zinc-800 border border-zinc-200",
          navActive: "text-zinc-950 font-extrabold",
          heading: "text-zinc-950 font-bold tracking-tight font-sans",
          buttonPrimary: "bg-zinc-950 text-white hover:bg-zinc-900 shadow-md",
          cardBg: "bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all",
          cardText: "text-zinc-600",
          accentColor: "text-zinc-950",
          sectionYBg: "bg-zinc-100/50 border-y border-zinc-200/60",
          faqActiveQuestion: "text-zinc-950 font-bold",
          footerBg: "bg-white border-t border-zinc-200",
          iconColor: "text-zinc-900",
        };
      case "nexus":
      default:
        return {
          wrapper: "bg-zinc-950 text-zinc-300 selection:bg-red-500/30 selection:text-white",
          headerBg: "bg-zinc-950/80 border-zinc-900/80 backdrop-blur-md",
          logo: "text-red-500 font-black tracking-widest uppercase",
          badge: "bg-red-500/10 text-red-400 border border-red-500/20",
          navActive: "text-red-500 font-bold",
          heading: "text-white font-extrabold tracking-tight font-sans",
          buttonPrimary: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/15",
          cardBg: "bg-zinc-900/60 border border-zinc-850/80 shadow-md",
          cardText: "text-zinc-400",
          accentColor: "text-red-500",
          sectionYBg: "bg-zinc-900/40 border-y border-zinc-900",
          faqActiveQuestion: "text-red-400",
          footerBg: "bg-black border-t border-zinc-900",
          iconColor: "text-red-500",
        };
    }
  };

  const style = getThemeStyles();
  const activePages = defaultSite.pages || ["home", "about", "features", "contact", "faq"];

  // Render the Simulated Site (for reuse in both preview box and fullscreen)
  const renderSimulatedSite = () => {
    const layout = defaultSite.layout || "tech";

    return (
      <div className={`w-full min-h-full ${style.wrapper} transition-colors duration-300 flex flex-col font-sans`}>
        {/* Navigation Bar */}
        <header className={`sticky top-0 z-10 border-b ${style.headerBg} px-6 py-4 flex justify-between items-center transition-all`}>
          <div className="flex items-center gap-2">
            <Globe size={16} className={style.iconColor} />
            <span className={`text-sm ${style.logo}`}>{defaultSite.name}</span>
          </div>
          <nav className="hidden sm:flex gap-5 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400">
            {activePages.includes("home") && <span className={`${style.navActive} cursor-pointer`}>Início</span>}
            {activePages.includes("about") && <span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span>}
            {activePages.includes("features") && <span className="hover:text-white transition-colors cursor-pointer">Diferenciais</span>}
            {activePages.includes("faq") && <span className="hover:text-white transition-colors cursor-pointer">FAQs</span>}
            {activePages.includes("contact") && <span className="hover:text-white transition-colors cursor-pointer">Contato</span>}
          </nav>
          <button className={`text-[10px] font-mono uppercase px-3 py-1.5 rounded-md font-bold tracking-wider ${style.buttonPrimary}`}>
            Contato
          </button>
        </header>

        {/* Hero Section */}
        {activePages.includes("home") && (
          <section className="px-6 py-16 text-center max-w-4xl mx-auto space-y-6 flex-shrink-0">
            <div className="flex justify-center">
              <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full font-extrabold ${style.badge} flex items-center gap-1.5`}>
                <Sparkles size={10} />
                Solução Ativa de Apoio Institucional
              </span>
            </div>
            <h1 className={`text-2.5xl sm:text-4xl leading-tight max-w-3xl mx-auto ${style.heading}`}>
              {defaultSite.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {defaultSite.heroSubtitle}
            </p>
            <div className="pt-4">
              <button className={`px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-extrabold transition-all ${style.buttonPrimary}`}>
                Falar com um Consultor
              </button>
            </div>
          </section>
        )}

        {/* About Us Section */}
        {activePages.includes("about") && (
          <section className={`py-12 px-6 sm:px-12 ${style.sectionYBg} transition-colors`}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 space-y-2">
                <span className={`text-[9px] font-mono uppercase tracking-wider font-extrabold block ${style.accentColor}`}>Quem Somos</span>
                <h3 className={`text-lg font-bold tracking-tight leading-snug uppercase ${style.heading === "text-zinc-950 font-bold tracking-tight font-sans" ? "text-zinc-950" : "text-white"}`}>
                  Nossa Missão & Valores de Marca
                </h3>
              </div>
              <div className="md:col-span-8">
                <p className={`text-xs leading-relaxed text-justify ${style.cardText}`}>
                  {defaultSite.aboutText}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Features Block (Based on Layout) */}
        {activePages.includes("features") && (
          <section className="py-16 px-6 sm:px-12 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className={`text-[9px] font-mono uppercase tracking-widest font-extrabold ${style.accentColor}`}>Diferenciais Competitivos</span>
              <h2 className={`text-xl sm:text-2xl font-bold uppercase ${style.heading === "text-zinc-950 font-bold tracking-tight font-sans" ? "text-zinc-950" : "text-white"}`}>Nossos Pilares de Atuação</h2>
            </div>

            {layout === "tech" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {defaultSite.features.map((feat, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl space-y-3 relative overflow-hidden group ${style.cardBg}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-4 right-4" />
                    <span className="text-[10px] font-mono text-zinc-500 block font-bold">Pilar 0{idx + 1}</span>
                    <h4 className={`text-xs font-mono font-bold uppercase ${style.heading === "text-zinc-950 font-bold tracking-tight font-sans" ? "text-zinc-950" : "text-white"}`}>{feat.title}</h4>
                    <p className={`text-[11px] leading-relaxed ${style.cardText}`}>{feat.description}</p>
                  </div>
                ))}
              </div>
            )}

            {layout === "business" && (
              <div className="space-y-4">
                {defaultSite.features.map((feat, idx) => (
                  <div key={idx} className={`p-5 rounded-xl flex gap-4 items-start ${style.cardBg}`}>
                    <div className={`w-8 h-8 rounded-lg ${style.badge} flex items-center justify-center font-mono font-extrabold text-xs shrink-0`}>
                      0{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold uppercase text-white">{feat.title}</h4>
                      <p className={`text-[11px] leading-relaxed ${style.cardText}`}>{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {layout === "creative" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {defaultSite.features.map((feat, idx) => (
                  <div key={idx} className={`p-6 rounded-3xl space-y-3 border-l-4 border-l-red-500 ${style.cardBg}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-white uppercase">{feat.title}</h4>
                      <Award size={14} className={style.iconColor} />
                    </div>
                    <p className={`text-[11px] leading-relaxed ${style.cardText}`}>{feat.description}</p>
                  </div>
                ))}
              </div>
            )}

            {layout === "clean" && (
              <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto text-center divide-y divide-zinc-800/10">
                {defaultSite.features.map((feat, idx) => (
                  <div key={idx} className="pt-6 first:pt-0 space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-950 tracking-wider uppercase">{feat.title}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-lg mx-auto">{feat.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* FAQs Section */}
        {activePages.includes("faq") && (
          <section className={`py-12 px-6 sm:px-12 ${style.sectionYBg} transition-colors`}>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <span className={`text-[9px] font-mono uppercase tracking-widest font-extrabold ${style.accentColor}`}>Dúvidas Estratégicas</span>
                <h3 className={`text-lg font-bold uppercase tracking-tight ${style.heading === "text-zinc-950 font-bold tracking-tight font-sans" ? "text-zinc-950" : "text-white"}`}>Perguntas Frequentes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {defaultSite.faqs.map((faq, idx) => (
                  <div key={idx} className={`p-5 rounded-xl space-y-2 ${style.cardBg}`}>
                    <p className={`text-xs font-bold font-mono ${style.faqActiveQuestion} flex items-start gap-1.5`}>
                      <span className="text-[10px] text-zinc-500 shrink-0">Q.</span>
                      {faq.question}
                    </p>
                    <p className={`text-[11px] leading-relaxed pl-4 ${style.cardText}`}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact/Footer Block */}
        {activePages.includes("contact") && (
          <footer className={`py-12 px-6 sm:px-12 ${style.footerBg} text-center space-y-6`}>
            <div className="max-w-3xl mx-auto space-y-3">
              <p className="text-[9px] font-mono uppercase text-zinc-500 font-extrabold tracking-widest">
                {defaultSite.name} — Suporte & Contatos Oficiais
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
                <span className="text-[11px] font-medium flex items-center gap-1.5">
                  <Mail size={12} className={style.iconColor} />
                  E-mail: {defaultSite.contactEmail}
                </span>
                <span className="hidden sm:inline text-zinc-700">|</span>
                <span className="text-[11px] font-mono flex items-center gap-1.5">
                  <Phone size={12} className={style.iconColor} />
                  Tel: {defaultSite.contactPhone}
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-zinc-900 max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[9px] text-zinc-500 font-mono gap-4">
              <span>© {new Date().getFullYear()} {defaultSite.name}. Todos os direitos reservados.</span>
              <span className="flex gap-4">
                <span>Política de Privacidade</span>
                <span>Termos de Uso</span>
              </span>
            </div>
          </footer>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upper action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
        <div>
          <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2">
            <Globe size={15} />
            Estúdio No-Code Nexus Web
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium">
            Personalize a identidade da marca, blocos institucionais e veja a visualização em tempo real.
          </p>
        </div>
        <button
          onClick={() => setIsFullscreen(true)}
          className="px-4 py-2 bg-red-600 text-white text-xs font-mono uppercase font-black tracking-wider rounded-lg flex items-center gap-2 cursor-pointer hover:bg-red-700 transition-all shadow-md shadow-red-500/5"
        >
          <Eye size={14} />
          Visualizar Completo (Full Screen)
        </button>
      </div>

      {/* Embedded Builder and Live Mockup layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left builder controls */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[600px]">
          {/* Builder Sidebar menu tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-zinc-850 bg-black/60 text-[10px] font-mono font-bold uppercase tracking-wider text-center">
            {[
              { id: "design", label: "Design", icon: Palette },
              { id: "hero", label: "Hero", icon: Home },
              { id: "about", label: "Sobre", icon: FileText },
              { id: "features", label: "Pilares", icon: Grid },
              { id: "faqs", label: "FAQs", icon: HelpCircle },
              { id: "contact", label: "Contato", icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as EditorTab)}
                  className={`py-3.5 flex flex-col items-center gap-1 cursor-pointer transition-all border-r last:border-r-0 border-zinc-850/60 ${
                    activeEditorTab === tab.id
                      ? "text-red-500 bg-zinc-950 border-b-2 border-b-red-500"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Builder panel container */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[500px] space-y-6">
            <AnimatePresence mode="wait">
              {activeEditorTab === "design" && (
                <motion.div
                  key="editor-design"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Estilo & Layout</h4>
                    <p className="text-[10px] text-zinc-500">Configure as bases estéticas do site.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Nome Corporativo da Marca</label>
                    <input
                      type="text"
                      value={defaultSite.name}
                      onChange={(e) => handleSiteChange("name", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Identidade Visual (Tema)</label>
                    <select
                      value={defaultSite.theme}
                      onChange={(e) => handleSiteChange("theme", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 cursor-pointer"
                    >
                      <option value="nexus">Nexus Dark Red (Glow)</option>
                      <option value="oceanic">Oceanic Deep Blue</option>
                      <option value="amber">Amber Creative Agency</option>
                      <option value="slate">Minimal Slate (Light Clean)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Estrutura de Grid (Layout)</label>
                    <select
                      value={defaultSite.layout}
                      onChange={(e) => handleSiteChange("layout", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 cursor-pointer"
                    >
                      <option value="tech">Modern Tech Grid</option>
                      <option value="business">Corporate Authority</option>
                      <option value="creative">Creative Bold Pitch</option>
                      <option value="clean">Ultra Minimalist</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Seções Ativas no Menu</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "home", label: "Início" },
                        { id: "about", label: "Sobre Nós" },
                        { id: "features", label: "Diferenciais" },
                        { id: "faq", label: "FAQs" },
                        { id: "contact", label: "Contatos" }
                      ].map((item) => {
                        const hasPage = activePages.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (hasPage) {
                                if (activePages.length > 1) {
                                  handleSiteChange("pages", activePages.filter(x => x !== item.id));
                                }
                              } else {
                                handleSiteChange("pages", [...activePages, item.id]);
                              }
                            }}
                            className={`p-2 border rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                              hasPage ? "border-red-500 bg-red-500/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500"
                            }`}
                          >
                            <span>{item.label}</span>
                            {hasPage && <Check size={12} className="text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeEditorTab === "hero" && (
                <motion.div
                  key="editor-hero"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Banner Inicial (Hero)</h4>
                    <p className="text-[10px] text-zinc-500">Configure a primeira impressão do visitante.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Título Principal do Site</label>
                    <textarea
                      value={defaultSite.heroTitle}
                      onChange={(e) => handleSiteChange("heroTitle", e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 leading-normal resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Subtítulo do Banner</label>
                    <textarea
                      value={defaultSite.heroSubtitle}
                      onChange={(e) => handleSiteChange("heroSubtitle", e.target.value)}
                      rows={4}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 leading-normal resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeEditorTab === "about" && (
                <motion.div
                  key="editor-about"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Seção "Sobre Nós"</h4>
                    <p className="text-[10px] text-zinc-500">Apresente a história e objetivos corporativos da empresa.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Texto Institucional Corporativo</label>
                    <textarea
                      value={defaultSite.aboutText}
                      onChange={(e) => handleSiteChange("aboutText", e.target.value)}
                      rows={6}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 leading-relaxed resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeEditorTab === "features" && (
                <motion.div
                  key="editor-features"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Pilares e Diferenciais</h4>
                    <p className="text-[10px] text-zinc-500">Adicione ou exclua diferenciais técnicos competitivos.</p>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3">
                    {defaultSite.features.map((feat, idx) => (
                      <div key={idx} className="p-3 bg-black/60 border border-zinc-800 rounded-lg flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">{feat.title}</p>
                          <p className="text-[10px] text-zinc-500 leading-normal">{feat.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Feature Form */}
                  <div className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-3 pt-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-red-500 font-bold block">Adicionar Pilar</span>
                    <input
                      type="text"
                      placeholder="Título do Pilar (ex: Prático)"
                      value={newFeatureTitle}
                      onChange={(e) => setNewFeatureTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200"
                    />
                    <textarea
                      placeholder="Descrição resumida do diferencial comercial..."
                      value={newFeatureDesc}
                      onChange={(e) => setNewFeatureDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 leading-normal resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="w-full py-2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-wider font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      Adicionar Diferencial
                    </button>
                  </div>
                </motion.div>
              )}

              {activeEditorTab === "faqs" && (
                <motion.div
                  key="editor-faqs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Dúvidas Frequentes (FAQs)</h4>
                    <p className="text-[10px] text-zinc-500">Adicione e remova as dúvidas corporativas dos leads.</p>
                  </div>

                  {/* FAQs List */}
                  <div className="space-y-3">
                    {defaultSite.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-black/60 border border-zinc-800 rounded-lg flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white font-mono">Q: {faq.question}</p>
                          <p className="text-[10px] text-zinc-500 leading-normal">A: {faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add FAQ Form */}
                  <div className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-red-500 font-bold block">Adicionar Pergunta</span>
                    <input
                      type="text"
                      placeholder="Qual a pergunta do cliente?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200"
                    />
                    <textarea
                      placeholder="Qual a resposta oficial?"
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 leading-normal resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="w-full py-2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-wider font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      Adicionar Pergunta
                    </button>
                  </div>
                </motion.div>
              )}

              {activeEditorTab === "contact" && (
                <motion.div
                  key="editor-contact"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase text-white font-black">Contatos de Suporte</h4>
                    <p className="text-[10px] text-zinc-500">Configure as âncoras de contato para o seu funil X1.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">E-mail Corporativo</label>
                    <input
                      type="email"
                      value={defaultSite.contactEmail}
                      onChange={(e) => handleSiteChange("contactEmail", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Telefone Comercial / WhatsApp</label>
                    <input
                      type="text"
                      value={defaultSite.contactPhone}
                      onChange={(e) => handleSiteChange("contactPhone", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-zinc-900 border-t border-zinc-850 text-[10px] text-zinc-500 leading-normal flex items-center justify-between">
            <span>No-Code Builder Ativo</span>
            <span className="font-mono text-red-500 uppercase font-black text-[9px]">Nexus v2.0</span>
          </div>
        </div>

        {/* Embedded Live Previewer Panel */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
          {/* Mock Browser Header */}
          <div className="bg-zinc-900 border-b border-zinc-850 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="bg-black/60 text-zinc-500 text-[10px] font-mono px-3 py-1 rounded-md border border-zinc-800/60 max-w-xs truncate">
                https://{defaultSite.name.toLowerCase().replace(/\s+/g, "")}.nexusportal.app
              </div>
            </div>

            {/* Responsive simulator selectors */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-1.5 rounded text-zinc-400 cursor-pointer ${viewMode === "desktop" ? "bg-zinc-800 text-red-500" : "hover:text-white"}`}
                title="Desktop View"
              >
                <Laptop size={14} />
              </button>
              <button
                onClick={() => setViewMode("tablet")}
                className={`p-1.5 rounded text-zinc-400 cursor-pointer ${viewMode === "tablet" ? "bg-zinc-800 text-red-500" : "hover:text-white"}`}
                title="Tablet View"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-1.5 rounded text-zinc-400 cursor-pointer ${viewMode === "mobile" ? "bg-zinc-800 text-red-500" : "hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>

          {/* Simulator wrapper area */}
          <div className="flex-1 bg-zinc-900 p-4 overflow-auto flex items-start justify-center min-h-[480px]">
            <motion.div
              layout
              transition={{ duration: 0.3 }}
              className={`bg-zinc-950 shadow-2xl rounded-xl border border-zinc-800/50 overflow-hidden h-[500px] overflow-y-auto ${
                viewMode === "desktop" ? "w-full" : viewMode === "tablet" ? "w-[600px]" : "w-[360px]"
              }`}
            >
              {renderSimulatedSite()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Immersive Full Screen Live Previewer Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col"
          >
            {/* Fullscreen control dashboard */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center text-zinc-300">
              <div className="flex items-center gap-3">
                <Globe className="text-red-500 animate-pulse" size={18} />
                <div>
                  <h4 className="text-xs font-mono uppercase text-white font-black">Visualizador de Site Completo (Live Site Mode)</h4>
                  <p className="text-[10px] text-zinc-500 font-mono">Modo de produção: {defaultSite.name}.nexusportal.app</p>
                </div>
              </div>

              {/* Center Controls: Device simulation & Theme Quick Swap */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex bg-black/40 border border-zinc-800 p-1 rounded-lg gap-1">
                  {(["desktop", "tablet", "mobile"] as ViewMode[]).map((mode) => {
                    const Icon = mode === "desktop" ? Laptop : mode === "tablet" ? Tablet : Smartphone;
                    return (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold cursor-pointer transition-all ${
                          viewMode === mode ? "bg-red-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <Icon size={12} />
                        {mode}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Theme Swap Info */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-black/40 px-3 py-1.5 border border-zinc-800 rounded-lg">
                  <Palette size={12} className="text-red-500" />
                  <span>Identidade Ativa: <b>{(defaultSite.theme || "nexus").toUpperCase()}</b></span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-red-500/10"
              >
                Sair do Modo Completo
              </button>
            </div>

            {/* Immersive Full Screen stage */}
            <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 md:p-8 flex items-start justify-center">
              <motion.div
                layout
                transition={{ duration: 0.3 }}
                className={`bg-zinc-950 shadow-2xl rounded-2xl border border-zinc-800 overflow-hidden min-h-[90%] max-h-full overflow-y-auto pb-12 ${
                  viewMode === "desktop" ? "w-full" : viewMode === "tablet" ? "w-[768px]" : "w-[390px]"
                }`}
              >
                {renderSimulatedSite()}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
