import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import { AgentStudioIntegration } from '../../types';
import { getProviderConfig } from '../../utils/providerConfig';
import { cn } from '../../utils/cn';

interface SponsorPlatformCardProps {
  integration: AgentStudioIntegration;
  onRun: () => void;
  onConfigure?: () => void;
  index?: number;
}

export const SponsorPlatformCard: React.FC<SponsorPlatformCardProps> = ({
  integration,
  onRun,
  onConfigure,
  index = 0,
}) => {
  const config = getProviderConfig(integration.id);
  const accent = config?.accent ?? '#fff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', bounce: 0.15 }}
      className="glass-card group relative flex flex-col p-5 overflow-hidden"
      style={{
        borderTopColor: accent,
        borderTopWidth: '2px',
      }}
    >
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-60"
        style={{
          background: `radial-gradient(circle at top right, ${config?.glow ?? 'rgba(255,255,255,0.05)'}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] text-zinc-500 mb-1">{config?.shortName}</p>
          <h3 className="text-lg font-semibold text-white tracking-tight leading-snug">
            {integration.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{integration.tagline}</p>
        </div>
        <span
          className="shrink-0 px-2 py-1 rounded-md text-[10px] font-mono font-medium border"
          style={{
            color: accent,
            borderColor: config?.border,
            backgroundColor: config?.bg,
          }}
        >
          {integration.evalPassRate}% pass
        </span>
      </div>

      {/* Mini preview strip — ElevenLabs-style embedded metric */}
      <div className="relative z-10 rounded-lg border border-white/[0.06] bg-black/50 p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-500">Resolution rate</span>
          <span className="font-mono text-zinc-200">{integration.evalPassRate}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${integration.evalPassRate}%`, backgroundColor: accent }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>{integration.activeAgentsCount} agents active</span>
          <span>Synced {integration.lastSync}</span>
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">
        <span className="text-zinc-400">Invariant:</span> {integration.featuredInvariant}
      </p>

      <div className="relative z-10 flex items-center gap-2 mt-auto">
        <button
          onClick={onRun}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-medium"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Run in Prober
        </button>
        {onConfigure && (
          <button
            onClick={onConfigure}
            className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            Configure
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const IntegrationConfigModal: React.FC<{
  integration: AgentStudioIntegration | null;
  onClose: () => void;
}> = ({ integration, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!integration) return null;

  const copyWebhook = () => {
    navigator.clipboard.writeText(integration.webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="ui-card-elevated w-full max-w-md p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">{integration.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">Webhook & probe configuration</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm">✕</button>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] text-zinc-500">Probe endpoint</label>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black border border-white/[0.08]">
            <code className="text-[11px] text-zinc-300 flex-1 truncate font-mono">
              {integration.webhookUrl}
            </code>
            <button onClick={copyWebhook} className="p-1.5 text-zinc-400 hover:text-white">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">{integration.description}</p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
        >
          <ExternalLink className="w-3 h-3" />
          View platform docs
        </a>
      </div>
    </div>
  );
};
