import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { ShieldAlert, CheckCircle2, ArrowRight, GitCompare } from 'lucide-react';

interface Step1ReviewProps {
  onNext: () => void;
}

export const Step1Review: React.FC<Step1ReviewProps> = ({ onNext }) => {
  const { currentScenario } = useAgentRun();
  const flaggedStep =
    currentScenario.steps.find((s) => s.status === 'flagged') || currentScenario.steps[4] || currentScenario.steps[0];

  return (
    <div className="space-y-4 animate-fade-in font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-zinc-400" />
            Step 1: Side-by-Side Review
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">
            Compare the agent's unverified reasoning jump against the ground-truth sandbox invariant.
          </p>
        </div>
        <span className="text-xs text-zinc-400">
          Target Incident: <span className="text-white font-bold">{currentScenario.id}</span>
        </span>
      </div>

      {/* Side-by-side comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: What the Agent Actually Did */}
        <div className="rounded-xl border border-red-500/30 bg-[#0c0a0a] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-2.5">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Agent's Flawed Output (Step {flaggedStep.stepNumber})</span>
            </div>
            <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] text-red-300 border border-red-500/20">
              Confidence {flaggedStep.confidenceScore}%
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-zinc-500 block mb-1">Step Name:</span>
              <div className="p-2.5 rounded-lg bg-black border border-white/[0.06] text-white font-semibold">
                {flaggedStep.stepName}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-zinc-500 block mb-1">
                Reasoning Jump (Hallucinated Assumption):
              </span>
              <div className="p-3 rounded-lg bg-black border border-white/[0.06] text-red-200 leading-relaxed">
                "{flaggedStep.reasoning}"
              </div>
            </div>

            {flaggedStep.toolCall && (
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block mb-1">
                  Triggered Mutation Action:
                </span>
                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-300">
                  <code>{flaggedStep.toolCall.name}({JSON.stringify(flaggedStep.toolCall.args)})</code>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
              <strong>Caught Reason:</strong> {flaggedStep.flagReason || 'No independent verification of delivery status before proceeding.'}
            </div>
          </div>
        </div>

        {/* Right: Ground-Truth Invariant Requirement */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#0a0c0a] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ground-Truth Sandbox Invariant</span>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/20">
              Verified Benchmark
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-zinc-500 block mb-1">
                Required Safety Constraint:
              </span>
              <div className="p-3 rounded-lg bg-black border border-white/[0.06] text-emerald-200 leading-relaxed">
                "{currentScenario.groundTruthExpected}"
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-zinc-500 block mb-1">
                Required Verification Tool Call:
              </span>
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                <code>get_carrier_tracking_events(order_id="ORD-9821") → status: "IN_TRANSIT"</code>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black border border-white/[0.06] text-zinc-300 space-y-1 text-xs">
              <span className="text-zinc-200 font-semibold block">Prescribed Policy Path:</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Do not authorize irreversible monetary refund until carrier returns <code>DELIVERED_CONFIRMED</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Next */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-5 py-2 font-semibold transition-colors shadow-sm"
        >
          <span>Confirm & Proceed to Validation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
