import React from 'react';
import { useAgentRun } from '../context/AgentRunContext';
import { MOCK_SCENARIOS } from '../data/mockScenarios';
import { BrainCanvas3D } from './screen1_brain/BrainCanvas3D';
import { ExecutionTimeline } from './screen1_brain/ExecutionTimeline';
import { ControlBar } from './screen1_brain/ControlBar';
import { GenerativeStreamWidget } from './generative_ui/GenerativeStreamWidget';
import { Terminal } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { ProviderBadge } from './common/ProviderBadge';
import { SPONSOR_ORDER, getProviderConfig } from '../utils/providerConfig';
import { Scenario } from '../types';

export const SimplisticLayout: React.FC = () => {
  const {
    currentScenario,
    setCurrentScenarioById,
    playbackState,
    currentStepIndex,
    openDrawerForStep,
  } = useAgentRun();

  const scenariosByProvider = SPONSOR_ORDER.map((providerId) => ({
    providerId,
    config: getProviderConfig(providerId)!,
    scenarios: MOCK_SCENARIOS.filter((s) => s.provider === providerId),
  }));

  const currentStep =
    currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;

  return (
    <div className="flex h-full w-full bg-prober-dark text-zinc-100 overflow-hidden">
      {/* Left: scenarios grouped by sponsor */}
      <div className="w-72 sm:w-80 border-r border-white/[0.12] glass-panel flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/[0.08]">
          <h3 className="text-lg font-semibold text-white">Scenarios</h3>
          <p className="text-sm text-zinc-400 mt-1">6 evaluations across 3 platforms</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {scenariosByProvider.map(({ providerId, config, scenarios }) => (
            <div key={providerId}>
              <div className="flex items-center gap-2.5 mb-3 px-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-lg"
                  style={{
                    backgroundColor: config.accent,
                    boxShadow: `0 0 12px ${config.accent}60`,
                  }}
                />
                <span className="text-sm font-semibold text-white">
                  {config.productName}
                </span>
              </div>
              <div className="space-y-2">
                {scenarios.map((scenario: Scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setCurrentScenarioById(scenario.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border backdrop-blur transition-all glass-button',
                      currentScenario.id === scenario.id
                        ? 'bg-white/[0.12] border-white/[0.2]'
                        : ''
                    )}
                  >
                    <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
                      {scenario.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1.5 font-mono">{scenario.id}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: 3D + controls */}
      <div className="flex-1 relative overflow-hidden flex flex-col min-w-0">
        <div className="flex-1 relative min-h-0">
          <BrainCanvas3D />
        </div>

        <div className="shrink-0 px-6 pb-5 space-y-3 z-10">
          <ControlBar />
          <ExecutionTimeline />
        </div>
      </div>

      {/* Right: agent run output */}
      <div
        className="w-96 sm:w-[480px] shrink-0 border-l border-white/[0.12] glass-panel flex flex-col"
        style={{
          boxShadow: currentScenario.provider
            ? `inset 2px 0 24px ${getProviderConfig(currentScenario.provider)?.glow ?? 'transparent'}`
            : undefined,
        }}
      >
        <div className="px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5 mb-2">
            <ProviderBadge provider={currentScenario.provider} showProduct />
          </div>
          <h3 className="text-lg font-semibold text-white">Agent run</h3>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{currentScenario.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          <div className="flex gap-3 justify-end">
            <div className="bg-white/[0.08] text-zinc-100 text-sm px-5 py-3 rounded-xl rounded-tr-none max-w-[95%] border border-white/[0.1] leading-relaxed backdrop-blur-sm">
              {currentScenario.userPrompt}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {playbackState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                  <Terminal className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <GenerativeStreamWidget />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {currentStep && (
          <div className="px-6 py-4 border-t border-white/[0.08]">
            <button
              onClick={() => openDrawerForStep(currentStep)}
              className="w-full text-center text-sm text-zinc-300 hover:text-white py-2.5 rounded-lg hover:bg-white/[0.08] transition-colors font-medium"
            >
              Inspect step {currentStep.stepNumber} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
