import { useState } from "react";
import { Bell, Settings, CreditCard, User, HelpCircle, CheckCircle, Monitor, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  credits: number;
  userName: string;
  userEmail: string;
  onOpenSettings: () => void;
  viewMode: "desktop" | "mobile";
  setViewMode: (mode: "desktop" | "mobile") => void;
}

export default function Header({ 
  credits, 
  userName, 
  userEmail, 
  onOpenSettings,
  viewMode,
  setViewMode
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Ebook gerado com sucesso!", text: "O eBook 'Despertar da Riqueza' foi gerado e estruturado.", time: "10 min atrás", read: false },
    { id: 2, title: "Nova venda registrada!", text: "Sua venda de R$ 97 foi adicionada ao projeto ativo.", time: "2 horas atrás", read: false },
    { id: 3, title: "Análise de público concluída", text: "A pesquisa inteligente gerou os dados do Avatar.", time: "1 dia atrás", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-20 px-6 sm:px-8 bg-nexus-black/90 backdrop-blur-md border-b border-nexus-border">
      {/* Brand Label/Logo for mobile or breadcrumb */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-nexus-red animate-pulse" />
          <span className="text-[11px] tracking-widest font-mono text-zinc-500 uppercase block md:hidden">
            NEXUS
          </span>
          <span className="text-xs font-mono text-zinc-500 hidden md:block">
            SaaS Plataforma / <span className="text-nexus-red font-bold">Workspace</span>
          </span>
        </div>

        {/* Dynamic Simulator View Selector */}
        <div className="flex bg-nexus-dark border border-nexus-border p-1 rounded-lg select-none shadow-inner">
          <button
            onClick={() => setViewMode("desktop")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "desktop"
                ? "bg-nexus-red text-white font-extrabold shadow-md shadow-nexus-red/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Visualização Computador"
          >
            <Monitor size={12} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Computador</span>
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "mobile"
                ? "bg-nexus-red text-white font-extrabold shadow-md shadow-nexus-red/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Visualização Celular"
          >
            <Smartphone size={12} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Celular</span>
          </button>
        </div>
      </div>

      {/* Action utilities: Credits, Notifications, Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Credits Status */}
        <div 
          id="credits-indicator"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-nexus-card border border-nexus-border/80"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-nexus-red"></span>
          </span>
          <span className="text-[10px] font-mono text-zinc-400 font-semibold tracking-wide">
            Créditos: <span className="font-extrabold text-white">{credits}</span><span className="text-zinc-600 font-bold">/100</span>
          </span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            id="btn-notifications-menu"
            className="p-2 rounded-lg hover:bg-nexus-card text-zinc-400 hover:text-nexus-red relative transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nexus-red"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-80 rounded-xl bg-nexus-card border border-nexus-border shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-nexus-dark border-b border-nexus-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Notificações</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-nexus-red hover:underline cursor-pointer"
                    >
                      Ler todas
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-nexus-border/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 transition-colors ${notif.read ? "bg-transparent" : "bg-nexus-red/[0.02]"}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-semibold text-zinc-100">{notif.title}</h4>
                        <span className="text-[9px] font-mono text-zinc-500">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Settings Action */}
        <button
          onClick={onOpenSettings}
          id="btn-quick-settings"
          className="p-2 rounded-lg hover:bg-nexus-card text-zinc-400 hover:text-nexus-red transition-colors cursor-pointer"
        >
          <Settings size={18} />
        </button>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            id="btn-profile-menu"
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full hover:bg-nexus-card border border-transparent hover:border-nexus-border transition-all cursor-pointer"
          >
            <span className="text-xs font-medium text-zinc-300 hidden sm:inline-block">{userName}</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-nexus-dark border border-nexus-red/40 text-nexus-red font-bold text-xs shadow-md">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-56 rounded-xl bg-nexus-card border border-nexus-border shadow-2xl z-50 p-2"
              >
                <div className="px-3 py-2 border-b border-nexus-border mb-1.5">
                  <p className="text-xs font-bold text-zinc-200">{userName}</p>
                  <p className="text-[10px] font-mono text-zinc-500 truncate">{userEmail}</p>
                </div>
                
                <button 
                  onClick={() => { setShowProfileMenu(false); onOpenSettings(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-nexus-border/40 transition-colors text-left cursor-pointer"
                >
                  <User size={13} className="text-nexus-red" />
                  <span>Perfil Profissional</span>
                </button>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-nexus-border/40 transition-colors text-left cursor-pointer"
                >
                  <HelpCircle size={13} className="text-zinc-500" />
                  <span>Central de Ajuda</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
