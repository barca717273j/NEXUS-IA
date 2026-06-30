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
  CheckCircle2,
  Lock,
  Cpu,
  Target,
  FileText
} from "lucide-react";

interface ProjectWizardProps {
  onGenerate: (name: string, niche: string, objective: string, pages: number, language: string, coverUrl?: string) => void;
  isGenerating: boolean;
}

export default function ProjectWizard({ onGenerate, isGenerating }: ProjectWizardProps) {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [objective, setObjective] = useState("");
  const [pages, setPages] = useState(45);
  const [language, setLanguage] = useState("Português");
  const [coverOption, setCoverOption] = useState<string | null>(null);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  
  // Loading status steps shown during actual generation
  const [generationStep, setGenerationStep] = useState(0);

  const generationProgressSteps = [
    "analisando premissas e nicho de mercado digital...",
    "mapeando comportamento de compra e público-alvo de alto padrão...",
    "estruturando roteiro pedagógico e capítulos autorais de alta conversão...",
    "redigindo conteúdo real, copys persuasivas e ofertas exclusivas...",
    "compilando design editorial, diagramação e finalizando produto premium..."
  ];

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
  }, [isGenerating]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !niche || !objective) return;
    onGenerate(name, niche, objective, pages, language, coverOption === "custom" ? customCoverUrl : undefined);
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
            className="bg-zinc-900/95 border border-zinc-800/80 p-6 sm:p-10 md:p-12 rounded-2xl relative shadow-2xl overflow-hidden"
          >
            {/* Top Premium Red Laser Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            {/* Soft background glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/[0.03] rounded-full blur-3xl pointer-events-none" />

            {/* Header section with high trust indicators */}
            <div className="mb-10 border-b border-zinc-800/60 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono font-black text-[9px] uppercase tracking-wider">
                  <Cpu size={11} className="animate-pulse text-red-500" />
                  SISTEMA DE ENGENHARIA DIGITAL NEXUS
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono">
                  <Lock size={12} className="text-emerald-500" />
                  <span>AMBIENTE CRIPTOGRAFADO & SEGURO</span>
                </div>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Estruturar Nova Operação de Alta Conversão
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed max-w-3xl">
                Nossa inteligência avançada mapeia o mercado, desenha o avatar ideal, constrói a estrutura pedagógica completa de capítulos do seu livro e gera scripts de copy validados. Preencha as premissas abaixo para iniciar com segurança.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Product Concept Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-2">
                    <Target size={12} className="text-red-500" />
                    Objetivo Comercial & Proposta de Valor do Produto
                  </label>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">Obrigatório</span>
                </div>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Seja descritivo. Exemplo: Quero criar um ebook focado em jovens de 20 a 30 anos para ensiná-los a investir os primeiros R$ 10.000 em renda fixa de forma simples, garantindo a construção de uma reserva de emergência consistente em 12 meses."
                  rows={4}
                  className="w-full px-4.5 py-4 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium leading-relaxed resize-none shadow-inner"
                  required
                />
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Dica: Quanto mais detalhes sobre a transformação final do seu cliente você fornecer, mais precisa será a copy de conversão e a estruturação didática do livro.
                </p>
              </div>

              {/* Product Details Section (Split) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Name Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-2">
                    <BookOpen size={12} className="text-red-500" />
                    Título do Ebook (Nome sugerido)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                      <BookOpen size={14} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Exemplo: Manual da Riqueza Conservadora"
                      className="w-full pl-11 pr-4 py-3.5 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Niche Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-2">
                    <Layers size={12} className="text-red-500" />
                    Nicho de Atuação
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Exemplo: Finanças Pessoais"
                    className="w-full px-4.5 py-3.5 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-medium shadow-inner"
                    required
                  />
                </div>

              </div>

              {/* Advanced Parameters Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Suggested Pages Slider */}
                <div className="space-y-3 bg-black/40 border border-zinc-800/60 p-5 rounded-xl">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex justify-between">
                    <span className="flex items-center gap-2">
                      <FileText size={12} className="text-red-500" />
                      Extensão sugerida
                    </span>
                    <span className="text-red-500 font-black font-mono">{pages} páginas</span>
                  </label>
                  <div className="flex items-center gap-4 py-1.5">
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={pages}
                      onChange={(e) => setPages(Number(e.target.value))}
                      className="flex-1 accent-red-600 cursor-pointer h-1 bg-zinc-800 rounded-full appearance-none"
                    />
                    <span className="text-[11px] font-mono text-zinc-400 font-bold w-12 text-right shrink-0">
                      ~ {Math.round(pages * 220)} pal.
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    Diagramação fluida ajustada para leitura no desktop e celular.
                  </p>
                </div>

                {/* Language selection */}
                <div className="space-y-3 bg-black/40 border border-zinc-800/60 p-5 rounded-xl flex flex-col justify-between">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-2">
                    <Globe size={12} className="text-red-500" />
                    Idioma do Conteúdo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <Globe size={14} />
                    </span>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-bold cursor-pointer"
                    >
                      <option value="Português">Português (Brasil)</option>
                      <option value="Espanhol">Espanhol (América Latina)</option>
                      <option value="Inglês">Inglês (EUA)</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    Expressões de copy localizadas para maximizar conversão regional.
                  </p>
                </div>

              </div>

              {/* Cover Design Settings */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold flex items-center gap-2">
                  <ImageIcon size={12} className="text-red-500" />
                  Visual da Capa Editorial
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setCoverOption(null)}
                    className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                      coverOption === null 
                        ? "border-red-500 bg-red-500/[0.03]" 
                        : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                    }`}
                  >
                    <p className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Capa Temática Integrada
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-normal">Nosso designer digital definirá um visual profissional adaptado ao seu nicho.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCoverOption("custom")}
                    className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                      coverOption === "custom" 
                        ? "border-red-500 bg-red-500/[0.03]" 
                        : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                    }`}
                  >
                    <p className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      Inserir Capa Própria (Link)
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-normal">Forneça uma URL direta de imagem (Unsplash, Imgur, etc.) para aplicar.</p>
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
                      className="w-full pl-10 pr-4 py-3 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                    />
                  </motion.div>
                )}
              </div>

              {/* Submit Section with Absolute Trust and Safety Signals */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Garantia de Qualidade Nexus</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Consome <span className="text-red-500 font-black">1 crédito corporativo</span> • Acesso Vitalício Garantido</p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  id="btn-create-project"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider uppercase cursor-pointer shadow-xl shadow-red-600/15 hover:translate-y-[-1px] transition-all active:scale-[0.98]"
                >
                  <Sparkles size={14} className="text-white animate-pulse" />
                  <span>Gerar Ecossistema Comercial</span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* Animated Loader Screen with Perfect Spacing and Legible Texts */
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
              <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
              <div className="absolute inset-4 rounded-full bg-black border border-zinc-800 flex items-center justify-center shadow-inner">
                <Cpu size={24} className="text-red-500 animate-pulse" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-red-600/[0.05] blur-md pointer-events-none" />
            </div>

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">
              PROCESSAMENTO EM ANDAMENTO
            </span>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
              Gerando Ecossistema Comercial Nexus
            </h3>
            
            {/* Elegant scrolling loader letters */}
            <div className="h-8 overflow-hidden max-w-lg mb-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={generationStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-sm text-red-500 font-mono tracking-wide font-black uppercase text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]"
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
                className="bg-gradient-to-r from-red-700 to-red-500 h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
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
