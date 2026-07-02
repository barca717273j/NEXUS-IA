import { useState, useEffect, FormEvent } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCards from "./components/MetricCards";
import SalesChart from "./components/SalesChart";
import ProjectWizard from "./components/ProjectWizard";
import ProjectTabs from "./components/ProjectTabs";
import ProjectCategoryList from "./components/ProjectCategoryList";
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
  X,
  ArrowRight,
  LayoutGrid,
  Menu,
  ShieldCheck,
  Lock,
  Calendar,
  Database,
  Layout,
  Globe
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"semanal" | "mensal" | "anual">("mensal");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem("nexus_current_plan") || "Plano Pro - Mensal";
  });
  const [renewalDate, setRenewalDate] = useState(() => {
    const saved = localStorage.getItem("nexus_renewal_date");
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString("pt-BR");
  });

  const consumeCredits = (amount: number): boolean => {
    if (credits < amount) {
      setShowSubscriptionModal(true);
      return false;
    }
    setCredits(prev => {
      const newVal = Math.max(0, prev - amount);
      localStorage.setItem("nexus_credits", String(newVal));
      return newVal;
    });
    return true;
  };

  const handleSubscribe = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      let creditsToAdd = 400;
      let planName = "Plano Pro - Mensal";
      let daysToAdd = 30;

      if (selectedPeriod === "semanal") {
        creditsToAdd = 70;
        planName = "Plano Pro - Semanal";
        daysToAdd = 7;
      } else if (selectedPeriod === "anual") {
        creditsToAdd = 6000;
        planName = "Plano Pro - Anual";
        daysToAdd = 365;
      }

      // Update state
      setCredits(prev => {
        const newVal = prev + creditsToAdd;
        localStorage.setItem("nexus_credits", String(newVal));
        return newVal;
      });

      setCurrentPlan(planName);
      localStorage.setItem("nexus_current_plan", planName);

      const d = new Date();
      d.setDate(d.getDate() + daysToAdd);
      const newRenewalStr = d.toLocaleDateString("pt-BR");
      setRenewalDate(newRenewalStr);
      localStorage.setItem("nexus_renewal_date", newRenewalStr);

      setIsSubscribing(false);
      setSubscribeSuccess(true);

      setTimeout(() => {
        setSubscribeSuccess(false);
        setShowSubscriptionModal(false);
      }, 2500);
    }, 1500);
  };

  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    const saved = localStorage.getItem("nexus_monthly_goal");
    return saved ? Number(saved) : 5000;
  });

  const [creationMode, setCreationMode] = useState<"ebook" | "landing_page" | "site">("ebook");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Ebook gerado com sucesso!", text: "O eBook 'Despertar da Riqueza' foi gerado e estruturado.", time: "10 min atrás", read: false },
    { id: 2, title: "Nova venda registrada!", text: "Sua venda de R$ 97 foi adicionada ao projeto ativo.", time: "2 horas atrás", read: false },
    { id: 3, title: "Análise de público concluída", text: "A pesquisa inteligente gerou os dados do Avatar.", time: "1 dia atrás", read: true },
  ]);

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

  useEffect(() => {
    localStorage.setItem("nexus_current_plan", currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem("nexus_renewal_date", renewalDate);
  }, [renewalDate]);

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
    projType: "ebook" | "landing_page" | "site" = "ebook",
    apiProvider?: "gemini" | "claude",
    claudeApiKey?: string,
    theme?: "nexus" | "oceanic" | "amber" | "slate",
    layout?: "tech" | "business" | "creative" | "clean",
    selectedPages?: string[]
  ) => {
    const cost = projType === "site" ? 20 : projType === "landing_page" ? 12 : 10;
    if (credits < cost) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          niche, 
          objective, 
          pages, 
          language, 
          type: projType, 
          apiProvider, 
          claudeApiKey,
          theme,
          layout,
          selectedPages
        })
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
          sales: [],
          creditsUsed: cost,
          lastEditAt: new Date().toLocaleDateString("pt-BR"),
          chatMessagesCount: 0,
          aiChatHistory: []
        };

        setProjects(prev => [newProj, ...prev]);
        setSelectedProjectId(newProj.id);
        setCredits(prev => {
          const newVal = Math.max(0, prev - cost);
          localStorage.setItem("nexus_credits", String(newVal));
          return newVal;
        });
        
        // Redirect directly to the product's instant preview/reader view in the library
        setActiveTab("library");
      } else {
        throw new Error("Formato de resposta inválido do servidor.");
      }
    } catch (error) {
      console.warn("Erro ao gerar projeto via API, usando fallback premium local:", error);
      const fallbackProj = generateProject(name, niche, objective, pages, language, coverUrl, projType);
      fallbackProj.creditsUsed = cost;
      fallbackProj.lastEditAt = new Date().toLocaleDateString("pt-BR");
      fallbackProj.chatMessagesCount = 0;
      fallbackProj.aiChatHistory = [];

      setProjects(prev => [fallbackProj, ...prev]);
      setSelectedProjectId(fallbackProj.id);
      setCredits(prev => {
        const newVal = Math.max(0, prev - cost);
        localStorage.setItem("nexus_credits", String(newVal));
        return newVal;
      });
      
      // Redirect directly to the product's instant preview/reader view in the library
      setActiveTab("library");
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
          credits={credits}
          notifications={notifications}
          onMarkAllNotificationsAsRead={() => {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
          }}
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
            isMobileView={isMobileView}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            notifications={notifications}
            setNotifications={setNotifications}
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
                {/* Subscription Status Bar */}
                <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden shadow-xl" id="dashboard-subscription-bar">
                  {/* Warm background glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.03] rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-wrap items-center gap-5 sm:gap-8">
                    {/* Plan Status Card */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider block">Plano Ativo</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm font-black text-white">{currentPlan}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-[1px] h-10 bg-zinc-850" />

                    {/* Credits Card */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider block">Créditos Restantes</span>
                      <div className="flex items-center gap-1.5">
                        <Coins size={14} className="text-red-500" />
                        <span className="text-sm font-mono font-black text-white">{credits} créditos</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-[1px] h-10 bg-zinc-850" />

                    {/* Renewal Card */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider block">Data de Renovação</span>
                      <span className="text-sm font-mono font-black text-zinc-300">{renewalDate}</span>
                    </div>
                  </div>

                  {/* Manage Subscription Button */}
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="w-full sm:w-auto px-4.5 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 text-zinc-300 hover:text-white text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                    id="dashboard-subscription-manage-btn"
                  >
                    Gerenciar Assinatura
                  </button>
                </div>

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

                    <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                      <button
                        onClick={() => {
                          setCreationMode("ebook");
                          setActiveTab("new-project");
                        }}
                        id="dashboard-cta-create-ebook"
                        className="w-full lg:w-48 inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black tracking-wider uppercase shadow-lg shadow-red-600/10 cursor-pointer transition-all hover:translate-y-[-1px]"
                      >
                        <BookOpen size={14} className="stroke-[2.5]" />
                        <span>Gerar Ebook</span>
                      </button>

                      <button
                        onClick={() => {
                          setCreationMode("site");
                          setActiveTab("new-project");
                        }}
                        id="dashboard-cta-create-site"
                        className="w-full lg:w-48 inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-black tracking-wider uppercase cursor-pointer transition-all hover:translate-y-[-1px]"
                      >
                        <Globe size={14} className="stroke-[2.5]" />
                        <span>Site Oficial</span>
                      </button>
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
                                <p className="text-xs font-bold text-zinc-200 truncate">{proj.ebook?.title || proj.name}</p>
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
                  mode={creationMode}
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
                    credits={credits}
                    consumeCredits={consumeCredits}
                    onBack={() => {
                      const type = activeProject.type || "ebook";
                      if (type === "landing_page") {
                        setActiveTab("landing_pages");
                      } else if (type === "site") {
                        setActiveTab("sites");
                      } else {
                        setActiveTab("ebooks");
                      }
                    }}
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

            {/* VIEW: EBOOKS LIST */}
            {activeTab === "ebooks" && (
              <motion.div
                key="tab-ebooks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProjectCategoryList
                  projects={projects}
                  type="ebook"
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setActiveTab("library");
                  }}
                  onCreateNew={() => {
                    setCreationMode("ebook");
                    setActiveTab("new-project");
                  }}
                />
              </motion.div>
            )}

            {/* VIEW: SITES LIST */}
            {activeTab === "sites" && (
              <motion.div
                key="tab-sites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProjectCategoryList
                  projects={projects}
                  type="site"
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setActiveTab("library");
                  }}
                  onCreateNew={() => {
                    setCreationMode("site");
                    setActiveTab("new-project");
                  }}
                />
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
                            <option key={p.id} value={p.id}>{p.ebook?.title || p.name} ({p.niche})</option>
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

                {/* Nuvem e Sincronização Segura Card */}
                <div className="bg-nexus-black border border-nexus-border p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-mono uppercase text-zinc-400 font-bold">
                      Sincronização & Segurança em Nuvem
                    </h3>
                  </div>

                  <div className="text-xs space-y-3 leading-relaxed">
                    <p className="text-zinc-400">
                      O Nexus possui sincronização em tempo real nativa de alta performance. Suas alterações em e-books, sites e relatórios comerciais são preservadas instantaneamente de forma segura e distribuída.
                    </p>

                    <div className="flex items-center gap-2 bg-zinc-900/60 p-3 rounded-xl border border-nexus-border/60">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-300">
                        Status do Ecossistema: ATIVO & CRIPTOGRAFADO
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">
                        Segurança e Integridade:
                      </span>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">
                        Sua licença Corporate Premium garante criptografia de ponta a ponta (AES-256) na transferência de metadados de suas campanhas, garantindo privacidade absoluta contra acessos não autorizados.
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

  return (
    <div className="min-h-screen bg-nexus-black text-zinc-100 flex font-sans select-none antialiased">
      {renderWorkspace()}

      {/* Subscription Plans Modal */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              if (credits > 0 && !isSubscribing && !subscribeSuccess) {
                setShowSubscriptionModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl p-6 md:p-8 relative overflow-hidden shadow-2xl space-y-6"
            >
              {/* Warm decorative background blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" />

              {/* Close Button - only if user actually has credits */}
              {credits > 0 && (
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}

              {/* Header Title & Intro */}
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-500 font-mono font-black uppercase tracking-wider rounded-lg">
                  <Coins size={12} className="animate-pulse" />
                  Consumo Baseado em Créditos
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {credits === 0 ? "Você ficou sem créditos" : "Planos & Créditos Nexus"}
                </h3>
                
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                  {credits === 0 
                    ? "Sua conta consumiu toda a franquia de créditos ativos. Escolha um plano para continuar utilizando o Nexus."
                    : "Amplie seus limites operacionais de IA para criar campanhas completas, ebooks profissionais e sites de vendas."
                  }
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4">
                
                {/* PLAN 1: SEMANAL */}
                <div
                  onClick={() => !isSubscribing && !subscribeSuccess && setSelectedPeriod("semanal")}
                  className={`border rounded-2xl p-5 flex flex-col justify-between gap-6 transition-all cursor-pointer relative overflow-hidden ${
                    selectedPeriod === "semanal"
                      ? "border-red-500 bg-red-500/[0.01]"
                      : "border-zinc-800 bg-zinc-900/35 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">Semanal</span>
                      {selectedPeriod === "semanal" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">✓</span>
                      )}
                    </div>
                    <div>
                      <span className="text-3xl font-serif font-black text-white">R$ 7,90</span>
                      <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Cobrado semanalmente</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-850 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                        <Coins size={12} className="text-red-500 shrink-0" />
                        <span>70 créditos por semana</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PLAN 2: MENSAL (Mais Popular) */}
                <div
                  onClick={() => !isSubscribing && !subscribeSuccess && setSelectedPeriod("mensal")}
                  className={`border rounded-2xl p-5 flex flex-col justify-between gap-6 transition-all cursor-pointer relative overflow-hidden ${
                    selectedPeriod === "mensal"
                      ? "border-red-500 bg-red-500/[0.02]"
                      : "border-zinc-800 bg-zinc-900/35 hover:border-zinc-700"
                  }`}
                >
                  {/* Highlight badges */}
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md">
                    Mais Popular
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono uppercase text-red-500 font-black tracking-wider">Mensal</span>
                      {selectedPeriod === "mensal" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">✓</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-serif font-black text-white">R$ 23,90</span>
                        <span className="inline-block px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-[8px] text-red-500 font-mono font-black uppercase rounded">Melhor Custo</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Cobrado mensalmente</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-850 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-200 font-bold">
                        <Coins size={12} className="text-red-500 shrink-0" />
                        <span>400 créditos por mês</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PLAN 3: ANUAL (Economia) */}
                <div
                  onClick={() => !isSubscribing && !subscribeSuccess && setSelectedPeriod("anual")}
                  className={`border rounded-2xl p-5 flex flex-col justify-between gap-6 transition-all cursor-pointer relative overflow-hidden ${
                    selectedPeriod === "anual"
                      ? "border-red-500 bg-red-500/[0.01]"
                      : "border-zinc-800 bg-zinc-900/35 hover:border-zinc-700"
                  }`}
                >
                  {/* Economia badge */}
                  <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-300 text-[8px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl">
                    Economize 30%
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">Anual</span>
                      {selectedPeriod === "anual" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">✓</span>
                      )}
                    </div>
                    <div>
                      <span className="text-3xl font-serif font-black text-white">R$ 197,90</span>
                      <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">Economize R$ 88,90 / ano</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-850 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                        <Coins size={12} className="text-red-500 shrink-0" />
                        <span>6.000 créditos por ano</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button & Checkout Status */}
              <div className="pt-4 border-t border-zinc-900 flex flex-col items-center gap-4">
                
                {subscribeSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md py-4 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-1.5"
                  >
                    <span className="text-emerald-500 text-xs font-black uppercase tracking-widest block font-mono">Pagamento Confirmado</span>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                      Sua licença comercial foi atualizada com sucesso! {selectedPeriod === "semanal" ? "70" : selectedPeriod === "mensal" ? "400" : "6.000"} créditos foram adicionados à sua carteira.
                    </p>
                  </motion.div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="w-full max-w-md py-4 px-6 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 text-white text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/10 cursor-pointer disabled:cursor-not-allowed text-center"
                  >
                    {isSubscribing ? "Processando conexão bancária segura..." : "Assinar Agora"}
                  </button>
                )}

                <p className="text-[10px] text-zinc-500 font-medium leading-normal text-center max-w-md">
                  Criptografia de nível militar garantida por Nexus Security Core. Todos os créditos adquiridos expiram apenas no final do ciclo de faturamento ativo.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
