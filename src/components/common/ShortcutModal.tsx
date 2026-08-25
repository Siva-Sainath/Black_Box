import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutModal: React.FC = () => {
  const { isShortcutModalOpen, setIsShortcutModalOpen } = useAgentRun();

  if (!isShortcutModalOpen) return null;

  const shortcuts = [
    { key: 'S', description: 'Toggle scenarios drawer (Prober)' },
    { key: 'A', description: 'Toggle agent run drawer (Prober)' },
    { key: 'Space', description: 'Play / Pause live agent execution' },
    { key: 'R', description: 'Reset execution to beginning' },
    { key: '→ (Arrow Right)', description: 'Step forward one single node' },
    { key: '1', description: 'Switch to Screen 1: 3D Neural Prober' },
    { key: '2', description: 'Inspect SAE Feature Detail drawer' },
    { key: '3', description: 'Switch to Screen 3: Evals & Sandbox' },
    { key: '4', description: 'Switch to Screen 4: Telemetry & Proof' },
    { key: '5', description: 'Switch to Screen 5: Memory Patching' },
    { key: 'Esc', description: 'Close modals & drawers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-white/[0.1] bg-[#09090b] p-6 shadow-modal-depth animate-fade-in font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-white">
              <Keyboard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-white">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-zinc-400 font-sans">Speed up evaluation & review loops</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutModalOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-white/[0.04]">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-zinc-300">{sc.description}</span>
              <kbd className="flex items-center gap-1 rounded border border-white/[0.1] bg-zinc-900 px-2 py-0.5 text-white font-medium shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsShortcutModalOpen(false)}
            className="rounded-lg bg-white text-black hover:bg-zinc-200 px-4 py-2 font-medium transition-colors shadow-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
