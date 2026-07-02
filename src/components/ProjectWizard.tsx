import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Globe, 
  Layers, 
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
  Check,
  Lock,
  Cpu,
  Target,
  FileText,
  Sliders,
  Compass,
  Layout,
  CheckCircle2
} from "lucide-react";

interface ProjectWizardProps {
  onGenerate: (
    name: string, 
    niche: string, 
    objective: string, 
    pages: number, 
    language: string, 
    coverUrl?: string, 
    type?: "ebook" | "landing_page" | "site",
    apiProvider?: "gemini" | "claude",
    claudeApiKey?: string,
    theme?: "nexus" | "oceanic" | "amber" | "slate",
    layout?: "tech" | "business" | "creative" | "clean",
    selectedPages?: string[]
  ) => void;
  isGenerating: boolean;
  mode?: "ebook" | "landing_page" | "site";
}

export default function ProjectWizard({ onGenerate, isGenerating, mode = "ebook" }: ProjectWizardProps) {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [objective, setObjective] = useState("");
  const [pages, setPages] = useState(45);
  const [language, setLanguage] = useState("Português");
  const [coverOption, setCoverOption] = useState<string | null>(null);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [siteTheme, setSiteTheme] = useState<"nexus" | "oceanic" | "amber" | "slate">("nexus");
  const [siteLayout, setSiteLayout] = useState<"tech" | "business" | "creative" | "clean">("tech");
  const [selectedPages, setSelectedPages] = useState<string[]>(["home", "about", "features", "contact", "faq"]);
  
  // Keep standard AI state internally (hidden from UI)
  const [apiProvider] = useState<"gemini" | "claude">("gemini");
  const [claudeApiKey] = useState("");
  
  // Loading status steps shown during actual generation
  const [generationStep, setGenerationStep] = useState(0);

  const getProgressSteps = () => {
    if (mode === "landing_page") {
      return [
        "analisando proposta de valor e nicho...",
        "definindo headline magnética de alta conversão...",
        "estruturando seções de benefícios e problemas...",
        "redigindo depoimentos e garantias...",
        "compilando código e design da página..."
      ];
    }
    if (mode === "site") {
      return [
        "analisando identidade da marca e nicho...",
        "estruturando seções do site institucional...",
        "redigindo textos 'sobre nós' e diferenciais...",
        "configurando formulários de contato e FAQs...",
        "compilando código e design do portal..."
      ];
    }
    return [
      "analisando premissas e nicho de mercado digital...",
      "mapeando comportamento de compra e público-alvo de alto padrão...",
      "estruturando roteiro pedagógico e capítulos autorais de alta conversão...",
      "redigindo conteúdo real, copys persuasivas e ofertas exclusivas...",
      "compilando design editorial, diagramação e finalizando produto premium..."
    ];
  };

  const generationProgressSteps = getProgressSteps();

  // Start progress intervals if generating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep((prev) => (prev < generationProgressSteps.length - 1 ? prev + 1 : prev));
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isGenerating, mode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !niche || !objective) return;
    onGenerate(
      name, 
      niche, 
      objective, 
      pages, 
      language, 
      coverOption === "custom" ? customCoverUrl : undefined, 
      mode,
      apiProvider,
      claudeApiKey,
      siteTheme,
      siteLayout,
      selectedPages
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto select-none px-1">
      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`bg-zinc-900/95 border p-6 sm:p-10 md:p-12 rounded-2xl relative shadow-2xl overflow-hidden ${
              mode === "site" ? "border-cyan-500/20" : "border-zinc-800/80"
            }`}
          >
            {/* Top Laser Accent Bar based on mode */}
            {mode === "site" ? (
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            ) : (
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            )}
            
            {/* Soft background glow based on mode */}
            {mode === "site" ? (
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            ) : (
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Header section with high trust indicators */}
            <div className="mb-10 border-b border-zinc-800/60 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {mode === "site" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-[9px] uppercase tracking-wider">
                    <Globe size={11} className="animate-pulse text-cyan-400" />
                    ESTÚDIO DE CRIAÇÃO WEB NEXUS
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/35 text-red-500 font-mono font-bold text-[9px] uppercase tracking-wider">
                    <BookOpen size={11} className="animate-pulse text-red-500" />
                    SISTEMA EDITORIAL DIGITAL NEXUS
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono">
                  <Lock size={12} className="text-emerald-500" />
                  <span>SISTEMA INTEGRADO & CRIPTOGRAFADO</span>
                </div>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {mode === "site" 
                  ? "Desenvolver Novo Portal Institucional Premium" 
                  : mode === "landing_page" 
                  ? "Desenvolver Nova Landing Page de Alta Conversão" 
                  : "Estruturar Novo Ebook Editorial Premium"}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed max-w-3xl font-medium">
                {mode === "site" 
                  ? "Nossa inteligência desenvolve um site completo com seções institucionais de alta fidelidade, contatos estruturados e design refinado para visualização imediata."
                  : mode === "landing_page"
                  ? "Crie uma página de vendas magnética com headline de conversão comprovada, seções de problemas, depoimentos estruturados e layout limpo."
                  : "Desenvolva uma obra completa com avatar mapeado, roteiro pedagógico de capítulos detalhados e scripts de venda otimizados para infoprodutos."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: CONCEITO COMERCIAL */}
              <div className={`p-6 rounded-xl bg-black/40 border ${mode === "site" ? "border-cyan-500/10" : "border-zinc-800/50"}`}>
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold mb-4 flex items-center gap-2">
                  <Target size={14} className={mode === "site" ? "text-cyan-400" : "text-red-500"} />
                  Passo 1: Conceito e Identidade Comercial
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand Name Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">
                        {mode === "site" ? "Nome da Marca / Empresa" : mode === "landing_page" ? "Nome do Produto" : "Título do Ebook (Nome sugerido)"}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={mode === "site" ? "Exemplo: Nexus Investimentos" : mode === "landing_page" ? "Exemplo: Método Liberdade Pro" : "Exemplo: Manual do Investidor Seguro"}
                        className={`w-full px-4 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-all font-medium shadow-inner ${
                          mode === "site" ? "border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30" : "border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                        }`}
                        required
                      />
                    </div>

                    {/* Niche Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">
                        Nicho de Atuação
                      </label>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="Exemplo: Finanças, Emagrecimento, Tecnologia"
                        className={`w-full px-4 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-all font-medium shadow-inner ${
                          mode === "site" ? "border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30" : "border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Objective Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">
                        Objetivo Estratégico do Produto
                      </label>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase">Obrigatório</span>
                    </div>
                    <textarea
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder={mode === "site" ? "Exemplo: Desejo que o site apresente nossa autoridade corporativa no mercado financeiro e convença o visitante a agendar um contato direto via WhatsApp." : "Exemplo: Ensinar pessoas comuns a iniciarem sua jornada de investimentos sem correr riscos desnecessários de forma muito prática."}
                      rows={3}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-all font-medium leading-relaxed resize-none shadow-inner ${
                        mode === "site" ? "border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30" : "border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* MODE SPECIFIC CONTROLS */}
              {mode === "site" ? (
                /* SITE SPECIFIC CREATOR: HIGHLY VISUAL AND INTERACTIVE */
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* DESIGN PALETTE & CARDS */}
                  <div className="p-6 rounded-xl bg-black/40 border border-cyan-500/10 space-y-4">
                    <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                      <Compass size={14} className="text-cyan-400" />
                      Passo 2: Paleta de Cores e Identidade Visual
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: "nexus", name: "Nexus Dark Red", colors: ["bg-red-600", "bg-zinc-950"], desc: "Vermelho carbono com visual futurista e sofisticado" },
                        { id: "oceanic", name: "SaaS Oceanic Blue", colors: ["bg-blue-600", "bg-slate-950"], desc: "Azul profundo com foco em tecnologia e SaaS" },
                        { id: "amber", name: "Creative Amber", colors: ["bg-amber-500", "bg-neutral-950"], desc: "Toque caloroso, moderno e de alta atenção" },
                        { id: "slate", name: "Minimal Slate", colors: ["bg-zinc-300", "bg-white"], desc: "Design monocromático ultra-limpo e polido" }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSiteTheme(theme.id as any)}
                          className={`p-4 border rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                            siteTheme === theme.id
                              ? "border-cyan-400 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                              : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[11px] font-bold text-white leading-tight">{theme.name}</span>
                            <div className="flex gap-1">
                              {theme.colors.map((c, i) => (
                                <span key={i} className={`w-3 h-3 rounded-full ${c} border border-zinc-800`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-snug mt-2">{theme.desc}</p>
                          <div className="w-full flex justify-end">
                            {siteTheme === theme.id && <Check size={12} className="text-cyan-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SITE ARCHITECTURE LAYOUT */}
                  <div className="p-6 rounded-xl bg-black/40 border border-cyan-500/10 space-y-4">
                    <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                      <Layout size={14} className="text-cyan-400" />
                      Passo 3: Arquitetura de Layout do Portal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "tech", name: "Modern Tech Grid", desc: "Design focado em tecnologia com blocos robustos, ideal para agências, consultorias e fintechs." },
                        { id: "business", name: "Corporate Authority", desc: "Layout tradicional e altamente sério, focado em transmitir autoridade imediata." },
                        { id: "creative", name: "Creative Bold Pitch", desc: "Visual moderno com tipografia expressiva e espaçamentos diferenciados de marca." },
                        { id: "clean", name: "Ultra Minimalist", desc: "Foco absoluto no texto e nos dados fundamentais, sem elementos gráficos excessivos." }
                      ].map((lay) => (
                        <button
                          key={lay.id}
                          type="button"
                          onClick={() => setSiteLayout(lay.id as any)}
                          className={`p-4 border rounded-xl text-left transition-all cursor-pointer flex gap-3.5 items-start ${
                            siteLayout === lay.id
                              ? "border-cyan-400 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                              : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${siteLayout === lay.id ? "border-cyan-400" : "border-zinc-600"}`}>
                            {siteLayout === lay.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white mb-1">{lay.name}</p>
                            <p className="text-[11px] text-zinc-500 leading-normal">{lay.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE PAGES CHECKLIST */}
                  <div className="p-6 rounded-xl bg-black/40 border border-cyan-500/10 space-y-4">
                    <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                      <Sliders size={14} className="text-cyan-400" />
                      Passo 4: Seções & Estrutura do Menu do Site
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { id: "home", label: "Início / Hero" },
                        { id: "about", label: "Sobre Nós" },
                        { id: "features", label: "Diferenciais" },
                        { id: "faq", label: "Perguntas Freq." },
                        { id: "contact", label: "Form. Contato" }
                      ].map((p) => {
                        const isSelected = selectedPages.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                if (selectedPages.length > 1) {
                                  setSelectedPages(selectedPages.filter((x) => x !== p.id));
                                }
                              } else {
                                setSelectedPages([...selectedPages, p.id]);
                              }
                            }}
                            className={`p-3 border rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-400/10 text-white font-bold"
                                : "border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "border-cyan-400 bg-cyan-400 text-black" : "border-zinc-700"}`}>
                              {isSelected && <CheckCircle2 size={11} className="stroke-[3]" />}
                            </div>
                            <span className="text-[11px] tracking-tight">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      O motor do Nexus criará cada um dos blocos selecionados integrando-os na barra de navegação principal.
                    </p>
                  </div>

                </div>
              ) : (
                /* EBOOK & LANDING PAGE CREATOR: PUBLISHER FOCUS */
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* LITERARY SETTINGS (SLIDERS & LANGUAGE) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Page Slider */}
                    {mode === "ebook" && (
                      <div className="p-6 rounded-xl bg-black/40 border border-zinc-800/50 space-y-4">
                        <label className="text-xs font-mono uppercase text-zinc-300 font-bold flex justify-between">
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="text-red-500" />
                            Extensão Editorial Sugerida
                          </span>
                          <span className="text-red-500 font-black">{pages} páginas</span>
                        </label>
                        <div className="flex items-center gap-4 py-2">
                          <input
                            type="range"
                            min={20}
                            max={80}
                            step={5}
                            value={pages}
                            onChange={(e) => setPages(Number(e.target.value))}
                            className="flex-1 accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-full appearance-none"
                          />
                          <span className="text-[11px] font-mono text-zinc-400 font-bold w-14 text-right shrink-0">
                            ~ {Math.round(pages * 220)} pal.
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Sua obra digital será diagramada perfeitamente tanto para telas de celulares quanto para tablets e desktops.
                        </p>
                      </div>
                    )}

                    {/* Language Selection */}
                    <div className="p-6 rounded-xl bg-black/40 border border-zinc-800/50 space-y-4 flex flex-col justify-between">
                      <label className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                        <Globe size={14} className="text-red-500" />
                        Idioma do Conteúdo
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                          <Globe size={14} />
                        </span>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl text-xs text-zinc-200 focus:outline-none transition-all font-bold cursor-pointer"
                        >
                          <option value="Português">Português (Brasil)</option>
                          <option value="Espanhol">Espanhol (América Latina)</option>
                          <option value="Inglês">Inglês (EUA)</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Utiliza jargões locais e termos de alta conversão adaptados à região escolhida.
                      </p>
                    </div>
                  </div>

                  {/* EDITORIAL COVER */}
                  {mode === "ebook" && (
                    <div className="p-6 rounded-xl bg-black/40 border border-zinc-800/50 space-y-4">
                      <label className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                        <ImageIcon size={14} className="text-red-500" />
                        Capa e Identidade Editorial
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => setCoverOption(null)}
                          className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                            coverOption === null 
                              ? "border-red-500 bg-red-500/10" 
                              : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                          }`}
                        >
                          <p className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            Capa Dinâmica Premium
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-normal">O Nexus projeta um design tipográfico com gradientes profissionais adaptado ao seu nicho.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCoverOption("custom")}
                          className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                            coverOption === "custom" 
                              ? "border-red-500 bg-red-500/10" 
                              : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                          }`}
                        >
                          <p className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-zinc-600" />
                            Inserir Link de Capa Própria
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-normal">Forneça um link de imagem do Unsplash ou de outro servidor para usar como capa.</p>
                        </button>
                      </div>

                      {coverOption === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="relative pt-2"
                        >
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                            <ImageIcon size={14} />
                          </span>
                          <input
                            type="url"
                            value={customCoverUrl}
                            onChange={(e) => setCustomCoverUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600"
                            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 focus:outline-none transition-all font-medium"
                          />
                        </motion.div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* ACTION FOOTER */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-850">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    mode === "site" 
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" 
                      : "bg-red-500/10 border-red-500/30 text-red-500"
                  }`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Garantia do Algoritmo Nexus</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Consome <span className="text-zinc-300 font-bold">1 crédito corporativo</span> • Processamento Seguro</p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  id="btn-create-project"
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded-xl text-white text-xs font-bold tracking-wider uppercase cursor-pointer shadow-xl transition-all hover:translate-y-[-1px] active:scale-[0.98] ${
                    mode === "site" 
                      ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/15" 
                      : "bg-red-600 hover:bg-red-500 shadow-red-600/15"
                  }`}
                >
                  <Sparkles size={14} className="text-white animate-pulse" />
                  <span>
                    {mode === "landing_page" ? "Gerar Landing Page" : mode === "site" ? "Gerar Portal Institucional" : "Gerar Ebook & Recursos"}
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* Animated Loader Screen */
          <motion.div
            key="loader-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-900/95 border border-zinc-800 p-8 sm:p-16 text-center rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[450px] shadow-2xl"
          >
            {/* Elegant spinner with glow effect */}
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
              <div className={`absolute inset-0 rounded-full border-t-4 animate-spin ${mode === "site" ? "border-cyan-400" : "border-red-500"}`} />
              <div className="absolute inset-4 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-inner">
                <Cpu size={24} className={`animate-pulse ${mode === "site" ? "text-cyan-400" : "text-red-500"}`} />
              </div>
              <div className={`absolute -inset-1 rounded-full blur-md pointer-events-none ${mode === "site" ? "bg-cyan-400/10" : "bg-red-600/15"}`} />
            </div>

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">
              PROCESSAMENTO DA INTELIGÊNCIA ARTIFICIAL
            </span>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
              {mode === "landing_page" ? "Gerando Landing Page de Alta Conversão" : mode === "site" ? "Gerando Portal Institucional" : "Gerando Ebook & Recursos Nexus"}
            </h3>
            
            {/* Elegant scrolling loader letters */}
            <div className="min-h-[3.5rem] py-2 max-w-lg mb-8 flex items-center justify-center overflow-visible">
              <AnimatePresence mode="wait">
                <motion.p
                  key={generationStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`text-xs sm:text-sm font-mono tracking-wide font-black uppercase text-center px-4 leading-relaxed ${
                    mode === "site" ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  {generationProgressSteps[generationStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Pristine high-contrast progress bar */}
            <div className="w-72 bg-black rounded-full h-2.5 overflow-hidden border border-zinc-800 shadow-inner">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 12, ease: "linear" }}
                className={`h-full rounded-full ${
                  mode === "site" 
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                    : "bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                }`}
              />
            </div>

            <p className="text-[11px] text-zinc-500 font-mono mt-5 uppercase tracking-wider font-semibold">
              Ambiente de Geração Dedicado • Aguarde alguns instantes...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
