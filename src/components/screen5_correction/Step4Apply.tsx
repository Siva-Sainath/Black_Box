import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { HardDrive, CheckCircle2, RotateCw, Sparkles, ArrowRight } from 'lucide-react';

interface Step4ApplyProps {
  onNext: () => void;
}

export const Step4Apply: React.FC<Step4ApplyProps> = ({ onNext }) => {
  const {
    applyMemoryRule,
    isApplyingMemory,
    isMemoryApplied,
  } = useAgentRun();

  const handleApplyClick = async () => {
    await applyMemoryRule();
  };

  return (
    <div className="space-y-4 animate-fade-in font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-zinc-400" />
            Step 4: Synaptic Memory Absorption
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">
            Commit the synthesized rule into the agent's long-term vector store and active synaptic weights.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-8 flex flex-col items-center justify-center min-h-[360px] text-center relative overflow-hidden">
        {/* Restrained Brain Motif Memory Absorption Animation Canvas */}
        <div className="relative w-64 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="absorptionGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Restrained brain outline */}
            <path
              d="M 50 18 C 36 17, 24 26, 22 42 C 20 54, 24 68, 30 76 C 36 84, 44 86, 50 86 C 56 86, 64 84, 70 76 C 76 68, 80 54, 78 42 C 76 26, 64 17, 50 18 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />

            {/* Faint Nodes */}
            <circle cx="32" cy="38" r="2" fill="#27272a" />
            <circle cx="28" cy="58" r="2" fill="#27272a" />
            <circle cx="50" cy="28" r="2" fill="#27272a" />
            <circle cx="50" cy="50" r="3" fill={isMemoryApplied ? '#10B981' : '#ffffff'} />
            <circle cx="72" cy="38" r="2" fill="#27272a" />
            <circle cx="72" cy="58" r="2" fill="#27272a" />
            <circle cx="50" cy="74" r="2" fill="#27272a" />

            <line x1="32" y1="38" x2="50" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            <line x1="50" y1="28" x2="50" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            <line x1="72" y1="38" x2="50" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            <line x1="50" y1="50" x2="50" y2="74" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

            {/* Pulse traveling into the brain outline and settling */}
            {isApplyingMemory && (
              <circle r="2.5" fill="#ffffff">
                <animateMotion
                  path="M 50 5 Q 50 25 50 50"
                  dur="1.0s"
                  repeatCount="1"
                  fill="freeze"
                />
              </circle>
            )}

            {/* Absorption Ripple when Applied */}
            {isMemoryApplied && (
              <circle cx="50" cy="50" r="14" fill="url(#absorptionGlow)" className="animate-ping opacity-60" />
            )}
          </svg>
        </div>

        {/* Status Text & Actions */}
        <div className="max-w-md space-y-2.5 z-10">
          <h3 className="font-semibold text-sm text-white">
            {isMemoryApplied
              ? 'Memory Absorption Committed (RULE-402 Active)'
              : isApplyingMemory
              ? 'Injecting Synaptic Patch & Re-indexing...'
              : 'Ready to Commit Rule into Agent Memory'}
          </h3>

          <p className="text-xs text-zinc-400">
            {isMemoryApplied
              ? 'Synaptic weight patch has been written to the persistent vector store. Now proceed to verify this fix in the sandbox harness.'
              : 'This will bind the carrier status invariant directly into the agent’s deliberative planner module.'}
          </p>

          <div className="pt-2">
            {!isMemoryApplied ? (
              <button
                onClick={handleApplyClick}
                disabled={isApplyingMemory}
                className="inline-flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-5 py-2 font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                {isApplyingMemory ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Absorbing Rule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Add to Agent's Memory</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 px-5 py-2 font-semibold transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Proceed to Step 5: Verify Fix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
