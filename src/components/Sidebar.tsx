import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  BookOpen,
  Layout,
  Globe,
  CircleDollarSign, 
  Settings, 
  LogOut, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Zap,
  MoreVertical,
  Bell
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
  credits: number;
  notifications: Array<{ id: number; title: string; text: string; time: string; read: boolean }>;
  onMarkAllNotificationsAsRead: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  collapsed, 
  setCollapsed,
  hasActiveProject,
  userName = "JD",
  isMobileView = false,
  credits,
  notifications,
  onMarkAllNotificationsAsRead
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ebooks", label: "Meus Ebooks", icon: BookOpen },
    { id: "sites", label: "Sites", icon: Globe },
    { id: "sales-ledger", label: "Registrar Venda", icon: CircleDollarSign },
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
          ? { x: collapsed ? "-110%" : "0%", width: "260px" } 
          : { x: "0%", width: collapsed ? "80px" : "260px" }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="sidebar-container"
      className={`fixed top-4 bottom-4 left-4 z-40 flex flex-col border border-nexus-border bg-nexus-dark text-zinc-100 shadow-2xl rounded-2xl ${
        isMobileView ? "z-50 shadow-[5px_5px_30px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center h-16 px-4 border-b border-nexus-border relative">
        {(!collapsed || isMobileView) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F0F12]/80 border border-nexus-border shrink-0 overflow-hidden shadow-[0_0_15px_rgba(255,31,61,0.25)] relative">
              <img 
                src="https://i.ibb.co/S44NnLMD/content.png" 
                alt="NEXUS Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-110 mix-blend-screen"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base tracking-tight font-black text-white leading-none">
                NEXUS
              </span>
              <span className="text-[7.5px] tracking-[0.15em] text-nexus-red font-black font-mono uppercase mt-0.5">
                PLATAFORMA EXCLUSIVA
              </span>
            </div>
          </motion.div>
        )}

        {collapsed && !isMobileView && (
          <div className="mx-auto flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F0F12]/80 border border-nexus-border/80 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(255,31,61,0.25)] hover:border-nexus-red/50">
            <img 
              src="https://i.ibb.co/S44NnLMD/content.png" 
              alt="NEXUS Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-110 mix-blend-screen"
            />
          </div>
        )}

        {/* Close Button for mobile drawer */}
        {isMobileView && (
          <button
            onClick={() => setCollapsed(true)}
            id="btn-close-mobile-drawer"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border border-nexus-border hover:border-nexus-red/50 text-zinc-400 hover:text-nexus-red transition-all cursor-pointer"
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
            className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-nexus-card border border-nexus-border hover:border-nexus-red text-zinc-400 hover:text-nexus-red shadow-md cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-none px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 relative group cursor-pointer ${
                isActive 
                  ? "text-white bg-red-600 border border-red-500 shadow-md shadow-red-600/30" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-nexus-card/50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200 transition-colors"} />
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

      {/* Resources & Status Section */}
      <div className="px-3 py-2 space-y-4">
        {!collapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Credits Panel */}
            <div className="bg-zinc-950/60 border border-nexus-border/60 p-3 rounded-xl space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap size={11} className="text-red-500 fill-red-500/20 animate-pulse" />
                  Créditos Ativos
                </span>
                <span className="text-white font-black">{credits} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500" 
                  style={{ width: `${credits}%` }} 
                />
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-zinc-950/60 border border-nexus-border/60 p-3 rounded-xl space-y-2 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Bell size={11} className="text-red-500" />
                  Notificações
                </span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <button 
                    onClick={onMarkAllNotificationsAsRead}
                    className="text-[9px] font-mono font-black text-red-500 hover:text-red-400 hover:underline transition-colors cursor-pointer uppercase"
                  >
                    Limpar
                  </button>
                )}
              </div>
              
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-[9px] text-zinc-600 font-medium italic text-center py-2">Sem novas notificações</p>
                ) : (
                  notifications.slice(0, 2).map((notif) => (
                    <div key={notif.id} className="text-[9.5px] bg-zinc-900/40 p-2 rounded-lg border border-nexus-border/30">
                      <div className="flex justify-between items-start gap-1">
                        <span className={`font-bold truncate ${notif.read ? "text-zinc-500" : "text-zinc-300"}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-500 line-clamp-1 mt-0.5">{notif.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Collapsed Icons representing Credits & Notifications with Tooltips */
          <div className="flex flex-col items-center gap-3 py-1">
            {/* Credits Icon */}
            <div className="group relative">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-nexus-border/80 flex items-center justify-center text-red-500 cursor-help transition-all hover:scale-105 shadow-sm">
                <Zap size={13} className="animate-pulse" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform bg-nexus-card text-zinc-100 text-[10px] font-mono px-2.5 py-1.5 rounded border border-nexus-border whitespace-nowrap z-50 shadow-xl font-bold">
                Créditos: <span className="text-red-500 font-black">{credits}/100</span>
              </div>
            </div>

            {/* Notifications Bell Icon */}
            <div className="group relative">
              <button 
                onClick={onMarkAllNotificationsAsRead}
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-nexus-border/80 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-105 cursor-pointer relative shadow-sm"
              >
                <Bell size={13} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </button>
              {/* Tooltip */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform bg-nexus-card text-zinc-100 text-[10px] font-mono px-2.5 py-1.5 rounded border border-nexus-border whitespace-nowrap z-50 shadow-xl font-bold">
                Notificações: <span className="text-red-500 font-black">{notifications.filter(n => !n.read).length} pendentes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push controls to the bottom */}
      <div className="flex-1" />

      {/* Footer Section: Config & Logout unified with tight spacing */}
      <div className="border-t border-nexus-border/40 bg-nexus-black/10 p-3 flex flex-col gap-2 rounded-b-2xl">
        {!collapsed && (
          <>
            {/* User Account Bar */}
            <div className="flex items-center justify-between gap-2.5 bg-nexus-card/40 p-2 rounded-xl border border-nexus-border/40">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center font-bold text-red-500 font-display text-[10px] shrink-0 shadow-sm shadow-red-500/5">
                  {getInitials(userName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-zinc-200 truncate leading-tight">{userName}</div>
                  <div className="text-[8px] text-red-500 font-black font-mono tracking-wider mt-0.5 uppercase">
                    Premium
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Grouped Settings and Logout Panel */}
            <div className="flex items-center gap-1.5 bg-nexus-card/20 p-1 rounded-xl border border-nexus-border/30">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "text-white bg-red-600 border border-red-500 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 border border-transparent"
                }`}
                title="Configurações da Plataforma"
              >
                <Settings size={11} />
                <span>Ajustes</span>
              </button>
              
              <button
                onClick={onLogout}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-950/40 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut size={11} />
                <span>Sair</span>
              </button>
            </div>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer group relative shadow-sm ${
                activeTab === "settings"
                  ? "text-white bg-red-600 border-red-500"
                  : "text-zinc-400 hover:text-white bg-nexus-card border-nexus-border/80 hover:bg-zinc-850"
              }`}
              title="Configurações"
            >
              <Settings size={13} />
              {/* Tooltip */}
              <div className="absolute left-12 scale-0 group-hover:scale-100 transition-transform bg-nexus-card text-zinc-100 text-xs px-2 py-1 rounded border border-nexus-border whitespace-nowrap z-50 shadow-xl font-medium">
                Configurações
              </div>
            </button>

            <button
              onClick={onLogout}
              id="sidebar-logout-btn-collapsed"
              className="w-8 h-8 rounded-lg bg-nexus-card border border-nexus-border/80 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all cursor-pointer group relative shadow-sm"
              title="Sair da Conta"
            >
              <LogOut size={13} />
              {/* Tooltip */}
              <div className="absolute left-12 scale-0 group-hover:scale-100 transition-transform bg-nexus-card text-zinc-100 text-xs px-2 py-1 rounded border border-nexus-border whitespace-nowrap z-50 shadow-xl font-medium">
                Sair da Conta
              </div>
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
