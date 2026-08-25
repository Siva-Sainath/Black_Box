import React, { useMemo } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { BrainNode, RunStep, Synapse } from '../../types';
import { SYNAPSE_CONNECTIONS } from '../../data/mockNodes';
import { cn } from '../../utils/cn';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Database,
  Shield,
  Cpu,
  Wrench,
  SearchCheck,
  Send,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BrainGraph: React.FC = () => {
  const {
    nodes,
    currentScenario,
    currentStepIndex,
    playbackState,
    openDrawerForStep,
    openDrawerForNodeId,
    activeNodeId,
  } = useAgentRun();

  const activeStep: RunStep | null =
    currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;

  // Icon mapping for cognitive modules
  const getNodeIcon = (category: BrainNode['category']) => {
    switch (category) {
      case 'perception':
        return Eye;
      case 'memory':
        return Database;
      case 'guardrail':
        return Shield;
      case 'reasoning':
        return Cpu;
      case 'tool_caller':
        return Wrench;
      case 'verifier':
        return SearchCheck;
      case 'action':
        return Send;
      default:
        return Zap;
    }
  };

  // Determine state of each node based on current playback progress
  const getNodeState = (node: BrainNode) => {
    if (playbackState === 'idle') {
      return { status: 'idle', isCurrent: false };
    }

    const stepForThisNodeIndex = currentScenario.steps.findIndex((s) => s.nodeId === node.id);

    if (stepForThisNodeIndex === -1) {
      return { status: 'idle', isCurrent: false };
    }

    const isCurrent = currentStepIndex === stepForThisNodeIndex;
    const step = currentScenario.steps[stepForThisNodeIndex];

    if (stepForThisNodeIndex < currentStepIndex) {
      // Past node: passed or verified
      return {
        status: step.status === 'flagged' ? 'flagged' : 'passed',
        isCurrent: false,
      };
    } else if (stepForThisNodeIndex === currentStepIndex) {
      // Active node
      if (playbackState === 'flagged' || step.status === 'flagged') {
        return { status: 'flagged', isCurrent: true };
      }
      return { status: 'active', isCurrent: true };
    } else {
      // Future node: dim
      return { status: 'dim', isCurrent: false };
    }
  };

  // Calculate coordinates for SVGs
  const nodeMap = useMemo(() => {
    const map = new Map<string, BrainNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Traveling pulse position along the active synapse
  const activeSynapseCoordinates = useMemo(() => {
    if (currentStepIndex <= 0 || currentStepIndex >= currentScenario.steps.length) return null;
    const prevStep = currentScenario.steps[currentStepIndex - 1];
    const currStep = currentScenario.steps[currentStepIndex];
    const fromNode = nodeMap.get(prevStep.nodeId);
    const toNode = nodeMap.get(currStep.nodeId);
    if (!fromNode || !toNode) return null;
    return { from: fromNode, to: toNode };
  }, [currentStepIndex, currentScenario, nodeMap]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl border border-slate-800/90 bg-[#080C14] overflow-hidden flex items-center justify-center select-none shadow-2xl">
      {/* 1. Clinical Grid & Radar Background */}
      <div className="absolute inset-0 bg-clinical-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* 2. Sweeping Horizontal Scanline (Continuous Probing Layer) */}
      <div className="scanline-overlay" />

      {/* 3. Subtle Calibration Grid Coordinates */}
      <div className="absolute top-4 left-5 flex items-center gap-3 text-[10px] font-mono text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          PROBE_FREQ: 1,000Hz
        </span>
        <span className="text-slate-400">•</span>
        <span>LATENCY_SYNC: 1.2ms</span>
        <span className="text-slate-400">•</span>
        <span>LAYER: REASONING_SYNAPSE</span>
      </div>

      <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono pointer-events-none">
        <span className="text-slate-400">STATUS:</span>
        <span
          className={cn(
            'px-2 py-0.5 rounded font-semibold',
            playbackState === 'flagged'
              ? 'bg-red-950/80 text-red-400 border border-red-500/40 animate-pulse'
              : playbackState === 'running'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
              : playbackState === 'complete_verified'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          )}
        >
          {playbackState === 'flagged'
            ? 'MISTAKE CAUGHT • EXECUTION HALTED'
            : playbackState === 'running'
            ? 'AGENT DELIBERATING'
            : playbackState === 'complete_verified'
            ? 'ALL NODES VERIFIED'
            : 'MONITOR STANDBY'}
        </span>
      </div>

      {/* 4. Layered SVG Brain Silhouette and Synaptic Pathways */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="synapse-gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="synapse-gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="synapse-dim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow-red-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-green-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Brain Hemisphere Silhouette Outlines (Clinical & Minimal) */}
        <path
          d="M 50 15 
             C 34 14, 18 25, 16 42 
             C 14 54, 18 68, 26 78 
             C 32 86, 42 88, 48 88 
             C 49 88, 50 88, 50 88
             C 50 88, 51 88, 52 88
             C 58 88, 68 86, 74 78
             C 82 68, 86 54, 84 42
             C 82 25, 66 14, 50 15 Z"
          fill="none"
          stroke="rgba(6, 182, 212, 0.12)"
          strokeWidth="0.6"
          strokeDasharray="1.5 1.5"
        />

        {/* Central Cerebral Fissure / Hemispheric Divider */}
        <path
          d="M 50 17 Q 48 35 52 50 T 50 86"
          fill="none"
          stroke="rgba(6, 182, 212, 0.08)"
          strokeWidth="0.4"
          strokeDasharray="2 2"
        />

        {/* Synapse Lines Between Nodes */}
        {SYNAPSE_CONNECTIONS.map((syn: Synapse) => {
          const from = nodeMap.get(syn.fromNodeId);
          const to = nodeMap.get(syn.toNodeId);
          if (!from || !to) return null;

          // Check if this synapse is active or passed
          const fromStepIdx = currentScenario.steps.findIndex((s) => s.nodeId === from.id);
          const toStepIdx = currentScenario.steps.findIndex((s) => s.nodeId === to.id);
          const isPassed =
            fromStepIdx !== -1 && toStepIdx !== -1 && toStepIdx <= currentStepIndex;
          const isCurrentFiring =
            fromStepIdx !== -1 && toStepIdx !== -1 && toStepIdx === currentStepIndex;
          const isFlaggedEnd =
            isCurrentFiring &&
            (playbackState === 'flagged' || currentScenario.steps[toStepIdx]?.status === 'flagged');

          // Control point for natural curve
          const midX = (from.x + to.x) / 2 + (from.hemisphere === 'left' ? -3 : 3);
          const midY = (from.y + to.y) / 2;
          const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

          return (
            <g key={syn.id}>
              {/* Background Synapse Line */}
              <path
                d={pathD}
                fill="none"
                stroke={
                  isFlaggedEnd
                    ? 'url(#synapse-gradient-red)'
                    : isPassed
                    ? 'url(#synapse-gradient-green)'
                    : isCurrentFiring
                    ? '#06B6D4'
                    : 'rgba(51, 65, 85, 0.4)'
                }
                strokeWidth={isCurrentFiring || isFlaggedEnd ? '0.9' : isPassed ? '0.7' : '0.4'}
                strokeDasharray={isPassed || isCurrentFiring ? 'none' : '1.5 1.5'}
                className="transition-all duration-300"
              />

              {/* Traveling Pulse Animation along the synapse */}
              {isCurrentFiring && (
                <circle r="1.2" fill={isFlaggedEnd ? '#EF4444' : '#34D399'} filter="url(#glow-green-filter)">
                  <animateMotion
                    path={pathD}
                    dur="0.8s"
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* 5. Interactive Neural Nodes */}
      <div className="absolute inset-0 pointer-events-auto">
        {nodes.map((node) => {
          const { status, isCurrent } = getNodeState(node);
          const Icon = getNodeIcon(node.category);
          const stepIndex = currentScenario.steps.findIndex((s) => s.nodeId === node.id);
          const step = stepIndex !== -1 ? currentScenario.steps[stepIndex] : null;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute group z-20"
            >
              {/* Pulsing Danger Shockwave Ring on Flagged Node */}
              {status === 'flagged' && (
                <div className="absolute -inset-4 rounded-full border-2 border-red-500/80 bg-red-500/20 animate-ring-pulse pointer-events-none" />
              )}

              {/* Active Green Glow on Current Node */}
              {isCurrent && status !== 'flagged' && (
                <div className="absolute -inset-3 rounded-full border border-emerald-400/60 bg-emerald-500/20 animate-ping opacity-50 pointer-events-none" />
              )}

              {/* Node Button Card */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (step) {
                    openDrawerForStep(step);
                  } else {
                    openDrawerForNodeId(node.id);
                  }
                }}
                className={cn(
                  'relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-200 shadow-lg cursor-pointer',
                  status === 'flagged'
                    ? 'bg-red-950/90 border-red-500 text-red-300 shadow-glow-red ring-2 ring-red-500/50'
                    : status === 'passed'
                    ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 shadow-glow-green'
                    : status === 'active'
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                )}
              >
                <Icon className={cn('w-5 h-5', status === 'flagged' && 'animate-pulse text-red-300')} />

                {/* Corner Mini Badge */}
                {status === 'flagged' ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow">
                    !
                  </span>
                ) : status === 'passed' ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow">
                    ✓
                  </span>
                ) : null}
              </motion.button>

              {/* Node Label Tooltip Card */}
              <div
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 mt-2 w-48 text-center pointer-events-none transition-all duration-200 opacity-90 group-hover:opacity-100 group-hover:scale-105 z-30',
                  node.y > 65 ? '-top-14 mt-0' : 'top-12'
                )}
              >
                <div
                  className={cn(
                    'px-2.5 py-1 rounded-md border text-[11px] font-mono leading-tight shadow-md backdrop-blur-md',
                    status === 'flagged'
                      ? 'bg-red-950/90 border-red-500/70 text-red-200'
                      : status === 'passed'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                      : status === 'active'
                      ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-200 font-semibold'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400'
                  )}
                >
                  <div className="font-semibold truncate">{node.label}</div>
                  <div className="text-[9px] opacity-75 truncate text-slate-400">{node.moduleName}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Central HUD Overlay when Flagged or Complete */}
      <AnimatePresence>
        {playbackState === 'flagged' && activeStep && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3.5 px-4 py-2.5 rounded-xl border border-red-500/60 bg-red-950/90 backdrop-blur-md shadow-glow-red text-xs font-mono"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold animate-pulse">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-200 uppercase">Reasoning Flag Triggered:</span>
                <span className="rounded bg-red-900/80 px-1.5 py-0.5 text-[10px] text-red-300 border border-red-700/50">
                  Confidence {activeStep.confidenceScore}%
                </span>
              </div>
              <p className="text-red-300/90 text-[11px] max-w-md truncate">
                {activeStep.flagReason || activeStep.reasoning}
              </p>
            </div>
            <button
              onClick={() => openDrawerForStep(activeStep)}
              className="ml-2 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 font-semibold text-white transition-colors shadow"
            >
              Inspect Detail →
            </button>
          </motion.div>
        )}

        {playbackState === 'complete_nominal' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-xl border border-emerald-500/60 bg-emerald-950/90 backdrop-blur-md text-xs font-mono text-emerald-200 shadow-glow-green"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Execution Nominal: 0 Anomalies Flagged across all 6 cognitive layers.</span>
          </motion.div>
        )}

        {playbackState === 'complete_verified' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-xl border border-cyan-500/60 bg-cyan-950/90 backdrop-blur-md text-xs font-mono text-cyan-200 shadow-glow-cyan"
          >
            <CheckCircle className="h-4 w-4 text-cyan-400" />
            <span className="font-bold">VERIFIED REPLAY:</span>
            <span>Corrective Rule Applied Successfully • 100% Policy Parity.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
