import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sale } from "../types";
import { TrendingUp, AlertCircle } from "lucide-react";

interface SalesChartProps {
  sales: Sale[];
}

export default function SalesChart({ sales }: SalesChartProps) {
  // Group sales by date for the last 7 entries, or show a structured baseline if empty
  const getChartData = () => {
    if (sales.length === 0) {
      // Baseline dates to make the chart look pristine even with no sales registered yet
      return [
        { date: "15/06", valor: 0, count: 0 },
        { date: "17/06", valor: 0, count: 0 },
        { date: "19/06", valor: 0, count: 0 },
        { date: "21/06", valor: 0, count: 0 },
        { date: "23/06", valor: 0, count: 0 },
        { date: "25/06", valor: 0, count: 0 },
        { date: "26/06", valor: 0, count: 0 },
      ];
    }

    // Sort sales by date ascending
    const sortedSales = [...sales].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Map to simple DD/MM format and accumulate
    const dataMap: { [key: string]: { valor: number; count: number } } = {};
    
    sortedSales.forEach((sale) => {
      // Format date
      let dateLabel = "Data";
      try {
        const dateObj = new Date(sale.date);
        const day = String(dateObj.getDate() + 1).padStart(2, "0"); // adjust timezone shift if needed
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        dateLabel = `${day}/${month}`;
      } catch (e) {
        dateLabel = sale.date;
      }

      if (!dataMap[dateLabel]) {
        dataMap[dateLabel] = { valor: 0, count: 0 };
      }
      dataMap[dateLabel].valor += sale.value;
      dataMap[dateLabel].count += 1;
    });

    // Convert to array
    return Object.keys(dataMap).map((key) => ({
      date: key,
      valor: dataMap[key].valor,
      count: dataMap[key].count,
    })).slice(-7); // Keep last 7 days of sales history
  };

  const chartData = getChartData();
  const totalPeriodRevenue = chartData.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="bg-nexus-card border border-nexus-border p-6 rounded-2xl select-none shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-nexus-red" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Histórico e Evolução de Faturamento
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            Faturamento acumulado registrado no período:{" "}
            <span className="text-zinc-300 font-semibold">R$ {totalPeriodRevenue.toLocaleString()}</span>
          </p>
        </div>

        {sales.length === 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-red/[0.04] border border-nexus-red/20 rounded-lg text-[11px] text-nexus-red font-medium font-mono">
            <AlertCircle size={12} />
            <span>Nenhuma venda registrada neste projeto ainda</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1F3D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#FF1F3D" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#52525b"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                     <div className="bg-nexus-black border border-nexus-border p-3.5 shadow-2xl rounded-xl">
                      <p className="text-[10px] font-mono text-zinc-500 mb-1.5">{data.date}</p>
                      <p className="text-xs font-bold text-nexus-red">
                        Total: R$ {data.valor.toLocaleString()}
                      </p>
                      {data.count > 0 && (
                        <p className="text-[10px] text-zinc-400 mt-1">
                          {data.count} {data.count === 1 ? "venda" : "vendas"}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#FF1F3D"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValor)"
              activeDot={{ r: 5, stroke: "#050506", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
