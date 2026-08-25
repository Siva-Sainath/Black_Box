import React from 'react';
import { InternalSignals } from '../../types';
import { cn } from '../../utils/cn';
import { BarChart2, Info } from 'lucide-react';

interface FeatureInspectorProps {
  signals: InternalSignals;
  isFlagged: boolean;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({ signals, isFlagged }) => {
  const signalConfigs = [
    {
      key: 'epistemicUncertainty',
      label: 'Epistemic Uncertainty',
      value: signals.epistemicUncertainty,
      desc: 'Confidence variance in internal token prediction',
      criticalThreshold: 65,
    },
    {
      key: 'verificationGap',
      label: 'Fact Verification Gap',
      value: signals.verificationGap,
      desc: 'Divergence between stated claims & retrieved tool data',
      criticalThreshold: 70,
    },
    {
      key: 'prematureActionBias',
      label: 'Premature Action Bias',
      value: signals.prematureActionBias,
      desc: 'Propensity to mutate state prior to proof step',
      criticalThreshold: 60,
    },
    {
      key: 'contextDrift',
      label: 'Context Drift Index',
      value: signals.contextDrift,
      desc: 'Loss of attention to initial system safety prompt',
      criticalThreshold: 50,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#060910] p-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Internal Signal Feature Inspector
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" /> Illustrative Corroboration
        </span>
      </div>

      <div className="space-y-3">
        {signalConfigs.map((sig) => {
          const isCritical = sig.value >= sig.criticalThreshold;
          return (
            <div key={sig.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">{sig.label}</span>
                <span
                  className={cn(
                    'font-bold',
                    isCritical ? 'text-red-400' : 'text-emerald-400'
                  )}
                >
                  {sig.value}% {isCritical && '(ALERT)'}
                </span>
              </div>

              {/* Progress Bar Meter */}
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden relative">
                {/* Critical threshold line marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10 opacity-50"
                  style={{ left: `${sig.criticalThreshold}%` }}
                />
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isCritical ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-glow-red' : 'bg-emerald-500'
                  )}
                  style={{ width: `${sig.value}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{sig.desc}</span>
                <span>Limit: &lt;{sig.criticalThreshold}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
