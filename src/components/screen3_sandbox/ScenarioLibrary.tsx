import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { STUDIO_INTEGRATIONS } from '../../data/mockNodes';
import { StatusBadge } from '../common/StatusBadge';
import { ProviderBadge } from '../common/ProviderBadge';
import { LiveAgentArena } from './LiveAgentArena';
import { HeroBanner } from '../common/HeroBanner';
import {
  SponsorPlatformCard,
  IntegrationConfigModal,
} from '../common/SponsorPlatformCard';
import { Play, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AgentStudioIntegration } from '../../types';

export const ScenarioLibrary: React.FC = () => {
  const {
    scenarios,
    currentScenario,
    setCurrentScenarioById,
    setCurrentScreen,
    playRun,
  } = useAgentRun();

  const [evalTab, setEvalTab] = useState<'scenarios' | 'live'>('scenarios');
  const [searchQuery, setSearchQuery] = useState('');
  const [configModal, setConfigModal] = useState<AgentStudioIntegration | null>(null);

  const filteredScenarios = scenarios.filter((scn) => {
    const q = searchQuery.toLowerCase();
    return (
      scn.name.toLowerCase().includes(q) ||
      scn.id.toLowerCase().includes(q) ||
      scn.description.toLowerCase().includes(q)
    );
  });

  const handleRunIntegration = (sandboxId: string) => {
    setCurrentScenarioById(sandboxId);
    setCurrentScreen('screen1_brain');
    setTimeout(() => playRun(), 150);
  };

  const handleSelectAndReplay = (id: string) => {
    setCurrentScenarioById(id);
    setCurrentScreen('screen1_brain');
    setTimeout(() => playRun(), 150);
  };

  return (
    <div className="space-y-6">
      <HeroBanner />

      {/* Sponsor platform cards — ElevenLabs-style glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STUDIO_INTEGRATIONS.map((integration, i) => (
          <SponsorPlatformCard
            key={integration.id}
            integration={integration}
            index={i}
            onRun={() => handleRunIntegration(integration.primarySandboxId)}
            onConfigure={() => setConfigModal(integration)}
          />
        ))}
      </div>

      <IntegrationConfigModal integration={configModal} onClose={() => setConfigModal(null)} />

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08] w-fit">
        <button
          onClick={() => setEvalTab('scenarios')}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium transition-colors',
            evalTab === 'scenarios' ? 'bg-white text-black' : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          All scenarios
        </button>
        <button
          onClick={() => setEvalTab('live')}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium transition-colors',
            evalTab === 'live' ? 'bg-white text-black' : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          Live batch
        </button>
      </div>

      {evalTab === 'live' ? (
        <LiveAgentArena />
      ) : (
        <div className="ui-card-elevated p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Evaluation library</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {scenarios.length} trap scenarios across sponsor platforms
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/[0.08] bg-black/60 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/[0.2]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-500 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Scenario</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredScenarios.map((scn) => (
                  <tr
                    key={scn.id}
                    className={cn(
                      'hover:bg-white/[0.02] cursor-pointer',
                      currentScenario.id === scn.id && 'bg-white/[0.04]'
                    )}
                    onClick={() => handleSelectAndReplay(scn.id)}
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-zinc-100">{scn.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{scn.id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <ProviderBadge provider={scn.provider} showProduct />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="result" value={scn.lastRunResult} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">{scn.latencyMs}ms</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndReplay(scn.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] px-3 py-1.5 text-zinc-200 hover:text-white hover:border-white/[0.2]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
