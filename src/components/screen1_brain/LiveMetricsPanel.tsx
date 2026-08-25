import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { BRAIN_NODES_3D } from '../../data/mockNodes';
import { Activity, Brain, Radio, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const LiveMetricsPanel: React.FC = () => {
  const { currentStepIndex, currentScenario } = useAgentRun();
  const currentStep = currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;
  const currentNode = currentStep ? BRAIN_NODES_3D.find(n => n.id === currentStep.nodeId) || BRAIN_NODES_3D[0] : null;
  const sae = currentNode ? currentNode.saeFeature : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, bounce: 0 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-4 font-mono text-xs shadow-2xl"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <span className="font-semibold text-zinc-200 flex items-center gap-2 text-xs">
          <Brain className="w-3.5 h-3.5 text-zinc-400" />
          SAE Autoencoder Stream
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          65K LATENTS
        </span>
      </motion.div>

      {/* Metric 1: Active SAE Latent Amplitude */}
      <motion.div variants={itemVariants} className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] space-y-1.5 relative overflow-hidden">
        {sae && sae.activationSigma > 3.0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: 'mirror' }}
            className="absolute inset-0 bg-red-500 pointer-events-none" 
          />
        )}
        <div className="flex items-center justify-between text-zinc-400 text-[11px] relative z-10">
          <span>Active SAE Latent Probe</span>
          <span className={cn('font-bold transition-colors', sae && sae.activationSigma > 3.0 ? 'text-red-400' : 'text-white')}>
            {sae ? `+${sae.activationSigma}σ` : '+0.12σ'}
          </span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden relative z-10">
          <motion.div
            layout
            className={cn(
              'h-full rounded-full transition-colors duration-300 shadow-sm',
              sae && sae.activationSigma > 3.0 ? 'bg-red-500' : 'bg-white'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (sae ? sae.activationSigma / 5 : 0.1) * 100)}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 relative z-10">
          <span className="text-zinc-300 truncate max-w-[170px]">{sae ? sae.featureId : 'Layer 28 Residual'}</span>
          <span className={sae && sae.activationSigma > 3.0 ? 'text-red-400 font-semibold animate-pulse' : 'text-zinc-400'}>
            {sae && sae.activationSigma > 3.0 ? 'CRITICAL OUTLIER' : 'NOMINAL'}
          </span>
        </div>
      </motion.div>

      {/* Metric 2: Mean Time to Catch */}
      <motion.div variants={itemVariants} className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
        <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1.5">
          <span>Mean Time to Catch (MTTC)</span>
          <span className="text-white font-bold">164 ms</span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '82%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-emerald-400 h-full rounded-full" 
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
          <span>Residual Stream Probe</span>
          <span>Overhead: &lt;14ms</span>
        </div>
      </motion.div>

      {/* Metric 3: Active Memory Guardrails */}
      <motion.div variants={itemVariants} className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
        <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
          <span>Active Memory Rules</span>
          <span className="text-amber-400 font-bold">
            {currentScenario.hasActiveCorrection ? '29 Active' : '28 Active'}
          </span>
        </div>
        <div className="text-[10px] text-zinc-400 mt-1">
          {currentScenario.hasActiveCorrection ? (
            <span className="text-emerald-400 font-medium">✓ RULE-402 (Carrier Ground-Truth) Injected</span>
          ) : (
            <span>Standard Tier-1 Production Baseline</span>
          )}
        </div>
      </motion.div>

      {/* Quick Prompt Context Preview (Removed to avoid duplication with Generative Stream) */}
    </motion.div>
  );
};
