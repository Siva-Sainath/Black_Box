import React from 'react';
import { useAgentRun } from '../context/AgentRunContext';
import { MOCK_SCENARIOS } from '../data/mockScenarios';
import { BrainCanvas3D } from './screen1_brain/BrainCanvas3D';
import { ExecutionTimeline } from './screen1_brain/ExecutionTimeline';
import { GenerativeStreamWidget } from './generative_ui/GenerativeStreamWidget';
import { Play, Activity, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveMetricsPanel } from './screen1_brain/LiveMetricsPanel';

export const SimplisticLayout: React.FC = () => {
  const {
    currentScenario,
    setCurrentScenarioById,
    playbackState,
    playRun,
  } = useAgentRun();

  const availableScenarios = MOCK_SCENARIOS;

  return (
    <div className="flex h-full w-full bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      {/* LEFT SIDEBAR: Agent Presets (Simplistic) */}
      <div className="w-64 sm:w-72 border-r border-white/[0.08] bg-[#09090b] p-4 flex flex-col gap-6 flex-shrink-0 relative z-20">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-bold text-lg shadow-sm">
            ▲
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight">BLACK BOX</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Evaluation Studio</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          <div className="px-1">
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-3">Agent Scenarios</h2>
            <div className="space-y-2">
              {availableScenarios.map((scenario: any) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setCurrentScenarioById(scenario.id);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                    currentScenario.id === scenario.id
                      ? "bg-white/[0.06] border-white/[0.15]"
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  )}
                >
                  {currentScenario.id === scenario.id && (
                    <motion.div layoutId="active-scenario-highlight" className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                  )}
                  <h3 className={cn("text-xs font-semibold mb-1", currentScenario.id === scenario.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>
                    {scenario.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 line-clamp-2">
                    {scenario.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER CANVAS: 3D Brain & Observability */}
      <div className="flex-1 relative bg-black overflow-hidden group">
        <BrainCanvas3D />
        
        <div className="absolute top-6 left-6 z-10 w-80">
          <LiveMetricsPanel />
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <ExecutionTimeline />
        </div>
      </div>

      {/* RIGHT SIDEBAR: Generative Stream & Chat */}
      <div className="w-[480px] flex-shrink-0 border-l border-white/[0.08] bg-[#070709] flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-300">Generative Output</span>
          </div>
          <button
            onClick={playRun}
            disabled={playbackState === 'running'}
            className="flex items-center gap-2 rounded-full bg-white text-black hover:bg-zinc-200 px-4 py-1.5 text-xs font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {playbackState === 'running' ? 'Simulating...' : 'Stream'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          {/* User Prompt */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 justify-end"
          >
            <div className="bg-zinc-800/80 text-zinc-100 text-sm px-5 py-3 rounded-2xl rounded-tr-sm max-w-[90%] border border-white/[0.05] shadow-sm leading-relaxed">
              {currentScenario.userPrompt}
            </div>
          </motion.div>

          {/* Agent Response Stream */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: playbackState !== 'idle' ? 1 : 0, x: playbackState !== 'idle' ? 0 : 10 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.15)] mt-1">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="text-sm text-zinc-300">
                {playbackState === 'idle' ? null : playbackState === 'running' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Analyzing intent and invoking tools...
                  </span>
                ) : (
                  "I have processed your request. Here are the details:"
                )}
              </div>
              
              {/* Generative UI Component Rendered Inline */}
              <AnimatePresence mode="popLayout">
                {playbackState !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', bounce: 0.15 }}
                    className="w-full"
                  >
                    <GenerativeStreamWidget />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
