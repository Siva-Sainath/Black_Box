import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import { useAgentRun } from '../../context/AgentRunContext';
import { MOCK_SCENARIOS } from '../../data/mockScenarios';
import { cn } from '../../utils/cn';
import { SPONSOR_ORDER, getProviderConfig } from '../../utils/providerConfig';
import { Scenario } from '../../types';

interface ScenarioDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ScenarioDrawer: React.FC<ScenarioDrawerProps> = ({ open, onClose }) => {
  const { currentScenario, setCurrentScenarioById } = useAgentRun();

  const scenariosByProvider = SPONSOR_ORDER.map((providerId) => ({
    providerId,
    config: getProviderConfig(providerId)!,
    scenarios: MOCK_SCENARIOS.filter((s) => s.provider === providerId),
  }));

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
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 bottom-0 z-20 w-80 max-w-[90vw] glass-panel border-r border-white/[0.12] flex flex-col shadow-modal-depth"
      >
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">Scenarios</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Eval library</h3>
            <p className="text-sm text-zinc-400 mt-1">6 runs · 3 sponsor platforms</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Close scenarios"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {scenariosByProvider.map(({ providerId, config, scenarios }) => (
            <div key={providerId}>
              <div className="flex items-center gap-2.5 mb-3 px-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: config.accent,
                    boxShadow: `0 0 12px ${config.accent}60`,
                  }}
                />
                <span className="text-sm font-semibold text-white">{config.productName}</span>
              </div>
              <div className="space-y-2">
                {scenarios.map((scenario: Scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setCurrentScenarioById(scenario.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all glass-button',
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
      </motion.aside>
    </>
  );
};
