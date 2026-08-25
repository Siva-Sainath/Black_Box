import React, { useEffect, useState } from 'react';
import { Layers, Bot } from 'lucide-react';
import { BrainScene } from './screen1_brain/BrainScene';
import { ScenarioDrawer } from './screen1_brain/ScenarioDrawer';
import { AgentRunDrawer } from './screen1_brain/AgentRunDrawer';
import { TransportDock } from './screen1_brain/TransportDock';
import { useAgentRun } from '../context/AgentRunContext';

export const ProberLayout: React.FC = () => {
  const { playbackState } = useAgentRun();
  const [scenariosOpen, setScenariosOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  useEffect(() => {
    if (playbackState === 'running' || playbackState === 'flagged') {
      setAgentOpen(true);
    }
  }, [playbackState]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        setScenariosOpen((o) => !o);
      }
      if (e.key === 'a' || e.key === 'A') {
        setAgentOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 prober-ambient overflow-hidden">
      {/* Canvas + floating chrome — drawers end above the transport dock */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div className="prober-orbs pointer-events-none absolute inset-0 z-0" aria-hidden />

        <div className="absolute inset-0 z-[1]">
          <BrainScene />
        </div>

        <ScenarioDrawer open={scenariosOpen} onClose={() => setScenariosOpen(false)} />
        <AgentRunDrawer open={agentOpen} onClose={() => setAgentOpen(false)} />

        {!scenariosOpen && (
          <button
            type="button"
            onClick={() => setScenariosOpen(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-25 glass-card rounded-full px-4 py-3 flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-white transition-colors"
            style={{ zIndex: 25 }}
            title="Scenarios (S)"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </button>
        )}

        {!agentOpen && (
          <button
            type="button"
            onClick={() => setAgentOpen(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 glass-card rounded-full px-4 py-3 flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-white transition-colors"
            style={{ zIndex: 25 }}
            title="Agent run (A)"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Agent run</span>
          </button>
        )}
      </div>

      <TransportDock />
    </div>
  );
};
