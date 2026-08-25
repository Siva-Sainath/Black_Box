import React, { useState, useEffect } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { LiveAgentRunner, SandboxStage, JudgeVerdict } from '../../types';
import { ProviderBadge } from '../common/ProviderBadge';
import { getProviderConfig } from '../../utils/providerConfig';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const INITIAL_RUNNERS: LiveAgentRunner[] = [
  {
    id: 'agent_eleven_01',
    name: 'ElevenAgents Telephony Agent',
    provider: 'elevenlabs',
    avatarColor: '#38bdf8',
    scenarioId: 'SCN-3094',
    scenarioName: 'Live Competitor Discount Negotiation',
    currentStage: 'sae_probe',
    progressPercent: 78,
    activeTokensCount: 142,
    latencyMs: 184,
    activeThoughtSnippet: 'Customer negotiating 50% discount over voice...',
    verdict: 'HALTED_ANOMALY',
    saeAnomalyDetected: true,
    saeLatentSpike: 'L28.14892 (+4.82σ)',
  },
  {
    id: 'agent_fresh_03',
    name: 'Freddy AI Enterprise Agent',
    provider: 'freshworks_studio',
    avatarColor: '#a855f7',
    scenarioId: 'SCN-5221',
    scenarioName: 'P0 Database Outage Ticket Escalation',
    currentStage: 'judge_evaluation',
    progressPercent: 92,
    activeTokensCount: 312,
    latencyMs: 290,
    activeThoughtSnippet: 'P0 critical ticket — enforcing on-call escalation.',
    verdict: 'PASSED',
    saeAnomalyDetected: false,
  },
  {
    id: 'agent_dodo_02',
    name: 'Dodo Payments Payout Agent',
    provider: 'dodo_payments',
    avatarColor: '#fbbf24',
    scenarioId: 'SCN-4112',
    scenarioName: 'Double-Charge Invoice Dispute',
    currentStage: 'tool_call',
    progressPercent: 64,
    activeTokensCount: 198,
    latencyMs: 242,
    activeThoughtSnippet: 'Reviewing Dodo ledger idempotency keys...',
    verdict: 'EVALUATING',
    saeAnomalyDetected: false,
  },
];

export const LiveAgentArena: React.FC = () => {
  const [runners, setRunners] = useState<LiveAgentRunner[]>(INITIAL_RUNNERS);
  const [isSimulating, setIsSimulating] = useState(false);
  const { setCurrentScenarioById, openDrawerForStep, scenarios } = useAgentRun();

  useEffect(() => {
    if (!isSimulating) return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRunners((prev) =>
        prev.map((r, i) => {
          const newPct = Math.min(100, r.progressPercent + (i % 2 === 0 ? 10 : 7));
          let nextStage: SandboxStage = 'ingestion';
          if (newPct > 85) nextStage = 'judge_evaluation';
          else if (newPct > 65) nextStage = 'sae_probe';
          else if (newPct > 45) nextStage = 'tool_call';
          else if (newPct > 25) nextStage = 'reasoning';
          return {
            ...r,
            progressPercent: newPct,
            currentStage: nextStage,
            latencyMs: r.latencyMs + Math.floor(Math.random() * 15),
          };
        })
      );
      if (step >= 8) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleInspect = (scenarioId: string) => {
    setCurrentScenarioById(scenarioId);
    const scn = scenarios.find((s) => s.id === scenarioId);
    if (scn) {
      const flagged = scn.steps.find((st) => st.status === 'flagged') || scn.steps[0];
      openDrawerForStep(flagged);
    }
  };

  const verdictStyle = (v: JudgeVerdict) => {
    if (v === 'PASSED') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (v === 'HALTED_ANOMALY') return 'text-red-400 bg-red-500/10 border-red-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="ui-card-elevated p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Live batch eval</h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">One agent per sponsor platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunners(INITIAL_RUNNERS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => setIsSimulating(true)}
            disabled={isSimulating}
            className="btn-primary flex items-center gap-1.5 px-4 py-1.5 text-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run parallel
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {runners.map((runner, i) => {
          const config = getProviderConfig(runner.provider);
          return (
            <motion.div
              key={runner.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-white/[0.08] bg-black/40 p-4 hover:border-white/[0.12] transition-colors"
              style={{ borderLeftColor: config?.accent, borderLeftWidth: '3px' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <ProviderBadge provider={runner.provider} />
                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded border',
                        verdictStyle(runner.verdict)
                      )}
                    >
                      {runner.verdict.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{runner.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{runner.scenarioName}</p>
                  <p className="text-[11px] text-zinc-400 mt-2 line-clamp-1">{runner.activeThoughtSnippet}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right font-mono text-[10px] text-zinc-500">
                    <div>{runner.latencyMs}ms</div>
                    <div>{runner.progressPercent}%</div>
                  </div>
                  <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${runner.progressPercent}%`,
                        backgroundColor: config?.accent ?? '#fff',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleInspect(runner.scenarioId)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                  >
                    Open
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
