import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { FeatureInspector } from './FeatureInspector';
import { SaeFeatureInspector } from './SaeFeatureInspector';
import { ProviderBadge } from '../common/ProviderBadge';
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

  const [activeTab, setActiveTab] = useState<'trace' | 'mechanism'>('trace');

  if (!isDrawerOpen || !selectedStepForDrawer) return null;

  const step = selectedStepForDrawer;
  const isFlagged = step.status === 'flagged';
  const isVerified = step.status === 'verified';
  const node3d = BRAIN_NODES_3D.find((n) => n.id === step.nodeId) || BRAIN_NODES_3D[4];
  const saeDetails = node3d.saeFeature;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-x-0 top-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm chrome-detail-overlay"
      >
        <div className="flex-1 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#09090b] border-l border-white/[0.08] shadow-modal-depth flex flex-col h-full overflow-hidden"
        >
          <div
            className={cn(
              'p-5 border-b flex items-start justify-between',
              isFlagged ? 'bg-red-500/[0.04] border-red-500/20' : 'border-white/[0.08]'
            )}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border shrink-0',
                  isFlagged
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-800 border-white/[0.08] text-zinc-300'
                )}
              >
                {isFlagged ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded border',
                      isFlagged
                        ? 'bg-red-500/10 text-red-300 border-red-500/20'
                        : isVerified
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border-white/[0.08]'
                    )}
                  >
                    {isFlagged ? 'Flagged' : isVerified ? 'Verified' : 'OK'}
                  </span>
                  <ProviderBadge provider={currentScenario.provider} />
                  <span className="text-xs text-zinc-500">
                    Step {step.stepNumber}/{step.totalSteps}
                  </span>
                </div>
                <h2 className="font-semibold text-sm text-white">{step.stepName}</h2>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 px-5 pt-2 border-b border-white/[0.08] bg-black/40">
            <button
              onClick={() => setActiveTab('trace')}
              className={cn(
                'flex items-center gap-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-colors',
                activeTab === 'trace'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              Trace
            </button>
            <button
              onClick={() => setActiveTab('mechanism')}
              className={cn(
                'flex items-center gap-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-colors',
                activeTab === 'mechanism'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Brain className="w-3.5 h-3.5" />
              Mechanism
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isFlagged && step.flagReason && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-red-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Violation caught
                </div>
                <p className="text-sm text-red-200 leading-relaxed">{step.flagReason}</p>
              </div>
            )}

            {activeTab === 'trace' && (
              <div className="space-y-4 text-xs">
                <div className="ui-card p-4">
                  <p className="text-[11px] text-zinc-500 mb-2">Reasoning</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{step.reasoning}</p>
                </div>

                {step.toolCall && (
                  <div className="ui-card p-4 space-y-2">
                    <p className="text-[11px] text-zinc-500">Tool call</p>
                    <code className="text-[11px] text-zinc-300 font-mono block p-2 rounded-lg bg-black border border-white/[0.06]">
                      {step.toolCall.name}({JSON.stringify(step.toolCall.args)})
                    </code>
                  </div>
                )}

                {step.toolResult && (
                  <div className="ui-card p-4 space-y-2">
                    <p className="text-[11px] text-zinc-500">Tool result</p>
                    <pre className="text-[11px] text-zinc-400 font-mono p-2 rounded-lg bg-black border border-white/[0.06] overflow-x-auto">
                      {JSON.stringify(step.toolResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mechanism' && (
              <div className="space-y-4">
                <SaeFeatureInspector saeFeature={saeDetails} isFlagged={isFlagged} />
                <FeatureInspector signals={step.internalSignals} isFlagged={isFlagged} />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/[0.08] bg-black/60 flex items-center justify-between">
            {isFlagged ? (
              <button
                onClick={startCorrectionFlowForCurrentScenario}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-medium"
              >
                Create memory rule
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
