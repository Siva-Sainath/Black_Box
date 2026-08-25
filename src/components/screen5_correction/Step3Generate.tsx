import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Sparkles, Code2, ArrowRight, Edit3, Info } from 'lucide-react';

interface Step3GenerateProps {
  onNext: () => void;
}

export const Step3Generate: React.FC<Step3GenerateProps> = ({ onNext }) => {
  const { activeCorrectionRule, setActiveCorrectionRule } = useAgentRun();

  const generatedPythonCode = `@blackbox.guardrail(
    rule_id="RULE-402",
    target_action="dodo_execute_refund",
    priority="CRITICAL_BLOCKING"
)
async def enforce_carrier_status_verification(context: ExecutionContext):
    """
    Synthesized Rule: Enforces courier tracking check prior to refund release.
    """
    if context.amount_usd > 100.0:
        tracking_event = await courier_client.get_status(context.order_id)
        if tracking_event.status != CourierStatus.DELIVERED_CONFIRMED:
            raise UnverifiedRefundAttemptError(
                f"Cannot refund {context.order_id}: package status is '{tracking_event.status}'."
            )
`;

  return (
    <div className="space-y-4 animate-fade-in font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            Step 3: Synthesize Corrective Rule
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">
            The engine proposes an actionable natural language rule. You can edit this rule directly.
          </p>
        </div>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-white/[0.06]">
          Rule ID: RULE-402
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Natural Language Rule (Editable) */}
        <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <Edit3 className="w-4 h-4 text-zinc-400" />
              <span>Natural Language Memory Directive (Editable)</span>
            </div>
            <span className="text-[10px] text-zinc-500">Synaptic Prompt Weights</span>
          </div>

          <div className="space-y-2">
            <textarea
              value={activeCorrectionRule}
              onChange={(e) => setActiveCorrectionRule(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-white/[0.08] bg-black p-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-white/[0.2] leading-relaxed shadow-inner"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span>This plain-English directive is compiled into the agent's episodic retrieval index.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500">Target Cognitive Module:</span>
            <span className="rounded bg-zinc-900 border border-white/[0.08] px-2 py-0.5 text-zinc-200">
              node_tool (Tool Selection & Invocation)
            </span>
          </div>
        </div>

        {/* Right: Compiled Guardrail Logic */}
        <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <Code2 className="w-4 h-4 text-zinc-400" />
              <span>Compiled Runtime Guardrail Hook</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">AST Validated</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black p-3 max-h-56 overflow-y-auto">
            <pre className="text-[11px] text-zinc-300 leading-relaxed">
              <code>{generatedPythonCode}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Execution Overhead:</span>
            <span className="text-emerald-400 font-bold">1.4ms (Async Hook)</span>
          </div>
        </div>
      </div>

      {/* Action Next */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-5 py-2 font-semibold transition-colors shadow-sm"
        >
          <span>Apply to Agent's Memory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
