import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { StatusBadge } from '../common/StatusBadge';
import { Layers, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const ScenarioLedger: React.FC = () => {
  const {
    scenarios,
    currentScenario,
    setCurrentScenarioById,
    playbackState,
  } = useAgentRun();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-4 flex flex-col h-[500px] font-mono text-xs shadow-modal-depth">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Execution Ledger
          </h2>
        </div>
        <span className="rounded-md bg-zinc-900 border border-white/[0.06] px-2 py-0.5 text-zinc-400 text-[10px]">
          {scenarios.length} Nodes
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        <motion.ul layout className="space-y-2">
          <AnimatePresence>
            {scenarios.map((scn) => {
              const isSelected = currentScenario.id === scn.id;
              return (
                <motion.li
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={scn.id}
                  onClick={() => setCurrentScenarioById(scn.id)}
                  className={cn(
                    'p-3 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden',
                    isSelected
                      ? 'bg-zinc-900/90 border-white/[0.2] shadow-sm'
                      : 'bg-black/40 border-white/[0.04] hover:bg-zinc-900/50 hover:border-white/[0.12]'
                  )}
                >
                  {/* Active Indicator Beams */}
                  {isSelected && playbackState === 'running' && (
                    <motion.div
                      layoutId="activeBeam"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  )}
                  {isSelected && playbackState === 'flagged' && (
                    <motion.div
                      layoutId="flaggedBeam"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_10px_rgba(255,34,68,0.5)]"
                    />
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          'font-bold text-[11px] uppercase tracking-wide transition-colors',
                          isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                        )}
                      >
                        {scn.id}
                      </span>
                      <span className="text-[10px] text-zinc-500 max-w-[140px] truncate">
                        {scn.name}
                      </span>
                    </div>
                    {scn.provider && scn.provider !== 'native' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-black/60 text-zinc-400 border border-white/[0.08]">
                        {scn.provider === 'elevenlabs' ? '11L' : scn.provider === 'dodo_payments' ? 'DODO' : 'FRESH'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge type="category" value={scn.category} size="sm" />
                    {isSelected && (
                      <span className="text-zinc-500">
                        <Zap className={cn('w-3.5 h-3.5', playbackState === 'running' ? 'text-emerald-400 animate-pulse' : playbackState === 'flagged' ? 'text-red-400' : 'text-zinc-500')} />
                      </span>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Invariant</span>
        </div>
        <p className="text-[10px] text-zinc-300 font-sans italic leading-relaxed line-clamp-3">
          "{currentScenario.groundTruthExpected}"
        </p>
      </div>
    </div>
  );
};
