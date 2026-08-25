import React, { useState } from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { X, Terminal, Server, Radio, Database, Check, Copy } from 'lucide-react';

export const BackendModal: React.FC = () => {
  const { isBackendModalOpen, setIsBackendModalOpen } = useAgentRun();
  const [activeTab, setActiveTab] = useState<'rest' | 'ws' | 'memory' | 'schema'>('rest');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isBackendModalOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleRest = `// 1. Trigger agent scenario execution
POST /api/v1/scenarios/:id/run
Headers: { "Authorization": "Bearer bb_live_sec_99182", "Content-Type": "application/json" }
Body:
{
  "scenario_id": "SCN-1082",
  "temperature": 0.0,
  "probe_level": "FULL_TRACE_WITH_INTERNAL_ACTIVATIONS",
  "sidecar_interceptor": true
}

// Response:
{
  "run_id": "run_881903",
  "status": "flagged",
  "flagged_step": 5,
  "flag_reason": "No independent verification of delivery status before proceeding",
  "taxonomy": "unsupported_claim",
  "latency_ms": 382,
  "sae_latent": "L28.sae_latents[14892]",
  "sae_activation_sigma": 4.82,
  "internal_signals": {
    "epistemic_uncertainty": 0.84,
    "premature_action_bias": 0.92,
    "verification_gap": 0.96
  }
}`;

  const sampleWs = `// 2. Real-time Node-by-Node WebSocket Stream
const ws = new WebSocket("wss://api.blackbox.ai/v1/probes/stream?run_id=run_881903");

ws.onmessage = (event) => {
  const packet = JSON.parse(event.data);
  // packet: {
  //   event: "SAE_LATENT_ACTIVATION",
  //   step_index: 4,
  //   node_id: "node_tool",
  //   status: "flagged",
  //   sae_feature_id: "L28.14892",
  //   activation_sigma: 4.82,
  //   mttc_ms: 142
  // }
};`;

  const sampleMemory = `// 3. Inject Cognitive Correction Rule directly into Agent Memory
POST /api/v1/corrections/inject
Body:
{
  "scenario_id": "SCN-1082",
  "rule_id": "RULE-402",
  "plain_rule": "Prior to refund > $100, enforce strict check against carrier API",
  "target_layer": "SYNAPSE_GUARDRAIL_INTERCEPTOR",
  "weights_persistence": "POSTGRES_RAG_LONG_TERM",
  "auto_verify_on_inject": true
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-xl border border-white/[0.1] bg-[#09090b] p-6 shadow-modal-depth flex flex-col max-h-[85vh] font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-white">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white uppercase tracking-wider">
                  Backend API & SAE Telemetry Spec
                </h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/20">
                  Ready for Production
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Sidecar probe architecture for LangChain, LlamaIndex, AutoGen, CrewAI, or raw LLM APIs
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBackendModalOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="mt-4 flex gap-1.5 border-b border-white/[0.08] pb-2">
          <button
            onClick={() => setActiveTab('rest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === 'rest'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            REST API
          </button>
          <button
            onClick={() => setActiveTab('ws')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === 'ws'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            WebSocket Stream
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === 'memory'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            Memory Injection
          </button>
        </div>

        {/* Code Box */}
        <div className="relative mt-4 flex-1 overflow-auto rounded-lg border border-white/[0.08] bg-black p-4">
          <button
            onClick={() => {
              const content =
                activeTab === 'rest' ? sampleRest : activeTab === 'ws' ? sampleWs : sampleMemory;
              copyToClipboard(content, activeTab);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:border-white/[0.2] transition-colors"
          >
            {copiedKey === activeTab ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy Snippet
              </>
            )}
          </button>

          <pre className="text-xs text-zinc-300 leading-relaxed overflow-x-auto">
            <code>{activeTab === 'rest' ? sampleRest : activeTab === 'ws' ? sampleWs : sampleMemory}</code>
          </pre>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsBackendModalOpen(false)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
