import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Play, Sparkles, Terminal, Activity, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  const {
    currentScenario,
    playbackState,
    playRun,
    openDrawerForStep,
    setCurrentScreen,
    setIsBackendModalOpen,
  } = useAgentRun();

  const flaggedStep = currentScenario.steps.find((s) => s.status === 'flagged') || currentScenario.steps[4];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0, duration: 0.5 } }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070709] p-6 sm:p-8 mb-4">
      {/* Subtle top ambient specular light (Cursor / Brex style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[240px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        {/* Left Editorial Header */}
        <div className="max-w-3xl space-y-3">
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Mechanistic Observability Platform
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-zinc-400">Sparse Autoencoder (SAE) Dictionary Probe</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
            Observability into agent cognition. Catch flawed reasoning before it reaches production.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-2xl">
            Real-time 3D cortical tractography and residual stream probing. Detect unverified claims, coordination gaps, and hallucinated actions at the circuit layer.
          </motion.p>

          {/* Quick Action CTAs (Cursor / Brex style) */}
          <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={playRun}
              className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-4 py-2 text-xs font-medium transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{playbackState === 'idle' ? 'Run Live Diagnostic' : 'Resume Stream'}</span>
            </button>

            {flaggedStep && (
              <button
                onClick={() => openDrawerForStep(flaggedStep)}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 hover:text-white hover:border-white/[0.2] px-4 py-2 text-xs font-medium transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Inspect SAE Latent L28.14892 (+4.82σ)</span>
              </button>
            )}

            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-transparent text-zinc-400 hover:text-white px-3 py-2 text-xs font-mono transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Integration & Sidecar Spec →</span>
            </button>
          </motion.div>
        </div>

        {/* Right Live KPI Stat Summary (Brex style live ticker) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:w-80 shrink-0 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 block">Flagged Error Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">14.2%</span>
              <span className="text-[10px] text-emerald-400">-17.2%</span>
            </div>
            <span className="text-[10px] text-zinc-500">vs base cold-start</span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 block">Mean Time to Catch</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">164 ms</span>
              <span className="text-[10px] text-emerald-400">-76ms</span>
            </div>
            <span className="text-[10px] text-zinc-500">&lt;14ms overhead</span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 block">SAE Latent Dictionary</span>
            <span className="text-xl font-bold text-white block">65,536</span>
            <span className="text-[10px] text-zinc-500">Monosemantic latents</span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 block">Active Memory Rules</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">28</span>
              <span className="text-[10px] text-zinc-500">enforced globally</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
