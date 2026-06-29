import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Globe, 
  Layers, 
  Image as ImageIcon,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
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
    "Analisando premissas de nicho e mercado potencial...",
    "Estruturando arquitetura didática de capítulos...",
    "Redigindo conteúdo real de alta conversão...",
    "Realizando inteligência de público para o módulo de avatar...",
    "Compilando layout do livro digital e indexando recursos..."
  ];

  // Start progress intervals if generating
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationStep((prev) => (prev < generationProgressSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  });

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
            className="bg-nexus-card border border-nexus-border p-5 sm:p-8 md:p-10 rounded-2xl relative shadow-2xl overflow-hidden"
          >
            {/* Top Red Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nexus-red/45 via-nexus-red to-nexus-red/45" />

            <div className="mb-8 border-b border-nexus-border pb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-nexus-red/10 border border-nexus-red/20 text-nexus-red font-mono font-bold text-[9px] uppercase mb-3.5 tracking-wider">
                <Sparkles size={11} className="animate-pulse" />
                MECANISMO DE CONVERSÃO EXCLUSIVO
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight leading-tight">
                Como você deseja ganhar dinheiro hoje?
              </h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Insira sua proposta de valor e niche de atuação. Nosso ecossistema inteligente de alta conversão estruturará todo o produto digital, funil de vendas e estratégias de captação instantaneamente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Concept Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                  Objetivo Principal ou Proposta de Valor
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Exemplo: Quero vender um Ebook que ensine como começar a investir com pouco dinheiro e atingir os primeiros R$ 10.000 em um ano de forma conservadora..."
                  rows={3}
                  className="w-full px-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-nexus-red/20 transition-all font-medium leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                    Nome sugerido para o produto
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <BookOpen size={14} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Exemplo: Método Liberdade 30D"
                      className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-nexus-red/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Niche Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                    Nicho / Categoria de Mercado
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Exemplo: Finanças Pessoais"
                    className="w-full px-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-nexus-red/20 transition-all font-medium"
                    required
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pages count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold flex justify-between">
                    <span>Quantidade de páginas sugerida</span>
                    <span className="text-nexus-red font-bold font-mono">{pages} páginas</span>
                  </label>
                  <div className="flex items-center gap-4 py-2">
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={pages}
                      onChange={(e) => setPages(Number(e.target.value))}
                      className="flex-1 accent-nexus-red cursor-pointer"
                    />
                    <span className="text-xs font-mono text-zinc-400 font-semibold w-12 text-right">
                      ~ {Math.round(pages * 220)} pal.
                    </span>
                  </div>
                </div>

                {/* Language selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                    Idioma do Conteúdo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <Globe size={14} />
                    </span>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-nexus-red/20 transition-all font-medium cursor-pointer"
                    >
                      <option value="Português">Português (Brasil)</option>
                      <option value="Espanhol">Espanhol (América Latina)</option>
                      <option value="Inglês">Inglês (EUA)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Cover Option (Optional) */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                  Capa do Ebook
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setCoverOption(null)}
                    className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                      coverOption === null 
                        ? "border-nexus-red bg-nexus-red/[0.02]" 
                        : "border-nexus-border bg-nexus-black hover:border-nexus-border/60"
                    }`}
                  >
                    <p className="text-xs font-bold text-zinc-100 mb-1">Capa Temática Exclusiva</p>
                    <p className="text-[10px] text-zinc-500">O sistema gerará uma capa temática profissional com base no nicho.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCoverOption("custom")}
                    className={`flex-1 p-4 border text-left rounded-xl transition-all cursor-pointer ${
                      coverOption === "custom" 
                        ? "border-nexus-red bg-nexus-red/[0.02]" 
                        : "border-nexus-border bg-nexus-black hover:border-nexus-border/60"
                    }`}
                  >
                    <p className="text-xs font-bold text-zinc-100 mb-1">Inserir Link da Capa</p>
                    <p className="text-[10px] text-zinc-500">Insira um link de imagem (Unsplash, etc.) para utilizar como capa.</p>
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
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-10 pr-4 py-3.5 bg-nexus-black border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-nexus-red/20 transition-all font-medium"
                    />
                  </motion.div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-nexus-border">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <ShieldCheck size={13} className="text-nexus-red" />
                  <span>Consome <strong className="text-nexus-red">1 crédito corporativo</strong> de geração</span>
                </div>
                
                <button
                  type="submit"
                  id="btn-create-project"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-4 px-8 rounded-xl bg-nexus-red hover:bg-nexus-red-hover text-white text-xs font-bold tracking-wider uppercase cursor-pointer shadow-lg shadow-nexus-red/15 hover:translate-y-[-1px] transition-all active:scale-[0.98]"
                >
                  <Sparkles size={14} className="text-white animate-pulse" />
                  <span>Iniciar Geração Completa</span>
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
            className="bg-nexus-card border border-nexus-border p-8 sm:p-12 text-center rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] shadow-sm"
          >
            {/* Elegant spinner logic */}
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-nexus-border" />
              <div className="absolute inset-0 rounded-full border-t-2 border-nexus-red animate-spin" />
              <div className="absolute inset-4 rounded-full bg-nexus-black border border-nexus-border flex items-center justify-center">
                <Sparkles size={18} className="text-nexus-red animate-pulse" />
              </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-zinc-100 mb-3 tracking-wide">
              Gerando Ecossistema Comercial Nexus
            </h3>
            
            <div className="h-6 overflow-hidden max-w-md">
              <AnimatePresence mode="wait">
                <motion.p
                  key={generationStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-nexus-red font-mono tracking-wide font-semibold"
                >
                  {generationProgressSteps[generationStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-10 w-64 bg-nexus-black rounded-full h-1.5 overflow-hidden border border-nexus-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((generationStep + 1) / generationProgressSteps.length) * 100}%` }}
                transition={{ duration: 12, ease: "linear" }}
                className="bg-nexus-red h-full rounded-full"
              />
            </div>

            <p className="text-[10px] text-zinc-500 font-mono mt-4 uppercase tracking-widest">
              Aproximadamente 15 segundos restantes
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
