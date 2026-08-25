import React, { useState } from 'react';
import { STUDIO_INTEGRATIONS } from '../../data/mockNodes';
import { AgentStudioIntegration, IntegrationProviderId } from '../../types';
import {
  Plug,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Radio,
  Copy,
  Check,
  Sparkles,
  Bot,
  Zap,
  Sliders,
  Play,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAgentRun } from '../../context/AgentRunContext';
import { motion, AnimatePresence } from 'framer-motion';

export const StudioIntegrationsHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<AgentStudioIntegration[]>(STUDIO_INTEGRATIONS);
  const [activeModal, setActiveModal] = useState<AgentStudioIntegration | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const { setCurrentScenarioById, setCurrentScreen, playRun } = useAgentRun();

  const handleToggleConnect = (id: IntegrationProviderId) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isConnected: !item.isConnected } : item))
    );
  };

  const handleTestInSandbox = (item: AgentStudioIntegration) => {
    setCurrentScenarioById(item.primarySandboxId);
    setCurrentScreen('screen1_brain');
    setTimeout(() => {
      playRun();
    }, 150);
  };

  const copyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0 } }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-5 space-y-4 font-mono text-xs shadow-modal-depth relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.1] text-white">
              <Plug className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Agent Studio & Platform Integrations
            </h2>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans mt-1">
            Connect ElevenLabs, Dodo Payments, and Freshworks Studio agents directly into Black Box empirical sandboxes for continuous judgment and mechanistic training.
          </p>
        </div>

        <span className="rounded-lg bg-zinc-900 border border-white/[0.08] px-3 py-1.5 text-zinc-300 text-xs shadow-sm">
          3 Connected Platforms
        </span>
      </div>

      {/* Integration Grid Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {integrations.map((item) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            key={item.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-white/[0.08] bg-black/60 hover:bg-zinc-900/40 hover:border-white/[0.18] transition-all space-y-3 group shadow-sm"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors duration-300">{item.logoBadge}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 transition-colors duration-300',
                    item.isConnected
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      : 'bg-zinc-800 text-zinc-400 border-white/[0.08]'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                      item.isConnected ? 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-500'
                    )}
                  />
                  {item.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="text-[10px] uppercase text-zinc-500 font-semibold mt-1">
                {item.category}
              </div>


              <p className="text-[11px] text-zinc-300 font-sans leading-relaxed mt-2 line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              {/* Invariant Hook preview */}
              <div className="p-2 rounded bg-zinc-900/80 border border-white/[0.06] text-[10px]">
                <span className="text-zinc-500 uppercase block font-semibold mb-0.5">
                  Enforced Invariant:
                </span>
                <p className="text-zinc-200 line-clamp-2 italic font-sans">
                  "{item.featuredInvariant}"
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>{item.activeAgentsCount} active agents</span>
                <span className="text-emerald-400 font-bold">{item.evalPassRate}% pass rate</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleTestInSandbox(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 py-1.5 text-xs font-semibold transition-colors shadow-sm"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Sandbox</span>
                </button>

                <button
                  onClick={() => setActiveModal(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.2] text-xs transition-colors"
                  title="Configure Webhook & API Bridge"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Integration Setup Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#09090b] p-6 shadow-modal-depth space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-white">{activeModal.logoBadge}</span>
                <span className="text-xs text-zinc-400 font-sans">Bridge Configuration</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] font-semibold mb-1">
                  Live Webhook / WebSocket Streaming Ingestion URL:
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-white/[0.08]">
                  <code className="text-zinc-200 text-[11px] truncate flex-1">{activeModal.webhookUrl}</code>
                  <button
                    onClick={() => copyWebhook(activeModal.webhookUrl)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 border border-white/[0.1] text-zinc-300 hover:text-white"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <span className="text-white font-semibold block">Automatic Judgment Pipeline:</span>
                <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                  Every token emitted by this agent studio is sidecar-intercepted by Black Box. If epistemic uncertainty spikes or an SAE latent detects an unverified action, the response is halted and routed to the 5-step Memory Correction loop.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-700 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
