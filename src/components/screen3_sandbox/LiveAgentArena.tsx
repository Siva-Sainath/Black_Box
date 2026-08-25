import React, { useState, useEffect } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { LiveAgentRunner, SandboxStage, JudgeVerdict } from '../../types';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Sparkles,
  Zap,
  Activity,
  Bot,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_RUNNERS: LiveAgentRunner[] = [
  {
    id: 'agent_eleven_01',
    name: 'ElevenLabs Telephony Agent (Voice-AI-4)',
    provider: 'elevenlabs',
    avatarColor: '#38bdf8',
    scenarioId: 'SCN-3094',
    scenarioName: 'Live Competitor Discount Negotiation',
    currentStage: 'sae_probe',
    progressPercent: 78,
    activeTokensCount: 142,
    latencyMs: 184,
    activeThoughtSnippet: 'User negotiating 50% discount. Pressure to agree... Checking pricing boundary...',
    verdict: 'HALTED_ANOMALY',
    saeAnomalyDetected: true,
    saeLatentSpike: 'L28.14892 (+4.82σ)',
  },
  {
    id: 'agent_dodo_02',
    name: 'Dodo Payments Autonomous Payout Agent',
    provider: 'dodo_payments',
    avatarColor: '#fbbf24',
    scenarioId: 'SCN-4112',
    scenarioName: 'Double-Charge Invoice Dispute (INV-88129)',
    currentStage: 'tool_call',
    progressPercent: 64,
    activeTokensCount: 198,
    latencyMs: 242,
    activeThoughtSnippet: 'Introspecting Dodo ledger... Only 1 captured charge found. Second authorization rejected.',
    verdict: 'EVALUATING',
    saeAnomalyDetected: false,
  },
  {
    id: 'agent_fresh_03',
    name: 'Freshworks Freddy AI Enterprise Agent',
    provider: 'freshworks_studio',
    avatarColor: '#a855f7',
    scenarioId: 'SCN-5221',
    scenarioName: 'P0 Database Outage Ticket Escalation',
    currentStage: 'judge_evaluation',
    progressPercent: 92,
    activeTokensCount: 312,
    latencyMs: 290,
    activeThoughtSnippet: 'P0 critical ticket detected. Enforcing on-call engineer page requirement.',
    verdict: 'PASSED',
    saeAnomalyDetected: false,
  },
  {
    id: 'agent_dodo_04',
    name: 'Dodo Payments Autonomous Chargeback Agent',
    provider: 'dodo_payments',
    avatarColor: '#f59e0b',
    scenarioId: 'SCN-4112',
    scenarioName: 'Subscription Chargeback Reversal (INV-88130)',
    currentStage: 'reasoning',
    progressPercent: 45,
    activeTokensCount: 164,
    latencyMs: 198,
    activeThoughtSnippet: 'Reviewing Dodo ledger idempotency keys... second authorization pending vs captured.',
    verdict: 'EVALUATING',
    saeAnomalyDetected: false,
  },
];

export const LiveAgentArena: React.FC = () => {
  const [runners, setRunners] = useState<LiveAgentRunner[]>(INITIAL_RUNNERS);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const { setCurrentScenarioById, setCurrentScreen, openDrawerForStep, scenarios } = useAgentRun();

  const stages: { id: SandboxStage; label: string }[] = [
    { id: 'ingestion', label: '1. Ingest' },
    { id: 'reasoning', label: '2. Deliberate' },
    { id: 'tool_call', label: '3. Tool Call' },
    { id: 'sae_probe', label: '4. SAE Probe' },
    { id: 'judge_evaluation', label: '5. Judge' },
  ];

  const handleRunBatchSimulation = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRunners((prev) =>
        prev.map((r, i) => {
          const newPct = Math.min(100, r.progressPercent + (i % 2 === 0 ? 12 : 8));
          let nextStage: SandboxStage = 'ingestion';
          if (newPct > 85) nextStage = 'judge_evaluation';
          else if (newPct > 65) nextStage = 'sae_probe';
          else if (newPct > 45) nextStage = 'tool_call';
          else if (newPct > 25) nextStage = 'reasoning';

          return {
            ...r,
            progressPercent: newPct,
            currentStage: nextStage,
            activeTokensCount: r.activeTokensCount + 14,
            latencyMs: r.latencyMs + Math.floor(Math.random() * 20),
          };
        })
      );

      if (step >= 8) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 400);
  };

  const handleInspectAgent = (scenarioId: string) => {
    setCurrentScenarioById(scenarioId);
    const targetScn = scenarios.find((s) => s.id === scenarioId);
    if (targetScn) {
      const flagged = targetScn.steps.find((st) => st.status === 'flagged') || targetScn.steps[0];
      openDrawerForStep(flagged);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-5 space-y-4 font-mono text-xs shadow-modal-depth overflow-hidden relative">
      {/* Subtle top ambient gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-full blur-[100px]" />

      {/* Arena Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.1] text-white">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Live Multi-Agent Sandbox Arena
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-1">
                Visualizing parallel deterministic ground-truth evaluations across disparate agent studios.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunners(INITIAL_RUNNERS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white transition-colors text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleRunBatchSimulation}
            disabled={isSimulating}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-black font-semibold text-xs transition-colors shadow-sm",
              isSimulating ? 'bg-emerald-600/50 cursor-not-allowed text-zinc-300' : 'bg-white hover:bg-zinc-200'
            )}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isSimulating ? 'Simulating Batch...' : 'Run Parallel Batch'}
          </button>
        </div>
      </div>

      {/* Fluid Agent Runner List */}
      <motion.div layout className="space-y-3 relative z-10">
        <AnimatePresence>
          {runners.map((runner, index) => {
            const stageIndex = stages.findIndex((s) => s.id === runner.currentStage);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.4, delay: index * 0.1, type: 'spring', bounce: 0.2 }}
                key={runner.id}
                className="flex flex-col xl:flex-row xl:items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-black/40 hover:bg-white/[0.02] transition-colors relative overflow-hidden group"
              >
                {/* Active simulating background scan line */}
                {isSimulating && runner.verdict === 'EVALUATING' && (
                  <motion.div 
                    initial={{ left: '-10%' }}
                    animate={{ left: '110%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
                  />
                )}

                {/* Agent Identity & Scenario */}
                <div className="flex-[2] min-w-0 z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: runner.avatarColor, boxShadow: `0 0 10px ${runner.avatarColor}` }}
                    />
                    <span className="font-bold text-white text-xs truncate">
                      {runner.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate flex items-center gap-1.5">
                    <span className="text-zinc-400 font-semibold">{runner.scenarioId}</span>
                    <span>•</span>
                    <span className="truncate group-hover:text-zinc-300 transition-colors">{runner.scenarioName}</span>
                  </div>
                </div>

                {/* Progress Pipeline Ribbon (Framer Motion Fluid Bar) */}
                <div className="flex-[4] relative h-12 flex items-center z-10">
                  {/* Background Track */}
                  <div className="absolute left-4 right-4 h-1 bg-zinc-900/80 top-1/2 -translate-y-1/2 rounded-full border border-white/[0.02]" />
                  
                  {/* Fill Track with Fluid Spring */}
                  <motion.div
                    className={cn("absolute left-4 h-1 top-1/2 -translate-y-1/2 rounded-full origin-left shadow-sm", runner.verdict === 'HALTED_ANOMALY' ? 'bg-red-500' : 'bg-emerald-400')}
                    initial={{ width: 0 }}
                    animate={{ width: `calc(${runner.progressPercent}% - 32px)` }}
                    transition={{ type: 'spring', bounce: 0.1, duration: 1.2 }}
                  />

                  {/* Stage Nodes */}
                  <div className="relative w-full flex justify-between px-4">
                    {stages.map((stage, i) => {
                      const isPast = i <= stageIndex;
                      const isActive = i === stageIndex;
                      const isFlaggedNode = isPast && runner.saeAnomalyDetected && stage.id === 'sae_probe';

                      return (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center gap-1.5">
                          <motion.div
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border-[2px] transition-all duration-300',
                              isFlaggedNode
                                ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(255,34,68,0.6)]'
                                : isActive
                                ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : isPast
                                ? 'bg-zinc-300 border-zinc-200'
                                : 'bg-black border-zinc-700'
                            )}
                            animate={isActive && isSimulating ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ repeat: isActive && isSimulating ? Infinity : 0, duration: 1 }}
                          />
                          <span
                            className={cn(
                              'absolute top-5 text-[9px] whitespace-nowrap font-medium tracking-wide transition-colors duration-300',
                              isFlaggedNode
                                ? 'text-red-400 font-bold'
                                : isActive
                                ? 'text-emerald-400'
                                : isPast
                                ? 'text-zinc-400'
                                : 'text-zinc-600'
                            )}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Telemetry & Verdict */}
                <div className="flex-[3] flex flex-col items-end gap-2 text-right z-10">
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {runner.activeTokensCount} tok
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-sky-400" />
                      {runner.latencyMs}ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AnimatePresence mode="popLayout">
                      {runner.verdict === 'PASSED' && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERIFIED
                        </motion.span>
                      )}
                      {runner.verdict === 'HALTED_ANOMALY' && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-[10px] flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,34,68,0.15)]"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {runner.saeLatentSpike || 'HALTED'}
                        </motion.span>
                      )}
                      {runner.verdict === 'EVALUATING' && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-white/[0.08] font-medium text-[10px] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          EVALUATING
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => handleInspectAgent(runner.scenarioId)}
                      className="ml-2 flex items-center justify-center w-7 h-7 rounded bg-white text-black hover:bg-zinc-200 transition-all shadow-sm group"
                      title="Inspect Intercept in 3D Brain"
                    >
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
