"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MarketCapChartProps {
  data: Array<{ date: string; value: number }>;
}

export default function MarketCapChart({ data }: MarketCapChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-xs text-gray-400 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-[#D4AF37]">
            ¥{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 min-h-[256px] mt-4 bg-black/30 rounded-lg p-2 border border-gray-800">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#4ade80" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2.5}
            fill="url(#colorMarketCap)"
            dot={false}
            activeDot={{ r: 4, fill: "#4ade80", stroke: "#000", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

