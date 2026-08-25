import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Mic, CreditCard, Building2, Bot, Play, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const GenerativePromptBar: React.FC = () => {
  const {
    currentScenario,
    setCurrentScenarioById,
    playbackState,
    playRun,
    resetRun,
  } = useAgentRun();

  const [customInput, setCustomInput] = useState<string>('');

  const promptChips = [
    {
      id: 'SCN-3094',
      label: '🎙️ ElevenLabs Voice Trap',
      icon: Mic,
      color: 'text-sky-400',
      provider: 'elevenlabs',
      desc: 'Live audio stream competitor price negotiation',
    },
    {
      id: 'SCN-4112',
      label: '🦤 Dodo Payments Rail Breach',
      icon: CreditCard,
      color: 'text-amber-400',
      provider: 'dodo_payments',
      desc: 'Double-charge dispute with single captured charge',
    },
    {
      id: 'SCN-5221',
      label: '⚡ Freshworks P0 Auto-Close',
      icon: Building2,
      color: 'text-purple-400',
      provider: 'freshworks_studio',
      desc: 'Enterprise P0 outage ticket escalation',
    },
  ];

  const handleSelectChip = (scenarioId: string) => {
    setCurrentScenarioById(scenarioId);
    setTimeout(() => {
      playRun();
    }, 150);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    playRun();
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-4 space-y-3 font-mono text-xs shadow-modal-depth">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase text-zinc-500 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          Select Integration Scenario
        </span>
        <span className="text-[10px] text-zinc-600">
          ElevenLabs · Dodo Payments · Freshworks
        </span>
      </div>

      {/* Scenario Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {promptChips.map((chip) => {
          const isSelected = currentScenario.id === chip.id;
          const Icon = chip.icon;
          return (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              key={chip.id}
              onClick={() => handleSelectChip(chip.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all duration-150 shrink-0 cursor-pointer relative',
                isSelected
                  ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'bg-zinc-900/60 border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.2]'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="chipHighlight"
                  className="absolute inset-0 rounded-xl border border-white"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn('w-3.5 h-3.5 relative z-10', isSelected ? 'text-black' : chip.color)} />
              <span className="relative z-10">{chip.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Prompt Command Input */}
      <form onSubmit={handleCustomSubmit} className="relative flex items-center">
        <div className="absolute left-3 text-zinc-500">
          <Bot className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder={`Stream: "${currentScenario.userPrompt.slice(0, 60)}..."`}
          className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-white/[0.08] bg-black/60 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/[0.2] transition-colors"
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={playRun}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{playbackState === 'running' ? 'Streaming' : 'Probe'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
