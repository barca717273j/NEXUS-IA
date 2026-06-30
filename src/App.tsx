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
import { supabase, isSupabaseConfigured } from "./supabaseClient";
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
  Menu,
  ShieldCheck,
  Lock,
  Calendar,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication State
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    if (isSupabaseConfigured) {
      // For Supabase, start as null and let the useEffect load the actual active session from Supabase.
      // This prevents using mock credentials or stale local sessions from localStorage.
      return null;
    }
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Supabase states
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseSyncError, setSupabaseSyncError] = useState<string | null>(null);
  const [supabaseTableCreated, setSupabaseTableCreated] = useState<boolean | null>(null);

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
  const [isActualMobile, setIsActualMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsActualMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileView = isActualMobile;

  // Auto-collapse sidebar when switching to mobile view
  useEffect(() => {
    if (isMobileView) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobileView]);

  // Scroll to top of the page when activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeTab]);

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

  // Listen for Supabase auth state changes to synchronize user state
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const name = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuário";
        setUser({ name, email: session.user.email || "" });
      } else {
        setUser(null);
        localStorage.removeItem("nexus_user");
        localStorage.removeItem("nexus_projects");
        localStorage.removeItem("nexus_selected_project_id");
        localStorage.removeItem("nexus_credits");
        localStorage.removeItem("nexus_monthly_goal");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuário";
        setUser({ name, email: session.user.email || "" });
      } else {
        setUser(null);
        // Clear all user-specific local storage on sign out
        localStorage.removeItem("nexus_user");
        localStorage.removeItem("nexus_projects");
        localStorage.removeItem("nexus_selected_project_id");
        localStorage.removeItem("nexus_credits");
        localStorage.removeItem("nexus_monthly_goal");
        setProjects(SEED_PROJECTS);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load projects from Supabase
  useEffect(() => {
    async function loadSupabaseProjects() {
      if (!isSupabaseConfigured || !user) return;
      setSupabaseLoading(true);
      setSupabaseSyncError(null);

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData || !authData.user) {
          console.warn("Nenhum usuário ativo no Supabase ou erro ao verificar sessão:", authError);
          return;
        }
        const supabaseUser = authData.user;

        const { data, error } = await supabase
          .from("nexus_projects")
          .select("*")
          .eq("user_id", supabaseUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          if (error.code === "PGRST116" || error.code === "42P01") {
            console.warn("Table nexus_projects does not exist yet.");
            setSupabaseTableCreated(false);
            setSupabaseSyncError("Tabela 'nexus_projects' não encontrada no banco. Siga as instruções em Ajustes para rodar o script SQL.");
          } else {
            throw error;
          }
        } else {
          setSupabaseTableCreated(true);
          if (data && data.length > 0) {
            const fetchedProjects = data.map(row => ({
              id: row.id,
              name: row.name,
              niche: row.niche,
              objective: row.objective,
              ...row.data
            }));
            
            setProjects(fetchedProjects);
            if (!fetchedProjects.some(p => p.id === selectedProjectId)) {
              setSelectedProjectId(fetchedProjects[0].id);
            }
          }
        }
      } catch (err: any) {
        console.warn("Erro ao carregar projetos do Supabase:", err);
        setSupabaseTableCreated(false);
        setSupabaseSyncError("Não foi possível sincronizar com o Supabase. Usando cópia local offline.");
      } finally {
        setSupabaseLoading(false);
      }
    }

    loadSupabaseProjects();
  }, [user]);

  // Sync projects automatically when projects state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !user || supabaseTableCreated === false) return;

    const syncAll = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData || !authData.user) return;
        const supabaseUser = authData.user;

        for (const proj of projects) {
          const { error } = await supabase
            .from("nexus_projects")
            .upsert({
              id: proj.id,
              user_id: supabaseUser.id,
              name: proj.name,
              niche: proj.niche,
              objective: proj.objective,
              data: {
                pages: proj.pages,
                language: proj.language,
                coverUrl: proj.coverUrl,
                createdAt: proj.createdAt,
                ebook: proj.ebook,
                research: proj.research,
                x1: proj.x1,
                milestones: proj.milestones,
                sales: proj.sales
              }
            });
          
          if (error) {
            if (error.code === "PGRST116" || error.code === "42P01") {
              setSupabaseTableCreated(false);
              setSupabaseSyncError("Tabela 'nexus_projects' não encontrada no banco. Siga as instruções em Ajustes para rodar o script SQL.");
              break;
            } else {
              console.warn("Erro ao sincronizar projeto com Supabase:", error.message);
            }
          }
        }
      } catch (err) {
        console.warn("Erro na sincronização automática com Supabase:", err);
      }
    };

    const timer = setTimeout(syncAll, 1000);
    return () => clearTimeout(timer);
  }, [projects, user, supabaseTableCreated]);

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
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
  };

  // Get active project
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Global sales calculations
  const allSales = projects.reduce((acc, proj) => {
    return [...acc, ...proj.sales];
  }, [] as Sale[]);

  const totalRevenue = allSales.reduce((sum, s) => sum + s.value, 0);

  // Create project flow
  const handleCreateProject = async (
    name: string,
    niche: string,
    objective: string,
    pages: number,
    language: string,
    coverUrl?: string,
    projType: "ebook" | "landing_page" | "site" = "ebook"
  ) => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, niche, objective, pages, language, type: projType })
      });

      const resData = await response.json();

      if (resData && resData.data) {
        const { ebook, research, x1, landingPage, site } = resData.data;

        // Derive cover image depending on niche if not custom provided
        let resolvedCoverUrl = coverUrl;
        if (!resolvedCoverUrl) {
          const nicheLower = niche.toLowerCase();
          resolvedCoverUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800";
          if (nicheLower.includes("emagrecer") || nicheLower.includes("saúde") || nicheLower.includes("nutri") || nicheLower.includes("fit") || nicheLower.includes("dieta")) {
            resolvedCoverUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800";
          } else if (nicheLower.includes("dinheiro") || nicheLower.includes("finança") || nicheLower.includes("venda") || nicheLower.includes("invest") || nicheLower.includes("rico") || nicheLower.includes("negócio")) {
            resolvedCoverUrl = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800";
          } else if (nicheLower.includes("marketing") || nicheLower.includes("digital") || nicheLower.includes("tráfego") || nicheLower.includes("vendedor") || nicheLower.includes("copy")) {
            resolvedCoverUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
          } else if (nicheLower.includes("program") || nicheLower.includes("código") || nicheLower.includes("tech") || nicheLower.includes("web") || nicheLower.includes("software")) {
            resolvedCoverUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";
          } else if (nicheLower.includes("mental") || nicheLower.includes("mindset") || nicheLower.includes("produti") || nicheLower.includes("foco") || nicheLower.includes("tempo")) {
            resolvedCoverUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800";
          }
        }

        const newProj: Project = {
          id: resData.data.id || Math.random().toString(36).substring(2, 11),
          type: projType,
          name: name.trim(),
          niche: niche.trim(),
          objective: objective.trim(),
          pages,
          language,
          coverUrl: resolvedCoverUrl,
          createdAt: new Date().toLocaleDateString("pt-BR"),
          ebook,
          research,
          landingPage,
          site,
          x1,
          milestones: {
            ebookCreated: projType === "ebook",
            researchCompleted: true,
            messagesReady: true,
            communitiesAnalyzed: true,
            firstPromoDone: false,
            firstSaleRegistered: false
          },
          sales: []
        };

        setProjects(prev => [newProj, ...prev]);
        setSelectedProjectId(newProj.id);
        setCredits(prev => Math.max(0, prev - 1));
        
        // Redirect to the appropriate library category list
        if (projType === "landing_page") {
          setActiveTab("landing_pages");
        } else if (projType === "site") {
          setActiveTab("sites");
        } else {
          setActiveTab("ebooks");
        }
      } else {
        throw new Error("Formato de resposta inválido do servidor.");
      }
    } catch (error) {
      console.warn("Erro ao gerar projeto via API, usando fallback premium local:", error);
      const fallbackProj = generateProject(name, niche, objective, pages, language, coverUrl, projType);
      setProjects(prev => [fallbackProj, ...prev]);
      setSelectedProjectId(fallbackProj.id);
      setCredits(prev => Math.max(0, prev - 1));
      
      if (projType === "landing_page") {
        setActiveTab("landing_pages");
      } else if (projType === "site") {
        setActiveTab("sites");
      } else {
        setActiveTab("ebooks");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
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
            : (sidebarCollapsed ? "pl-[112px]" : "pl-0 md:pl-[292px]")
        }`}>
          
          {/* Header toolbar */}
          <Header 
            credits={credits} 
            userName={user.name} 
            userEmail={user.email}
            onOpenSettings={() => setActiveTab("settings")}
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
                {/* Statistics panel - Positioned at the very top as requested */}
                <MetricCards 
                  totalEbooks={projects.length}
                  activeProjects={projects.filter(p => !p.milestones.firstSaleRegistered).length}
                  totalSalesCount={allSales.length}
                  totalRevenue={totalRevenue}
                  monthlyGoal={monthlyGoal}
                />

                {/* Main Action Field - Positioned below statistics for better user flow */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
                  {/* Top Accent line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  
                  {/* Subtle visual background elements */}
                  <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-500 font-mono font-black uppercase tracking-wider rounded-lg">
                          <Sparkles size={11} className="animate-pulse" />
                          Mecanismo de Escala Comercial 2.0
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider bg-zinc-800/45 px-2.5 py-1 rounded-lg">
                          <Lock size={10} className="text-emerald-500" />
                          Ambiente Criptografado & Verificado
                        </span>
                      </div>
                      
                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                        Como você deseja ganhar dinheiro hoje?
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-medium">
                        O ecossistema Nexus guiará você passo-a-passo: desde o mapeamento de avatar e nicho de mercado até a estruturação completa do produto digital, com copys de alta conversão, canais de vendas X1 e faturamento.
                      </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto space-y-3">
                      <button
                        onClick={() => setActiveTab("new-project")}
                        id="dashboard-cta-create-project"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider uppercase shadow-xl shadow-red-600/15 cursor-pointer transition-all hover:translate-y-[-1px] active:scale-[0.98]"
                      >
                        <Plus size={15} className="stroke-[3]" />
                        <span>Desenvolver Novo Projeto Digital</span>
                        <ChevronRight size={15} />
                      </button>
                      <p className="text-[9px] text-zinc-500 font-mono text-center md:text-left max-w-[280px] leading-relaxed mx-auto">
                        * Processamento seguro sob algoritmos proprietários certificados. Proteção integral de dados comerciais.
                      </p>
                    </div>
                  </div>
                </div>

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
                    onUpdateProject={handleUpdateProject}
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
                <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.01] rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="mb-6 border-b border-zinc-900 pb-4">
                    <h3 className="text-sm font-mono uppercase text-red-500 font-bold flex items-center gap-2 tracking-widest">
                      <Coins size={15} className="text-red-500 animate-pulse" />
                      Lançamento Unificado de Vendas
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Lance as vendas de qualquer projeto de forma manual para consolidar seu faturamento global e atualizar os gráficos de evolução.
                    </p>
                  </div>

                  {ledgerSuccess && (
                    <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs text-center font-bold font-mono">
                      ✓ Lançamento de venda processado com sucesso!
                    </div>
                  )}

                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-zinc-500 font-medium">Você precisa possuir ao menos um projeto ativo para registrar vendas.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleLedgerSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Selecionar Produto / Projeto</label>
                        <select
                          value={ledgerSelectedProjectId}
                          onChange={(e) => setLedgerSelectedProjectId(e.target.value)}
                          className="w-full px-4.5 py-3.5 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-200 focus:outline-none transition-all font-bold cursor-pointer shadow-inner"
                        >
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.ebook.title} ({p.niche})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Valor da Transação (BRL)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center text-zinc-500 font-mono font-bold text-xs">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={ledgerSaleValue}
                              onChange={(e) => setLedgerSaleValue(e.target.value)}
                              placeholder="0,00"
                              className="w-full pl-11 pr-4 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-black font-mono shadow-inner"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Data da Venda</label>
                          <div className="relative w-full min-w-0 overflow-hidden">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                              <Calendar size={14} />
                            </span>
                            <input
                              type="date"
                              value={ledgerSaleDate}
                              onChange={(e) => setLedgerSaleDate(e.target.value)}
                              className="w-full min-w-0 pl-11 pr-3 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all font-bold font-mono cursor-pointer shadow-inner block appearance-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">Canal de Origem / Observação</label>
                        <input
                          type="text"
                          value={ledgerSaleNote}
                          onChange={(e) => setLedgerSaleNote(e.target.value)}
                          placeholder="Exemplo: Conversão no 1 a 1 via Reddit"
                          className="w-full px-4.5 py-3.5 h-12 bg-black/60 border border-zinc-800 focus:border-red-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-all font-medium shadow-inner"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2.5 py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/10 cursor-pointer transition-all hover:translate-y-[-1px] active:scale-[0.98]"
                      >
                        <Plus size={14} className="stroke-[3]" />
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

                {/* Supabase Status & Query card */}
                <div className="bg-nexus-black border border-nexus-border p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Database size={16} className={isSupabaseConfigured ? "text-emerald-400" : "text-amber-400"} />
                    <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold">
                      Integração & Persistência Supabase
                    </h3>
                  </div>

                  <div className="text-xs space-y-3 leading-relaxed">
                    <p className="text-zinc-400">
                      O Nexus suporta persistência robusta em nuvem em tempo real usando o <strong className="text-white">Supabase</strong>. Toda vez que você criar campanhas, atualizar capítulos, registrar vendas ou marcar metas, os dados serão salvos com segurança na sua própria instância SQL.
                    </p>

                    <div className="flex items-center gap-2 bg-zinc-900/60 p-3 rounded-xl border border-nexus-border/60">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-300">
                        Status: {isSupabaseConfigured ? "SUPABASE CONECTADO EM NUVEM" : "MODO OFFLINE (LOCALSTORAGE)"}
                      </span>
                    </div>

                    {supabaseSyncError && (
                      <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-xl text-red-400 text-[11px] font-medium font-mono">
                        {supabaseSyncError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">
                        Instrução para Configuração no Banco:
                      </span>
                      <p className="text-zinc-500 text-[11px]">
                        Para o correto funcionamento do aplicativo, copie e execute o script SQL abaixo no editor SQL do seu painel do Supabase para criar a tabela de dados dos projetos:
                      </p>
                      
                      <div className="relative">
                        <pre className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-[10px] text-zinc-300 font-mono overflow-x-auto max-h-48 leading-relaxed">
{`-- Crie a tabela para os projetos Nexus
create table if not exists public.nexus_projects (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  niche text,
  objective text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar segurança nível de linha (RLS)
alter table public.nexus_projects enable row level security;

-- Políticas de Acesso RLS
create policy "Usuários podem ver os próprios projetos" on public.nexus_projects
  for select using (auth.uid() = user_id);

create policy "Usuários podem criar os próprios projetos" on public.nexus_projects
  for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar os próprios projetos" on public.nexus_projects
  for update using (auth.uid() = user_id);

create policy "Usuários podem excluir os próprios projetos" on public.nexus_projects
  for delete using (auth.uid() = user_id);`}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`create table if not exists public.nexus_projects (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  niche text,
  objective text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.nexus_projects enable row level security;

create policy "Usuários podem ver os próprios projetos" on public.nexus_projects
  for select using (auth.uid() = user_id);

create policy "Usuários podem criar os próprios projetos" on public.nexus_projects
  for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar os próprios projetos" on public.nexus_projects
  for update using (auth.uid() = user_id);

create policy "Usuários podem excluir os próprios projetos" on public.nexus_projects
  for delete using (auth.uid() = user_id);`);
                            alert("SQL copiado com sucesso!");
                          }}
                          className="absolute right-2.5 top-2.5 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 px-2.5 py-1 rounded text-[9px] font-mono cursor-pointer transition-colors"
                        >
                          COPIAR SQL
                        </button>
                      </div>
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

  return (
    <div className="min-h-screen bg-nexus-black text-zinc-100 flex font-sans select-none antialiased">
      {renderWorkspace()}
    </div>
  );
}
