import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { FeatureInspector } from './FeatureInspector';
import { SaeFeatureInspector } from './SaeFeatureInspector';
import { BRAIN_NODES_3D } from '../../data/mockNodes';
import { cn } from '../../utils/cn';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldAlert,
  Brain,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThoughtDetailDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    selectedStepForDrawer,
    currentScenario,
    startCorrectionFlowForCurrentScenario,
  } = useAgentRun();

  const [activeTab, setActiveTab] = useState<'sae' | 'signals' | 'io'>('sae');

  if (!isDrawerOpen || !selectedStepForDrawer) return null;

  const step = selectedStepForDrawer;
  const isFlagged = step.status === 'flagged';
  const isVerified = step.status === 'verified';

  const node3d = BRAIN_NODES_3D.find((n) => n.id === step.nodeId) || BRAIN_NODES_3D[4];
  const saeDetails = node3d.saeFeature;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="flex-1 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />

        {/* Drawer Panel (Cursor / Linear Style) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#09090b] border-l border-white/[0.08] shadow-modal-depth flex flex-col h-full overflow-hidden"
        >
          {/* Header Bar */}
          <div
            className={cn(
              'p-5 border-b flex items-start justify-between transition-colors',
              isFlagged
                ? 'bg-red-500/[0.04] border-red-500/20'
                : isVerified
                ? 'bg-emerald-500/[0.04] border-emerald-500/20'
                : 'border-white/[0.08]'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border',
                  isFlagged
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-800 border-white/[0.08] text-zinc-300'
                )}
              >
                {isFlagged ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-mono text-[11px] font-medium px-2 py-0.5 rounded border',
                      isFlagged
                        ? 'bg-red-500/10 text-red-300 border-red-500/20'
                        : isVerified
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border-white/[0.08]'
                    )}
                  >
                    {isFlagged ? 'Mechanistic Anomaly' : isVerified ? 'Verified Fix' : 'Nominal Layer Probe'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Step {step.stepNumber} of {step.totalSteps}
                  </span>
                </div>

                <h2 className="mt-1 font-semibold text-sm text-white">
                  {step.stepName}
                </h2>
                <div className="text-xs font-mono text-zinc-500 flex items-center gap-2 mt-0.5">
                  <span>Region: <span className="text-zinc-300">{node3d.anatomicalRegion}</span></span>
                  <span>•</span>
                  <span>SAE: <span className="text-zinc-300">{saeDetails.featureId}</span></span>
                </div>
              </div>
            </div>

            {/* Confidence Badge & Close */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex flex-col items-end px-2.5 py-1 rounded-md border font-mono',
                  step.confidenceScore < 50
                    ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-zinc-900 border-white/[0.08] text-zinc-200'
                )}
              >
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">Confidence</span>
                <span className="text-xs font-bold">{step.confidenceScore}%</span>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs (Cursor/Linear Style) */}
          <div className="flex items-center gap-1 px-5 pt-2 border-b border-white/[0.08] bg-[#070709]">
            <button
              onClick={() => setActiveTab('sae')}
              className={cn(
                'flex items-center gap-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-colors',
                activeTab === 'sae'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>SAE Feature Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('io')}
              className={cn(
                'flex items-center gap-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-colors',
                activeTab === 'io'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Deliberation & Tool Gap</span>
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={cn(
                'flex items-center gap-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-colors',
                activeTab === 'signals'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Signal Gauges</span>
            </button>
          </div>

          {/* Drawer Body - Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Flag Reason Alert Banner */}
            {isFlagged && step.flagReason && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Mechanistic Violation Caught</span>
                </div>
                <p className="text-xs text-red-200 font-medium leading-relaxed">
                  "{step.flagReason}"
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-red-400/80">
                  <span>Taxonomy:</span>
                  <span className="rounded bg-red-950/60 px-2 py-0.5 text-red-200 font-medium border border-red-700/40 uppercase">
                    {step.flagTaxonomy || 'unsupported_claim'}
                  </span>
                </div>
              </div>
            )}

            {/* TAB 1: SAE Profile */}
            {activeTab === 'sae' && (
              <SaeFeatureInspector saeFeature={saeDetails} isFlagged={isFlagged} />
            )}

            {/* TAB 2: Chain of Thought & Tool Gap */}
            {activeTab === 'io' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0e] p-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2.5">
                    <span className="font-semibold uppercase tracking-wider text-white">
                      Agent Deliberation (Chain-of-Thought)
                    </span>
                    <span className="text-[10px] text-zinc-500">Phase: {step.phase}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-black/60 p-3 rounded-lg border border-white/[0.06]">
                    {step.reasoning}
                  </p>
                </div>

                {(step.toolCall || step.toolResult) && (
                  <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0e] p-4 space-y-3">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold uppercase tracking-wider text-white">
                        Tool State vs Agent Assertion Gap
                      </span>
                    </div>

                    {step.toolCall && (
                      <div>
                        <span className="text-[10px] uppercase text-zinc-400 font-semibold block mb-1">
                          Invoked Tool Mutation:
                        </span>
                        <div className="p-2.5 rounded-lg bg-black border border-white/[0.06] text-zinc-200">
                          <code>{step.toolCall.name}({JSON.stringify(step.toolCall.args)})</code>
                        </div>
                      </div>
                    )}

                    {step.toolResult && (
                      <div>
                        <span className="text-[10px] uppercase text-zinc-400 font-semibold block mb-1">
                          Underlying Tool Result:
                        </span>
                        <div className="p-2.5 rounded-lg bg-black border border-white/[0.06] text-zinc-300">
                          <pre className="text-[11px]">
                            <code>{JSON.stringify(step.toolResult, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Feature Signals */}
            {activeTab === 'signals' && (
              <FeatureInspector signals={step.internalSignals} isFlagged={isFlagged} />
            )}
          </div>

          {/* Drawer Footer / CTA */}
          <div className="p-4 border-t border-white/[0.08] bg-[#070709] flex items-center justify-between font-mono text-xs">
            <div className="text-zinc-500">
              {isFlagged ? (
                <span className="text-red-400">Ready to synthesize SAE memory rule</span>
              ) : (
                <span>Neuron nominal</span>
              )}
            </div>

            {isFlagged ? (
              <button
                onClick={startCorrectionFlowForCurrentScenario}
                className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-4 py-2 font-medium transition-colors shadow-sm"
              >
                <span>Synthesize Fix in Screen 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-zinc-200 transition-colors"
              >
                Close Inspector
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
