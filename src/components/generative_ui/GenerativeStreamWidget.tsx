import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { AudioWaveformCanvas } from './AudioWaveformCanvas';
import { StreamingText } from './StreamingText';
import {
  Mic,
  CreditCard,
  Building2,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Zap,
  Activity,
  Terminal,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const GenerativeStreamWidget: React.FC = () => {
  const { currentScenario, currentStepIndex, playbackState, openDrawerForStep } = useAgentRun();
  const currentStep = currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;
  const isFlagged = Boolean(playbackState === 'flagged' || (currentStep && currentStep.status === 'flagged'));
  const provider = currentScenario.provider || 'elevenlabs';
  const isRunning = playbackState === 'running';

  return (
    <motion.div 
      layout
      className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-4 space-y-3 font-mono text-xs shadow-modal-depth relative overflow-hidden flex flex-col h-full min-h-[340px]"
    >
      {/* Subtle top ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      {/* Widget Header */}
      <motion.div layout="position" className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 border border-white/[0.1] text-white">
            {provider === 'elevenlabs' ? (
              <Mic className="w-3.5 h-3.5 text-sky-400" />
            ) : provider === 'dodo_payments' ? (
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            ) : provider === 'freshworks_studio' ? (
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div>
            <span className="font-semibold text-white text-xs block">
              {provider === 'elevenlabs'
                ? 'ElevenLabs Live Telephony Probe'
                : provider === 'dodo_payments'
                ? 'Dodo Payments Multi-Rail Guard'
                : provider === 'freshworks_studio'
                ? 'Freshworks Studio SLA Monitor'
                : 'Ground-Truth Verification Engine'}
            </span>
            <span className="text-[10px] text-zinc-500">
              Generative Component • Real-Time Stream
            </span>
          </div>
        </div>

        <motion.span
          layout
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition-colors duration-300',
            isFlagged
              ? 'bg-red-500/10 text-red-300 border-red-500/30 shadow-[0_0_15px_rgba(255,34,68,0.2)]'
              : isRunning
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
              : 'bg-zinc-800 text-zinc-400 border-white/[0.08]'
          )}
        >
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-colors duration-300',
              isFlagged
                ? 'bg-red-500 animate-ping'
                : isRunning
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-zinc-500'
            )}
          />
          {isFlagged ? 'ANOMALY CAUGHT' : isRunning ? 'LIVE STREAM' : 'STANDBY'}
        </motion.span>
      </motion.div>

      {/* Dynamic Morphing Body based on Provider */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {/* 1. ELEVENLABS VOICE AI STREAM WIDGET */}
          {provider === 'elevenlabs' && (
            <motion.div
              key="elevenlabs_widget"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
              className="space-y-3 absolute inset-0"
            >
              <motion.div layout className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-sky-400" />
                    PCM Audio Stream (24kHz)
                  </span>
                  <span className="text-[10px] text-zinc-500">Latency: 184ms</span>
                </div>

                <AudioWaveformCanvas
                  isActive={isRunning}
                  isFlagged={isFlagged}
                  className="w-full"
                />

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] leading-relaxed">
                  <span className="text-zinc-500 uppercase text-[9px] block font-semibold mb-0.5">
                    Spoken Intent Transcript:
                  </span>
                  <p className={cn("text-zinc-200", isFlagged && "text-red-300 transition-colors duration-500")}>
                    "<StreamingText text={currentScenario.userPrompt} isStreaming={isRunning} />"
                  </p>
                </div>
              </motion.div>

              <motion.div layout className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 uppercase font-semibold">Pricing Boundary Invariant:</span>
                  <span className="text-amber-400 font-bold">Max Voice Discount: 15%</span>
                </div>

                <AnimatePresence mode="popLayout">
                  {isFlagged ? (
                    <motion.div 
                      key="flagged-alert"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-[11px] space-y-1 overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Spoken Token Violation: 50% Promised</span>
                      </div>
                      <p className="text-zinc-300 text-[10px]">
                        Voice agent attempted to utter "Sure, I can match that 50% discount!" without VP approval.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="nominal-alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2.5 rounded-lg bg-black/60 border border-white/[0.06] text-zinc-400 text-[10px] overflow-hidden"
                    >
                      ✓ Anti-hallucination filter active. Spoken tokens checked against pricing database before TTS synthesis.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* 2. DODO PAYMENTS FINTECH RAIL WIDGET */}
          {provider === 'dodo_payments' && (
            <motion.div
              key="dodo_widget"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
              className="space-y-3 absolute inset-0"
            >
              <motion.div layout className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    Dodo Ledger Double-Entry Audit
                  </span>
                  <span className="text-[10px] text-zinc-500">Invoice: INV-88129</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] space-y-0.5"
                  >
                    <span className="text-zinc-500 block">Attempt #1 (Captured)</span>
                    <span className="text-emerald-400 font-bold">$850.00 USD</span>
                    <span className="text-[9px] text-zinc-500 block">Status: SUCCESS</span>
                  </motion.div>
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] space-y-0.5"
                  >
                    <span className="text-zinc-500 block">Attempt #2 (Declined)</span>
                    <span className="text-red-400 font-bold">$0.00 USD</span>
                    <span className="text-[9px] text-zinc-500 block">Status: CARD_DECLINE</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div layout className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">Idempotency Guardrail:</span>
                  <motion.span 
                    layout
                    className={cn('font-bold text-[10px] px-2 py-0.5 rounded transition-colors', isFlagged ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400')}
                  >
                    {isFlagged ? 'UNVERIFIED MUTATION' : 'ENFORCED'}
                  </motion.span>
                </div>

                <AnimatePresence mode="popLayout">
                  {isFlagged && (
                    <motion.div 
                      key="dodo-alert"
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-[10px] leading-tight overflow-hidden mt-2"
                    >
                      🚨 Agent attempted to refund non-duplicate $850 charge without checking Attempt #2 decline code.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* 3. FRESHWORKS STUDIO SLA MONITOR WIDGET */}
          {provider === 'freshworks_studio' && (
            <motion.div
              key="freshworks_widget"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
              className="space-y-3 absolute inset-0"
            >
              <motion.div layout className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    Freshdesk Ticket #TKT-44912
                  </span>
                  <motion.span 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[9px]"
                  >
                    P0 OUTAGE
                  </motion.span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] space-y-1 text-[10px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Customer: Acme Corp Enterprise</span>
                    <span className="text-red-400 font-bold">SLA: 15m Remaining</span>
                  </div>
                  <p className="text-zinc-200 italic font-sans">
                    "<StreamingText text="Production database cluster is unresponsive after patch." isStreaming={isRunning} />"
                  </p>
                </div>
              </motion.div>

              <motion.div layout className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-1.5 text-[10px]">
                <span className="text-zinc-400 uppercase font-semibold block">Freshworks Escalation Policy:</span>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>On-Call Page: <strong className={cn("transition-colors", isFlagged ? "text-red-400" : "text-emerald-400")}>
                    {isFlagged ? "BYPASSED" : "PagerDuty Triggered"}
                  </strong></span>
                  <span>Auto-Close: <strong className="text-red-400">
                    {isFlagged ? "ATTEMPTED" : "BLOCKED"}
                  </strong></span>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Widget Footer CTA */}
      <motion.div layout="position" className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 mt-auto relative z-10">
        <span>SAE Residual Layer: 28</span>
        {currentStep && (
          <button
            onClick={() => openDrawerForStep(currentStep)}
            className="text-white hover:underline flex items-center gap-1 font-medium group"
          >
            <span>Inspect Full Probe</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

