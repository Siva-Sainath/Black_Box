import React from 'react';
import { AgentRunProvider, useAgentRun } from './context/AgentRunContext';
import { Header } from './components/common/Header';
import { SimplisticLayout } from './components/SimplisticLayout';
import { ThoughtDetailDrawer } from './components/screen2_drawer/ThoughtDetailDrawer';
import { ScenarioLibrary } from './components/screen3_sandbox/ScenarioLibrary';
import { AnalyticsDashboard } from './components/screen4_analytics/AnalyticsDashboard';
import { CorrectionWorkflow } from './components/screen5_correction/CorrectionWorkflow';
import { BackendModal } from './components/common/BackendModal';
import { ShortcutModal } from './components/common/ShortcutModal';
import { motion, AnimatePresence } from 'framer-motion';

const MainContent: React.FC = () => {
  const { currentScreen } = useAgentRun();

  // If we are on the main Neural Prober screen, use the dedicated Simplistic Middle-Ground Layout
  if (currentScreen === 'screen1_brain') {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505] overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          <SimplisticLayout />
        </div>
        <ThoughtDetailDrawer />
        <BackendModal />
        <ShortcutModal />
      </div>
    );
  }

  // Otherwise, use the standard wrapper for the other dashboard screens
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      <Header />

      <main className="flex-1 max-w-[1780px] w-full mx-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence mode="wait">
          {currentScreen === 'screen3_sandbox' && (
            <motion.div
              key="screen3"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
            >
              <ScenarioLibrary />
            </motion.div>
          )}

          {currentScreen === 'screen4_analytics' && (
            <motion.div
              key="screen4"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
            >
              <AnalyticsDashboard />
            </motion.div>
          )}

          {currentScreen === 'screen5_correction' && (
            <motion.div
              key="screen5"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
            >
              <CorrectionWorkflow />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ThoughtDetailDrawer />
      <BackendModal />
      <ShortcutModal />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AgentRunProvider>
      <MainContent />
    </AgentRunProvider>
  );
};

export default App;
