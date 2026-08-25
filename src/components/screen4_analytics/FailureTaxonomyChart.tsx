import React from 'react';
import { TAXONOMY_BREAKDOWN } from '../../data/mockAnalytics';
import { ShieldAlert } from 'lucide-react';

export const FailureTaxonomyChart: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
          Empirical Taxonomy
        </span>
        <span className="text-[10px] font-mono text-zinc-500">372 Anomalies</span>
      </div>

      <div className="space-y-3 font-mono">
        {TAXONOMY_BREAKDOWN.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-200 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[11px]">{item.count} runs</span>
                <span className="font-semibold text-white">{item.percentage}%</span>
              </div>
            </div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>

            <p className="text-[10px] text-zinc-500 leading-tight">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
