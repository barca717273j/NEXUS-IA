import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  FolderPlus, 
  Library, 
  CircleDollarSign, 
  Settings, 
  LogOut, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  hasActiveProject: boolean;
  userName?: string;
  isMobileView?: boolean;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  collapsed, 
  setCollapsed,
  hasActiveProject,
  userName = "JD",
  isMobileView = false
}: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "new-project", label: "Novo Projeto", icon: FolderPlus },
    ...(hasActiveProject ? [{ id: "library", label: "Biblioteca Ativa", icon: Library }] : []),
    { id: "sales-ledger", label: "Registrar Venda", icon: CircleDollarSign },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <motion.aside
      animate={
        isMobileView 
          ? { x: collapsed ? "-100%" : "0%", width: "260px" } 
          : { x: "0%", width: collapsed ? "80px" : "260px" }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="sidebar-container"
      className={`${isMobileView ? "absolute h-full z-50 shadow-[5px_0_30px_rgba(0,0,0,0.6)]" : "fixed h-screen z-40"} inset-y-0 left-0 flex flex-col border-r border-nexus-border bg-nexus-dark text-zinc-100`}
    >
      {/* Brand Logo Header */}
      <div className="flex flex-col justify-center h-24 px-6 border-b border-nexus-border relative">
        {(!collapsed || isMobileView) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-red to-rose-600 shadow-[0_0_15px_rgba(255,31,61,0.45)] border border-nexus-red/20 shrink-0">
                <Zap size={15} className="text-white fill-white animate-pulse" />
              </div>
              <span className="font-display text-2xl tracking-tighter font-black text-white">
                NEXUS
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[9px] uppercase tracking-[0.25em] text-nexus-red font-extrabold font-mono">
                PLATAFORMA
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold font-mono text-nexus-red border border-nexus-red/30 uppercase tracking-wider">
                EXCLUSIVA
              </span>
            </div>
          </motion.div>
        )}

        {collapsed && !isMobileView && (
          <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-red to-rose-600 shadow-[0_0_15px_rgba(255,31,61,0.45)] border border-nexus-red/20 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Zap size={18} className="text-white fill-white animate-pulse" />
          </div>
        )}

        {/* Close Button for mobile drawer */}
        {isMobileView && (
          <button
            onClick={() => setCollapsed(true)}
            id="btn-close-mobile-drawer"
            className="absolute right-4 top-8 p-1.5 rounded-lg border border-nexus-border hover:border-nexus-red/50 text-zinc-400 hover:text-nexus-red transition-all cursor-pointer"
            title="Fechar Menu"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Collapse button for Desktop */}
        {!isMobileView && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            id="btn-toggle-sidebar"
            className="absolute right-[-14px] top-9 hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-nexus-card border border-nexus-border hover:border-nexus-red text-zinc-400 hover:text-nexus-red shadow-md cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4.5 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 relative group cursor-pointer ${
                isActive 
                  ? "text-nexus-red bg-nexus-red/10 border border-nexus-red/20 shadow-sm shadow-nexus-red/5" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-nexus-card/50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-nexus-red" : "text-zinc-400 group-hover:text-zinc-200 transition-colors"} />
              {!collapsed && (
                <motion.span 
                   initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
              {/* Tooltip for collapsed sidebar */}
              {collapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-transform bg-nexus-card text-zinc-100 text-xs px-2.5 py-1.5 rounded-sm border border-nexus-border whitespace-nowrap z-50 shadow-xl font-medium tracking-wide">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Section: Account and Logout unified */}
      <div className="mt-auto border-t border-nexus-border bg-nexus-black/40">
        {!collapsed && (
          <div className="p-4 flex flex-col gap-3">
            <div className="bg-nexus-card p-3 rounded-xl border border-nexus-border/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-nexus-red/15 border border-nexus-red/30 flex items-center justify-center font-black text-nexus-red font-display text-sm shrink-0 shadow-sm shadow-nexus-red/5">
                {getInitials(userName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-200 truncate">{userName}</div>
                <div className="text-[10px] text-nexus-red font-bold font-mono tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-red animate-pulse" />
                  Membro Premium
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              id="sidebar-logout-btn"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-nexus-red/10 border border-nexus-red/20 hover:bg-nexus-red hover:text-white transition-all duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sair da Conta</span>
            </button>
          </div>
        )}
        {collapsed && (
          <div className="p-3 flex flex-col gap-2 items-center">
            <div className="w-9 h-9 rounded-full bg-nexus-red/15 border border-nexus-red/30 flex items-center justify-center font-black text-nexus-red font-display text-sm shrink-0 shadow-sm shadow-nexus-red/5" title={userName}>
              {getInitials(userName)}
            </div>
            <button
              onClick={onLogout}
              id="sidebar-logout-btn"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-nexus-red hover:bg-nexus-red/10 transition-all duration-200 cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
