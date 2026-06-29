import { useState, useEffect, FormEvent } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCards from "./components/MetricCards";
import SalesChart from "./components/SalesChart";
import ProjectWizard from "./components/ProjectWizard";
import ProjectTabs from "./components/ProjectTabs";
import Auth from "./components/Auth";
import { Project, Sale, UserStats } from "./types";
import { SEED_PROJECTS, generateProject } from "./data/templates";
import { 
  Sparkles, 
  Briefcase, 
  ChevronRight, 
  Plus, 
  Trash2, 
  RotateCcw,
  BookOpen, 
  Coins, 
  Info,
  Layers,
  ArrowRight,
  LayoutGrid,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication State
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Projects list
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("nexus_projects");
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  // Active Project ID
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const saved = localStorage.getItem("nexus_selected_project_id");
    if (saved) return saved;
    return SEED_PROJECTS[0]?.id || "";
  });

  // UI States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isActualMobile, setIsActualMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsActualMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileView = viewMode === "mobile" || isActualMobile;

  // Auto-collapse sidebar when switching to mobile view
  useEffect(() => {
    if (isMobileView) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobileView]);

  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem("nexus_credits");
    return saved ? Number(saved) : 94;
  });
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    const saved = localStorage.getItem("nexus_monthly_goal");
    return saved ? Number(saved) : 5000;
  });

  // Sales-ledger specific state (to select which product to register a sale for)
  const [ledgerSelectedProjectId, setLedgerSelectedProjectId] = useState<string>("");
  const [ledgerSaleValue, setLedgerSaleValue] = useState("");
  const [ledgerSaleDate, setLedgerSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [ledgerSaleNote, setLedgerSaleNote] = useState("");
  const [ledgerSuccess, setLedgerSuccess] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("nexus_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nexus_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("nexus_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("nexus_selected_project_id", selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    localStorage.setItem("nexus_credits", String(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem("nexus_monthly_goal", String(monthlyGoal));
  }, [monthlyGoal]);

  // Set default ledger selection
  useEffect(() => {
    if (projects.length > 0 && !ledgerSelectedProjectId) {
      setLedgerSelectedProjectId(projects[0].id);
    }
  }, [projects, ledgerSelectedProjectId]);

  // Handle Authentication Success
  const handleAuthSuccess = (name: string, email: string) => {
    setUser({ name, email });
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
  };

  // Get active project
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Global sales calculations
  const allSales = projects.reduce((acc, proj) => {
    return [...acc, ...proj.sales];
  }, [] as Sale[]);

  const totalRevenue = allSales.reduce((sum, s) => sum + s.value, 0);

  // Create project flow
  const handleCreateProject = (
    name: string,
    niche: string,
    objective: string,
    pages: number,
    language: string,
    coverUrl?: string
  ) => {
    setIsGenerating(true);

    // Simulate creation delays
    setTimeout(() => {
      const newProj = generateProject(name, niche, objective, pages, language, coverUrl);
      setProjects(prev => [newProj, ...prev]);
      setSelectedProjectId(newProj.id);
      setCredits(prev => Math.max(0, prev - 1));
      setIsGenerating(false);
      setActiveTab("library");
    }, 12000); // 12s high-end simulation
  };

  // Register sale inside project
  const handleRegisterSale = (saleData: Omit<Sale, "id">) => {
    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 11),
      ...saleData
    };

    setProjects(prev => {
      return prev.map(proj => {
        if (proj.id === selectedProjectId) {
          const updatedSales = [newSale, ...proj.sales];
          // Auto complete firstSaleRegistered milestone
          const updatedMilestones = {
            ...proj.milestones,
            firstSaleRegistered: true
          };
          return {
            ...proj,
            sales: updatedSales,
            milestones: updatedMilestones
          };
        }
        return proj;
      });
    });
  };

  // Delete sale inside project
  const handleDeleteSale = (saleId: string) => {
    setProjects(prev => {
      return prev.map(proj => {
        if (proj.id === selectedProjectId) {
          const updatedSales = proj.sales.filter(s => s.id !== saleId);
          return {
            ...proj,
            sales: updatedSales
          };
        }
        return proj;
      });
    });
  };

  // Register direct ledger sale for any project
  const handleLedgerSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = parseFloat(ledgerSaleValue);
    if (isNaN(val) || val <= 0 || !ledgerSelectedProjectId) return;

    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 11),
      value: val,
      date: ledgerSaleDate,
      note: ledgerSaleNote.trim() || undefined
    };

    setProjects(prev => {
      return prev.map(proj => {
        if (proj.id === ledgerSelectedProjectId) {
          const updatedSales = [newSale, ...proj.sales];
          const updatedMilestones = {
            ...proj.milestones,
            firstSaleRegistered: true
          };
          return {
            ...proj,
            sales: updatedSales,
            milestones: updatedMilestones
          };
        }
        return proj;
      });
    });

    setLedgerSaleValue("");
    setLedgerSaleNote("");
    setLedgerSuccess(true);
    setTimeout(() => setLedgerSuccess(false), 3000);
  };

  // Update milestones checklist
  const handleUpdateMilestones = (updatedMilestones: Project["milestones"]) => {
    setProjects(prev => {
      return prev.map(proj => {
        if (proj.id === selectedProjectId) {
          return {
            ...proj,
            milestones: updatedMilestones
          };
        }
        return proj;
      });
    });
  };

  // Reset all local storage data back to seeds
  const handleResetData = () => {
    if (window.confirm("Deseja realmente redefinir todos os dados da plataforma? Isso excluirá seus projetos personalizados.")) {
      setProjects(SEED_PROJECTS);
      setSelectedProjectId(SEED_PROJECTS[0].id);
      setCredits(94);
      setMonthlyGoal(5000);
      localStorage.clear();
      alert("Plataforma redefinida com sucesso!");
    }
  };

  // If user is not logged in, render the Auth Guard screen
  if (!user) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  const renderWorkspace = () => {
    return (
      <div className="flex-1 flex flex-row relative w-full h-full min-h-screen overflow-x-hidden">
        {/* Semi-transparent Backdrop for Mobile Drawer */}
        {isMobileView && !sidebarCollapsed && (
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs z-35 cursor-pointer"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Floating Trigger Button for Mobile/Drawer Mode */}
        {isMobileView && sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            id="btn-mobile-dots-trigger"
            className="absolute left-4 top-[95px] z-40 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-nexus-red to-rose-600 text-white cursor-pointer shadow-lg shadow-nexus-red/20 border border-nexus-red/30 transition-all hover:scale-105 active:scale-95 group"
            title="Abrir Menu"
          >
            <LayoutGrid size={18} className="text-white group-hover:rotate-12 transition-transform" />
          </button>
        )}

        {/* Dynamic Sidebar navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (isMobileView) {
              setSidebarCollapsed(true);
            }
          }} 
          onLogout={handleLogout} 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          hasActiveProject={projects.length > 0}
          userName={user.name}
          isMobileView={isMobileView}
        />

        {/* Main content wrapper */}
        <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen overflow-x-hidden max-w-full ${
          isMobileView 
            ? "pl-0" 
            : (sidebarCollapsed ? "pl-20" : "pl-0 md:pl-[260px]")
        }`}>
          
          {/* Header toolbar */}
          <Header 
            credits={credits} 
            userName={user.name} 
            userEmail={user.email}
            onOpenSettings={() => setActiveTab("settings")}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

        {/* Scrollable sub-views stage */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: DASHBOARD MAIN OVERVIEW */}
            {activeTab === "dashboard" && (
              <motion.div
                key="tab-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Main Action Field - Positioned at the very top for better user flow */}
                <div className="bg-gradient-to-br from-nexus-card to-nexus-black border border-nexus-red/30 p-8 rounded-2xl relative overflow-hidden shadow-xl shadow-nexus-red/[0.02]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-red/[0.03] rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-nexus-red/50 to-transparent" />
                  
                  <div className="max-w-2xl relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-red/10 border border-nexus-red/20 text-[10px] text-nexus-red font-bold font-mono uppercase tracking-widest rounded-full mb-4">
                      <Sparkles size={11} className="animate-pulse" />
                      Mecanismo de Escala Comercial 2.0
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight mb-3">
                      Como você deseja ganhar dinheiro hoje?
                    </h2>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">
                      O ecossistema inteligente Nexus guiará você desde a validação do avatar e do nicho até a geração completa de copys de alta conversão, canais de vendas direta no 1x1 e o faturamento garantido.
                    </p>

                    <button
                      onClick={() => setActiveTab("new-project")}
                      id="dashboard-cta-create-project"
                      className="inline-flex items-center gap-2.5 py-4 px-6 rounded-xl bg-nexus-red hover:bg-nexus-red-hover text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-nexus-red/20 cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                    >
                      <Plus size={15} className="stroke-[3]" />
                      <span>Desenvolver Novo Projeto Digital</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Statistics panel - Positioned below the action call to support the flow */}
                <MetricCards 
                  totalEbooks={projects.length}
                  activeProjects={projects.filter(p => !p.milestones.firstSaleRegistered).length}
                  totalSalesCount={allSales.length}
                  totalRevenue={totalRevenue}
                  monthlyGoal={monthlyGoal}
                />

                {/* Split layout: Chart & Meus Projetos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Recharts Evolution Graph */}
                  <div className="lg:col-span-8">
                    <SalesChart sales={allSales} />
                  </div>

                  {/* Right Column: Project selector and direct links */}
                  <div className="lg:col-span-4 bg-nexus-black border border-nexus-border p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold mb-4 flex items-center gap-2">
                        <Layers size={14} className="text-nexus-red" />
                        Meus Projetos Ativos ({projects.length})
                      </h4>

                      <div className="space-y-3 max-h-[220px] overflow-y-auto">
                        {projects.map((proj) => {
                          const isActive = proj.id === selectedProjectId;
                          const projectRevenue = proj.sales.reduce((sum, s) => sum + s.value, 0);
                          return (
                            <button
                              key={proj.id}
                              onClick={() => {
                                setSelectedProjectId(proj.id);
                                setActiveTab("library");
                              }}
                              className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                isActive 
                                  ? "border-nexus-red bg-nexus-red/[0.02]" 
                                  : "border-nexus-border bg-nexus-black/40 hover:border-nexus-border/60"
                              }`}
                            >
                              <div className="truncate flex-1">
                                <p className="text-xs font-bold text-zinc-200 truncate">{proj.ebook.title}</p>
                                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{proj.niche}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-mono font-bold text-nexus-red">R$ {projectRevenue.toLocaleString()}</p>
                                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{proj.sales.length} vendas</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-nexus-border/60 mt-4">
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        Dica Nexus: Clique em qualquer produto acima para acessar sua biblioteca de recursos de conversão e registrar vendas.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 2: NEW PROJECT GENERATOR WIZARD */}
            {activeTab === "new-project" && (
              <motion.div
                key="tab-new-project"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProjectWizard 
                  onGenerate={handleCreateProject} 
                  isGenerating={isGenerating} 
                />
              </motion.div>
            )}

            {/* VIEW 3: ACTIVE PROJECT RESOURCE LIBRARY */}
            {activeTab === "library" && (
              <motion.div
                key="tab-library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeProject ? (
                  <ProjectTabs 
                    project={activeProject} 
                    onUpdateMilestones={handleUpdateMilestones}
                    onRegisterSale={handleRegisterSale}
                    onDeleteSale={handleDeleteSale}
                  />
                ) : (
                  <div className="text-center py-16 bg-nexus-black border border-nexus-border rounded-2xl">
                    <Briefcase size={36} className="text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-zinc-300">Nenhum projeto ativo</h3>
                    <p className="text-xs text-zinc-500 mt-1">Crie um novo projeto digital para acessar a biblioteca de recursos.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 4: DIRECT SALES LEDGER PANEL */}
            {activeTab === "sales-ledger" && (
              <motion.div
                key="tab-sales-ledger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="p-6 bg-nexus-black border border-nexus-border rounded-2xl shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold flex items-center gap-2">
                      <Coins size={15} className="text-nexus-red" />
                      Lançamento Unificado de Vendas
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Lance as vendas de qualquer projeto de forma manual para consolidar faturamento e gráficos de evolução.
                    </p>
                  </div>

                  {ledgerSuccess && (
                    <div className="mb-4 p-3 bg-green-950/40 border border-green-800/60 rounded-xl text-green-400 text-xs text-center font-medium">
                      Lançamento de venda processado com sucesso!
                    </div>
                  )}

                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-zinc-500 font-medium">Você precisa possuir ao menos um projeto ativo para registrar vendas.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleLedgerSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Selecionar Produto / Projeto</label>
                        <select
                          value={ledgerSelectedProjectId}
                          onChange={(e) => setLedgerSelectedProjectId(e.target.value)}
                          className="w-full px-4 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 focus:outline-none transition-all font-medium cursor-pointer"
                        >
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.ebook.title} ({p.niche})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Valor da Transação (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={ledgerSaleValue}
                            onChange={(e) => setLedgerSaleValue(e.target.value)}
                            placeholder="Ex: 97.00"
                            className="w-full px-4 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Data da Venda</label>
                          <input
                            type="date"
                            value={ledgerSaleDate}
                            onChange={(e) => setLedgerSaleDate(e.target.value)}
                            className="w-full px-4 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 focus:outline-none transition-all font-medium"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">Canal de Origem / Observação</label>
                        <input
                          type="text"
                          value={ledgerSaleNote}
                          onChange={(e) => setLedgerSaleNote(e.target.value)}
                          placeholder="Exemplo: Conversão no 1 a 1 via Reddit"
                          className="w-full px-4 py-3 bg-nexus-card border border-nexus-border focus:border-nexus-red rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-nexus-red hover:bg-nexus-red-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-nexus-red/5 cursor-pointer transition-all hover:translate-y-[-1px]"
                      >
                        <Plus size={14} />
                        <span>Processar Lançamento de Venda</span>
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 5: CONFIGURAÇÕES E CREDENCIAIS */}
            {activeTab === "settings" && (
              <motion.div
                key="tab-settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                {/* Platform settings */}
                <div className="bg-nexus-black border border-nexus-border p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold mb-4">
                    Configurações Gerais de Operação
                  </h3>

                  <div className="space-y-4">
                    {/* Goal change slider */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold flex justify-between">
                        <span>Meta Mensal de Vendas</span>
                        <span className="text-nexus-red font-bold">R$ {monthlyGoal.toLocaleString()}</span>
                      </label>
                      <input
                        type="range"
                        min={1000}
                        max={30000}
                        step={1000}
                        value={monthlyGoal}
                        onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                        className="w-full accent-nexus-red cursor-pointer"
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-zinc-500 font-medium">
                        A alteração da meta mensal atualiza em tempo real o indicador de progresso disponível no painel estatístico do Dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account info */}
                <div className="bg-nexus-black border border-nexus-border p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold mb-4">
                    Perfil Profissional & Licença
                  </h3>

                  <div className="space-y-3 font-medium text-xs text-zinc-300">
                    <div className="flex justify-between py-1.5 border-b border-nexus-border">
                      <span className="text-zinc-500">Operador:</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-nexus-border">
                      <span className="text-zinc-500">Endereço de E-mail:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-nexus-border">
                      <span className="text-zinc-500">Nível da Conta:</span>
                      <span className="text-nexus-red font-semibold font-mono uppercase text-[10px] tracking-wider">Corporate Premium</span>
                    </div>
                  </div>
                </div>

                {/* Safety data reset */}
                <div className="bg-red-950/10 border border-red-900/30 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-mono uppercase text-red-400 font-bold mb-2">
                    Zona Vermelha de Segurança
                  </h3>
                  <p className="text-[11px] text-zinc-500 mb-4 leading-normal">
                    Redefinir os dados da plataforma removerá as informações mantidas no navegador (LocalStorage) e restaurará as campanhas seeded de teste padrão.
                  </p>

                  <button
                    onClick={handleResetData}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 border border-red-800/40 hover:bg-red-900/20 text-red-400 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Redefinir Todos os Dados</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
    );
  };

  if (viewMode === "mobile" && !isActualMobile) {
    return (
      <div className="min-h-screen bg-[#030304] flex flex-col items-center justify-center font-sans antialiased select-none relative">
        {/* Flat Pinned Viewport Container */}
        <div className="w-[385px] h-screen border-x border-nexus-border bg-nexus-black flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 inset-x-0 h-1 bg-nexus-red z-50" />
          
          {/* Mobile indicator header inside the frame */}
          <div className="bg-nexus-dark px-5 py-3 border-b border-nexus-border flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0 select-none">
            <div className="flex items-center gap-1.5 font-bold text-nexus-red">
              <span className="w-1.5 h-1.5 rounded-full bg-nexus-red animate-pulse" />
              NEXUS SIMULADOR MOBILE
            </div>
            <div className="text-zinc-600">385 x FULL HEIGHT</div>
          </div>
          
          {/* Actual content inside the viewport */}
          <div className="flex-1 h-full flex flex-col overflow-y-auto overflow-x-hidden relative" id="mobile-viewport-inner">
            {renderWorkspace()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-black text-zinc-100 flex font-sans select-none antialiased">
      {renderWorkspace()}
    </div>
  );
}
