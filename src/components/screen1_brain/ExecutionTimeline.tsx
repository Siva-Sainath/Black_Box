import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const ExecutionTimeline: React.FC = () => {
  const { currentScenario, currentStepIndex, openDrawerForStep } = useAgentRun();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.2 } }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/50 backdrop-blur-md p-3.5 shadow-2xl">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-medium text-zinc-300">Execution timeline</span>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2"
      >
        {currentScenario.steps.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isPassed = currentStepIndex > idx;
          const isFlagged = step.status === 'flagged';
          const isVerified = step.status === 'verified';

          return (
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={step.stepNumber}
              onClick={() => openDrawerForStep(step)}
              className={cn(
                'group relative flex flex-col text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer overflow-hidden',
                isCurrent && isFlagged
                  ? 'bg-red-500/10 border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(255,34,68,0.2)] ring-1 ring-red-500/30'
                  : isCurrent
                  ? 'bg-zinc-800/80 border-white/[0.2] text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : isPassed && isFlagged
                  ? 'bg-red-950/20 border-red-900/40 text-red-300'
                  : isPassed
                  ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-300'
                  : isVerified
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-zinc-900/40 border-white/[0.06] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200'
              )}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-medium text-zinc-500">
                  0{step.stepNumber}
                </span>

                {isFlagged ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    FLAG
                  </span>
                ) : isVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    FIXED
                  </span>
                ) : isPassed ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                )}
              </div>

              {/* Step Title */}
              <div className="text-xs font-medium leading-snug line-clamp-1 text-zinc-100 group-hover:text-white transition-colors">
                {step.stepName}
              </div>

              {/* Bottom Meta */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{step.latencyMs}ms</span>
                <span
                  className={cn(
                    'font-medium',
                    step.confidenceScore < 50 ? 'text-red-400' : 'text-zinc-400'
                  )}
                >
                  {step.confidenceScore}% conf
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};
