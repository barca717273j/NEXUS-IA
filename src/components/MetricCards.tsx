import { BookOpen, Briefcase, DollarSign, Target, ShieldCheck, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardsProps {
  totalEbooks: number;
  activeProjects: number;
  totalSalesCount: number;
  totalRevenue: number;
  monthlyGoal: number;
}

export default function MetricCards({
  totalEbooks,
  activeProjects,
  totalSalesCount,
  totalRevenue,
  monthlyGoal
}: MetricCardsProps) {
  const goalProgress = Math.min(100, Math.round((totalRevenue / monthlyGoal) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 select-none">
      
      {/* FEATURED: Vendas Registradas (Gateway Style) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-gradient-to-br from-[#0F0F12] to-[#050506] border border-nexus-red/40 hover:border-nexus-red/70 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 min-h-[195px] shadow-lg shadow-black/60 col-span-1 sm:col-span-2 lg:col-span-2 group"
      >
        {/* Glowing visual lines */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-red/[0.04] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-nexus-red/40 to-transparent" />
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              NEXUS PAY • GATEWAY DE LIQUIDEZ ATIVA
            </span>
            <span className="px-2 py-0.5 rounded-full bg-nexus-red/10 border border-nexus-red/20 text-[8px] font-bold font-mono text-nexus-red uppercase tracking-wider">
              100% SEGURO
            </span>
          </div>

          <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5 font-semibold">
            Vendas Registradas (Faturamento Geral)
          </p>
          
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,31,61,0.15)]">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <TrendingUp size={10} />
              +100%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-nexus-border/60 pt-3.5 mt-4">
          <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-nexus-red" />
            <span>{totalSalesCount} transações aprovadas e liquidadas</span>
          </p>
          <span className="text-[9px] font-mono font-black text-nexus-red bg-nexus-red/5 px-2 py-0.5 rounded border border-nexus-red/10">
            NEXUS PAY
          </span>
        </div>
      </motion.div>

      {/* Goal Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="p-6 bg-gradient-to-br from-[#0F0F12] to-[#050506] border border-nexus-border hover:border-nexus-red/30 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 min-h-[195px] shadow-lg shadow-black/60 group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-red/[0.01] rounded-full blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest font-black flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-nexus-red animate-pulse" />
              DESEMPENHO OPERACIONAL
            </span>
            <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 font-semibold">
              Meta Mensal de Vendas
            </p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-xl font-serif font-black text-nexus-red">
                {goalProgress}%
              </h3>
              <span className="text-[9px] font-mono text-zinc-400 font-medium">
                de R$ {monthlyGoal.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
          <div className="p-2 bg-nexus-black border border-nexus-border text-nexus-red rounded-lg group-hover:border-nexus-red/40 transition-colors">
            <Target size={14} />
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          <div className="w-full bg-nexus-black rounded-full h-1.5 border border-nexus-border/40 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-nexus-red h-full rounded-full shadow-[0_0_8px_rgba(255,31,61,0.4)]" 
            />
          </div>
        </div>

        <div className="flex justify-between text-[9px] font-mono text-zinc-400 font-semibold uppercase border-t border-nexus-border/60 pt-3.5 mt-3">
          <span>R$ {totalRevenue.toLocaleString("pt-BR")}</span>
          <span>Meta: R$ {monthlyGoal.toLocaleString("pt-BR")}</span>
        </div>
      </motion.div>

      {/* Secondary Metrics Column - Operation Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="p-6 bg-gradient-to-br from-[#0F0F12] to-[#050506] border border-nexus-border hover:border-nexus-red/30 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 min-h-[195px] shadow-lg shadow-black/60 group"
      >
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              MÉTRICAS DO PORTFÓLIO
            </span>
            <div className="p-1.5 bg-nexus-black border border-nexus-border text-zinc-400 rounded-lg group-hover:border-nexus-red/40 transition-colors">
              <Briefcase size={12} />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-nexus-black border border-nexus-border text-zinc-400 rounded-md">
                  <BookOpen size={11} />
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">Quantidade de Ebooks</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-white bg-nexus-black border border-nexus-border px-2 py-0.5 rounded">{totalEbooks}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-nexus-black border border-nexus-border text-zinc-400 rounded-md">
                  <TrendingUp size={11} />
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">Projetos Ativos</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-white bg-nexus-black border border-nexus-border px-2 py-0.5 rounded">{activeProjects}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-nexus-border/60 pt-3 mt-3">
          <p className="text-[9px] text-zinc-400 leading-none">
            Copys e funis otimizados
          </p>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
            ATIVO
          </span>
        </div>
      </motion.div>

    </div>
  );
}
