import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import { useAgentRun } from '../../context/AgentRunContext';
import { ProviderBadge } from '../common/ProviderBadge';
import { GenerativeStreamWidget } from '../generative_ui/GenerativeStreamWidget';
import { getProviderConfig } from '../../utils/providerConfig';

interface AgentRunDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const AgentRunDrawer: React.FC<AgentRunDrawerProps> = ({ open, onClose }) => {
  const {
    currentScenario,
    playbackState,
    currentStepIndex,
    openDrawerForStep,
  } = useAgentRun();

  const currentStep =
    currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;

  const providerGlow = currentScenario.provider
    ? getProviderConfig(currentScenario.provider)?.glow
    : undefined;

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 bottom-0 z-20 w-[min(480px,92vw)] glass-panel border-l border-white/[0.12] flex flex-col shadow-modal-depth"
        style={{
          boxShadow: providerGlow ? `inset 2px 0 32px ${providerGlow}` : undefined,
        }}
      >
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <ProviderBadge provider={currentScenario.provider} showProduct />
            </div>
            <h3 className="text-lg font-semibold text-white">Agent run</h3>
            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{currentScenario.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
            aria-label="Close agent run"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar min-h-0">
          <div className="flex gap-3 justify-end">
            <div className="bg-white/[0.08] text-zinc-100 text-sm px-5 py-3 rounded-xl rounded-tr-none max-w-[95%] border border-white/[0.1] leading-relaxed">
              {currentScenario.userPrompt}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {playbackState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 min-h-0 flex-1"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                  <Terminal className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1 min-w-0 min-h-0">
                  <GenerativeStreamWidget />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {playbackState === 'idle' && (
            <p className="text-sm text-zinc-500 text-center py-8">
              Press Run in the transport dock to stream the agent trace.
            </p>
          )}
        </div>

        {currentStep && (
          <div className="px-6 py-4 border-t border-white/[0.08] shrink-0">
            <button
              onClick={() => openDrawerForStep(currentStep)}
              className="w-full text-center text-sm text-zinc-300 hover:text-white py-2.5 rounded-lg hover:bg-white/[0.08] transition-colors font-medium"
            >
              Inspect step {currentStep.stepNumber} →
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};
