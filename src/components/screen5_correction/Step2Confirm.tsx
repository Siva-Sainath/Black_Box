import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { ArrowRight, UserCheck, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Step2ConfirmProps {
  onNext: () => void;
}

export const Step2Confirm: React.FC<Step2ConfirmProps> = ({ onNext }) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(true);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<string>('unsupported_claim');
  const [notes, setNotes] = useState<string>(
    'Confirmed genuine hallucination / premature mutation without courier verification. Requires strict guardrail hook.'
  );

  return (
    <div className="space-y-4 animate-fade-in font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-zinc-400" />
            Step 2: Human-in-the-Loop Confirmation
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">
            Validate whether this caught flag represents a true failure or a false alarm.
          </p>
        </div>
        <span className="text-xs text-zinc-400">
          Evaluator: <span className="text-emerald-400 font-bold">Admin (Senior ML Engineer)</span>
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5 space-y-5">
        {/* Decision Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
            Failure Classification Decision
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setIsConfirmed(true)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border text-left text-xs transition-all',
                isConfirmed
                  ? 'bg-red-500/10 border-red-500/30 text-red-200'
                  : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/[0.12]'
              )}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <span className="font-semibold text-white block mb-0.5">
                  Confirm as Genuine Mistake (True Positive)
                </span>
                <span className="text-zinc-400 text-[11px] leading-snug">
                  The agent violated safety / ground-truth policy. Proceed to synthesize persistent memory rule.
                </span>
              </div>
            </button>

            <button
              onClick={() => setIsConfirmed(false)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border text-left text-xs transition-all',
                !isConfirmed
                  ? 'bg-zinc-800 border-white/[0.2] text-white'
                  : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/[0.12]'
              )}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3" />
              </div>
              <div>
                <span className="font-semibold text-white block mb-0.5">
                  Mark as False Alarm (Allow Override)
                </span>
                <span className="text-zinc-400 text-[11px] leading-snug">
                  The agent's reasoning was contextually acceptable. Calibrate probe threshold.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Taxonomy selection */}
        {isConfirmed && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Taxonomy Classification (Research Taxonomy)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'unsupported_claim', label: 'Unsupported Claim', desc: 'Concluded lost status without proof' },
                { id: 'coordination_gap', label: 'Coordination Gap', desc: 'Missing webhook listener sync' },
                { id: 'premature_action', label: 'Premature Action', desc: 'Dispatched $450 Dodo Payments refund early' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTaxonomy(item.id)}
                  className={cn(
                    'p-3 rounded-lg border text-left text-xs transition-colors',
                    selectedTaxonomy === item.id
                      ? 'bg-zinc-800 border-white/[0.2] text-white font-semibold'
                      : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/[0.12]'
                  )}
                >
                  <div className="text-zinc-200 mb-0.5">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reviewer Note */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
            Audit Trail Notes (Persisted to Vector Store)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-white/[0.08] bg-black p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white/[0.2]"
          />
        </div>
      </div>

      {/* Action Next */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-5 py-2 font-semibold transition-colors shadow-sm"
        >
          <span>Generate Corrective Rule</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
