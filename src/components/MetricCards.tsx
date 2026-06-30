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
        className="p-5 bg-gradient-to-br from-zinc-900/90 to-black border-2 border-red-600/30 rounded-2xl flex flex-col justify-between relative group overflow-hidden shadow-lg shadow-red-950/5 col-span-1 sm:col-span-2 lg:col-span-2"
      >
        {/* Glowing visual lines */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.04] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GATEWAY DE LIQUIDEZ ATIVA
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-[8px] font-bold font-mono text-red-500 uppercase tracking-wider">
              100% SEGURO
            </span>
          </div>

          <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 font-semibold">
            Vendas Registradas (Faturamento Geral)
          </p>
          
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <TrendingUp size={10} />
              +100%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3.5 mt-4">
          <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
            <ShieldCheck size={12} className="text-red-500" />
            <span>{totalSalesCount} transações aprovadas e liquidadas</span>
          </p>
          <span className="text-[9px] font-mono font-black text-red-500 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
            NEXUS PAY
          </span>
        </div>
      </motion.div>

      {/* Goal Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="p-5 bg-nexus-card border border-nexus-border rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 font-semibold">
              Meta Mensal de Vendas
            </p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-lg sm:text-xl font-serif font-black text-red-500">
                {goalProgress}%
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 font-medium">
                de R$ {monthlyGoal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-2 bg-nexus-black border border-nexus-border text-red-500 rounded-lg">
            <Target size={14} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="w-full bg-nexus-black rounded-full h-1.5 bg-zinc-800/60 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-red-600 h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]" 
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-semibold uppercase">
            <span>R$ {totalRevenue.toLocaleString()}</span>
            <span>Meta: R$ {monthlyGoal.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Secondary Metrics Column - Merged Ebooks & Projects to make space */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="p-5 bg-nexus-card border border-nexus-border rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm"
      >
        <div>
          <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-3 font-semibold">
            ESTATÍSTICAS DA OPERAÇÃO
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-nexus-black border border-nexus-border text-zinc-400 rounded-md">
                  <BookOpen size={11} />
                </div>
                <span className="text-xs text-zinc-400 font-medium">Quantidade de Ebooks</span>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-100">{totalEbooks}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-nexus-black border border-nexus-border text-zinc-400 rounded-md">
                  <Briefcase size={11} />
                </div>
                <span className="text-xs text-zinc-400 font-medium">Projetos Ativos</span>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-100">{activeProjects}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-nexus-border/60 pt-2.5 mt-3">
          <p className="text-[9px] text-zinc-500 leading-tight">
            Operação otimizada com funis e copys ativas de alta performance.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
