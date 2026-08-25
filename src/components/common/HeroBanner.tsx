import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SponsorShowcase } from './SponsorShowcase';

export const HeroBanner: React.FC = () => {
  const { playbackState, playRun, setCurrentScreen } = useAgentRun();

  return (
    <section className="relative overflow-hidden ui-card-elevated p-6 sm:p-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[11px] text-zinc-300">
            <Sparkles className="w-3 h-3" />
            Agent observability
          </span>
        </div>

        <h1 className="text-display text-white max-w-2xl">
          Catch flawed agent reasoning before it reaches production
        </h1>

        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
          Real-time neural probing and eval sandboxes for voice, fintech, and enterprise agents—built for hackathon partners ElevenLabs, Freshworks, and Dodo Payments.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => {
              setCurrentScreen('screen1_brain');
              setTimeout(() => playRun(), 100);
            }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
          >
            <Play className="w-4 h-4 fill-current" />
            {playbackState === 'idle' ? 'Run live diagnostic' : 'Open Prober'}
          </button>
        </div>

        <div className="pt-2">
          <SponsorShowcase compact />
        </div>
      </motion.div>
    </section>
  );
};
