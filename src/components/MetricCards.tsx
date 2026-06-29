import { BookOpen, Briefcase, DollarSign, Target } from "lucide-react";
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

  const stats = [
    {
      id: "stat-ebooks",
      label: "Quantidade de Ebooks",
      value: totalEbooks,
      subtext: "Ebooks estruturados pelo sistema",
      icon: BookOpen,
    },
    {
      id: "stat-projects",
      label: "Projetos Ativos",
      value: activeProjects,
      subtext: "Campanhas e funis em andamento",
      icon: Briefcase,
    },
    {
      id: "stat-sales",
      label: "Vendas Registradas",
      value: `R$ ${totalRevenue.toLocaleString()}`,
      subtext: `${totalSalesCount} transações adicionadas manualmente`,
      icon: DollarSign,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 select-none">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="p-4 sm:p-6 bg-nexus-card border border-nexus-border rounded-xl flex flex-col justify-between relative group overflow-hidden shadow-sm"
          >
            {/* Subtle overlay accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-red/[0.01] rounded-full blur-2xl group-hover:bg-nexus-red/[0.03] transition-colors" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 font-semibold">
                  {stat.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-zinc-100 tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div className="p-2 bg-nexus-black border border-nexus-border text-nexus-red rounded-lg">
                <Icon size={14} />
              </div>
            </div>
            
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
              {stat.subtext}
            </p>
          </motion.div>
        );
      })}

      {/* Goal Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="p-4 sm:p-6 bg-nexus-card border border-nexus-border rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 font-semibold">
              Meta Mensal de Vendas
            </p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-lg sm:text-xl font-serif font-black text-nexus-red">
                {goalProgress}%
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 font-medium">
                de R$ {monthlyGoal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-2 bg-nexus-black border border-nexus-border text-nexus-red rounded-lg">
            <Target size={14} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="w-full bg-nexus-black rounded-full h-1.5 bg-zinc-800/60 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-nexus-red h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]" 
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-semibold uppercase">
            <span>R$ {totalRevenue.toLocaleString()}</span>
            <span>Meta: R$ {monthlyGoal.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
