import React from 'react';
import { InternalSignals } from '../../types';
import { cn } from '../../utils/cn';
import { BarChart2 } from 'lucide-react';

interface FeatureInspectorProps {
  signals: InternalSignals;
  isFlagged: boolean;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({ signals }) => {
  const signalConfigs = [
    {
      key: 'epistemicUncertainty',
      label: 'Epistemic uncertainty',
      value: signals.epistemicUncertainty,
      criticalThreshold: 0.65,
    },
    {
      key: 'verificationGap',
      label: 'Verification gap',
      value: signals.verificationGap,
      criticalThreshold: 0.7,
    },
    {
      key: 'prematureActionBias',
      label: 'Premature action bias',
      value: signals.prematureActionBias,
      criticalThreshold: 0.6,
    },
    {
      key: 'contextDrift',
      label: 'Context drift',
      value: signals.contextDrift,
      criticalThreshold: 0.5,
    },
  ];

  return (
    <div className="ui-card p-4">
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 mb-3">
        <BarChart2 className="w-4 h-4 text-zinc-400" />
        <span className="text-xs font-medium text-white">Internal signals</span>
      </div>

      <div className="space-y-3">
        {signalConfigs.map((sig) => {
          const pct = Math.round(sig.value * 100);
          const thresholdPct = Math.round(sig.criticalThreshold * 100);
          const isCritical = sig.value >= sig.criticalThreshold;
          return (
            <div key={sig.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{sig.label}</span>
                <span className={cn('font-mono font-medium', isCritical ? 'text-red-400' : 'text-emerald-400')}>
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isCritical ? 'bg-red-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-600">Alert above {thresholdPct}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
