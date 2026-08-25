import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { cn } from '../../utils/cn';

export const StepStrip: React.FC = () => {
  const { currentScenario, currentStepIndex, openDrawerForStep } = useAgentRun();

  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#111827]/95 p-2">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-0.5">
        {currentScenario.steps.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isPassed = currentStepIndex > idx;
          const isFlagged = step.status === 'flagged';
          const isVerified = step.status === 'verified';

          return (
            <button
              key={step.stepNumber}
              onClick={() => openDrawerForStep(step)}
              className={cn(
                'shrink-0 flex items-center gap-2 px-3 py-2 rounded-md border text-left transition-colors min-w-[7.5rem] max-w-[11rem]',
                isCurrent && isFlagged
                  ? 'bg-red-500/15 border-red-500/50 text-red-200'
                  : isCurrent
                  ? 'bg-zinc-800 border-white/20 text-white'
                  : isPassed && isFlagged
                  ? 'bg-red-950/30 border-red-900/40 text-red-300'
                  : isPassed || isVerified
                  ? 'bg-emerald-950/30 border-emerald-800/35 text-emerald-300'
                  : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/12 hover:text-zinc-200'
              )}
            >
              <span className="text-[10px] font-mono text-zinc-500">
                {String(step.stepNumber).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium truncate">{step.stepName}</span>
              {isFlagged && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
