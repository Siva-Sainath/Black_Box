import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { ScenarioCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { LiveAgentArena } from './LiveAgentArena';
import { StudioIntegrationsHub } from './StudioIntegrationsHub';
import {
  Play,
  Search,
  RotateCw,
  Layers,
  Sparkles,
  Bot,
  Plug,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const ScenarioLibrary: React.FC = () => {
  const {
    scenarios,
    currentScenario,
    setCurrentScenarioById,
    setCurrentScreen,
    playRun,
    isBatchRunning,
    runBatchSimulation,
    batchProgress,
  } = useAgentRun();

  const [activeTab, setActiveTab] = useState<'all' | 'trap' | 'clean' | 'edge_case' | 'integrations'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredScenarios = scenarios.filter((scn) => {
    if (activeTab === 'integrations') {
      return scn.provider === 'elevenlabs' || scn.provider === 'dodo_payments' || scn.provider === 'freshworks_studio';
    }
    const matchesTab = activeTab === 'all' || scn.category === activeTab;
    const matchesSearch =
      scn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scn.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSelectAndReplay = (id: string) => {
    setCurrentScenarioById(id);
    setCurrentScreen('screen1_brain');
    setTimeout(() => {
      playRun();
    }, 150);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Live Multi-Agent Arena & Progress Visualizer */}
      <LiveAgentArena />

      {/* 2. Studio Integrations Hub (ElevenLabs, Dodo Payments, Freshworks Studio) */}
      <StudioIntegrationsHub />

      {/* 3. High-Density Empirical Test Harness Ledger */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-5 space-y-4 font-mono text-xs shadow-modal-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.1] text-white">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Empirical Evaluation Ledger & Invariants
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-1">
              Deterministic ground-truth benchmarks verifying epistemic certainty, carrier webhooks, and tool permissions.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/[0.08] overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0',
                activeTab === 'all'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              All Evals ({scenarios.length})
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0',
                activeTab === 'integrations'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Studio Evals (3)
            </button>
            <button
              onClick={() => setActiveTab('trap')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0',
                activeTab === 'trap'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Trap Cases (3)
            </button>
            <button
              onClick={() => setActiveTab('clean')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0',
                activeTab === 'clean'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Clean (1)
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter scenarios by name, ID, or invariant keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-black/60 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/[0.2]"
          />
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/40">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Scenario ID & Platform</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Ground-Truth Invariant</th>
                <th className="py-3 px-4 font-semibold">Judge Verdict</th>
                <th className="py-3 px-4 font-semibold">Latency</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredScenarios.map((scn) => {
                const isSelected = currentScenario.id === scn.id;
                return (
                  <tr
                    key={scn.id}
                    className={cn(
                      'hover:bg-white/[0.02] transition-colors group cursor-pointer',
                      isSelected && 'bg-white/[0.04]'
                    )}
                    onClick={() => handleSelectAndReplay(scn.id)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {scn.name}
                        </span>
                        {scn.provider && scn.provider !== 'native' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                            {scn.provider === 'elevenlabs' ? '🎙️ ElevenLabs' : scn.provider === 'dodo_payments' ? '🦤 Dodo' : '⚡ Freshworks'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <span className="text-zinc-400">{scn.id}</span>
                        <span>•</span>
                        <span className="truncate max-w-sm">{scn.description}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge type="category" value={scn.category} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-zinc-300 text-[11px] leading-snug line-clamp-2">
                        "{scn.groundTruthExpected}"
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge type="result" value={scn.lastRunResult} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">{scn.latencyMs}ms</td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndReplay(scn.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] px-3 py-1.5 text-xs text-zinc-200 hover:text-white hover:border-white/[0.2] transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Prober</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
