import React from 'react';
import { AnalyticsBatch } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface AccuracyCurveChartProps {
  batches: AnalyticsBatch[];
}

export const AccuracyCurveChart: React.FC<AccuracyCurveChartProps> = ({ batches }) => {
  const chartData = batches.map((b) => ({
    name: b.batchId,
    batchName: b.batchName,
    flaggedRate: b.flaggedRate,
    passedRate: b.passedRate,
    missedRate: b.missedRate,
    rules: b.activeRulesCount,
    ruleInjected: b.ruleInjected,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-white/[0.1] bg-[#0c0c0e] p-3 shadow-xl font-mono text-xs text-zinc-200">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-1 mb-2">
            <span className="font-semibold text-white">{data.name}</span>
            <span className="text-[10px] text-zinc-400">{data.batchName}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-red-400">
              <span>Flagged Error Rate:</span>
              <span className="font-bold">{data.flaggedRate}%</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-400">
              <span>Passed Accuracy:</span>
              <span className="font-bold">{data.passedRate}%</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-zinc-400">
              <span>Active Memory Rules:</span>
              <span className="font-semibold text-white">{data.rules} rules</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#52525b"
            tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            domain={[0, 35]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={20}
            stroke="#52525b"
            strokeDasharray="3 3"
            label={{
              value: 'Target Threshold < 15%',
              fill: '#71717a',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
              position: 'insideTopRight',
            }}
          />

          <Area
            type="monotone"
            dataKey="flaggedRate"
            stroke="#EF4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#flaggedGradient)"
            name="Flagged Rate (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
