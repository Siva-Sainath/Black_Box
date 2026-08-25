import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProviderBadge } from '../common/ProviderBadge';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const IncidentFeed: React.FC = () => {
  const { incidents, setCurrentScenarioById, openDrawerForStep, scenarios } =
    useAgentRun();

  const handleInspectIncident = (scenarioId: string, stepNumber: number) => {
    setCurrentScenarioById(scenarioId);
    const targetScn = scenarios.find((s) => s.id === scenarioId);
    if (targetScn) {
      const step = targetScn.steps.find((st) => st.stepNumber === stepNumber) || targetScn.steps[0];
      openDrawerForStep(step);
    }
  };

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
        <span className="text-sm font-medium text-white">Recent incidents</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            onClick={() => handleInspectIncident(inc.scenarioId, inc.stepNumber)}
            className="py-3 px-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white group-hover:text-zinc-200 transition-colors">
                  {inc.scenarioName}
                </span>
                {inc.provider && <ProviderBadge provider={inc.provider} size="sm" />}
              </div>
              <p className="text-zinc-400 text-[11px] line-clamp-1">"{inc.flagReason}"</p>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span className="text-zinc-300 font-medium">{inc.stepName}</span>
                <span>•</span>
                <span>{inc.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <StatusBadge type="severity" value={inc.severity} size="sm" />

              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] uppercase font-medium border',
                  inc.status === 'corrected'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : inc.status === 'in_review'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    : 'bg-red-500/10 text-red-300 border-red-500/20'
                )}
              >
                {inc.status === 'corrected'
                  ? '✓ Corrected'
                  : inc.status === 'in_review'
                  ? 'In Review'
                  : 'Unresolved'}
              </span>

              <button
                className="p-1 rounded bg-zinc-900 border border-white/[0.08] text-zinc-400 group-hover:text-white transition-colors"
                title="Inspect in detail"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
