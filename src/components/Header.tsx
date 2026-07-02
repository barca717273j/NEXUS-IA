import { useState } from "react";
import { Bell, Settings, CreditCard, User, HelpCircle, CheckCircle, MoreVertical, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  credits: number;
  userName: string;
  userEmail: string;
  onOpenSettings: () => void;
  isMobileView?: boolean;
  onToggleSidebar?: () => void;
  notifications: Array<{ id: number; title: string; text: string; time: string; read: boolean }>;
  setNotifications: (notifications: any) => void;
}

export default function Header({ 
  credits, 
  userName, 
  userEmail, 
  onOpenSettings,
  isMobileView = false,
  onToggleSidebar,
  notifications,
  setNotifications
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 sm:px-6 bg-nexus-black/95 backdrop-blur-md border-b border-nexus-border">
      {/* Brand Label/Logo for mobile or breadcrumb */}
      <div className="flex items-center gap-3">
        {isMobileView && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            id="btn-mobile-dots-header-trigger"
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 border border-nexus-border hover:border-nexus-red text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
            title="Menu de Navegação"
          >
            <MoreVertical size={18} className="text-zinc-400" />
          </button>
        )}
        <div className="flex items-center gap-2 border-r border-nexus-border/60 pr-4">
          <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block md:hidden">
            NEXUS
          </span>
          <span className="text-[10px] font-mono text-zinc-500 hidden md:block uppercase tracking-wider">
            Workspace
          </span>
        </div>
      </div>

      {/* Action utilities: Credits, Notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Credits Status */}
        <div 
          id="credits-indicator"
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/40 border border-nexus-border/80 text-[10px] font-mono text-zinc-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-red/80"></span>
          <span>
            Créditos: <span className="font-bold text-white">{credits}</span>
            <span className="text-zinc-600 font-medium">/100</span>
          </span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
            id="btn-notifications-menu"
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-nexus-card/80 text-zinc-400 hover:text-nexus-red relative transition-colors cursor-pointer border border-transparent hover:border-nexus-border/50"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-nexus-red"></span>
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
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-nexus-card/80 text-zinc-400 hover:text-nexus-red transition-colors cursor-pointer border border-transparent hover:border-nexus-border/50"
        >
          <Settings size={15} />
        </button>

      </div>
    </header>
  );
}
