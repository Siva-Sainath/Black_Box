import React from 'react';
import { AgentRunProvider, useAgentRun } from './context/AgentRunContext';
import { AppShell } from './components/common/AppShell';
import { ProberLayout } from './components/ProberLayout';
import { ThoughtDetailDrawer } from './components/screen2_drawer/ThoughtDetailDrawer';
import { ScenarioLibrary } from './components/screen3_sandbox/ScenarioLibrary';
import { AnalyticsDashboard } from './components/screen4_analytics/AnalyticsDashboard';
import { CorrectionWorkflow } from './components/screen5_correction/CorrectionWorkflow';
import { BackendModal } from './components/common/BackendModal';
import { ShortcutModal } from './components/common/ShortcutModal';
import { motion, AnimatePresence } from 'framer-motion';

const MainContent: React.FC = () => {
  const { currentScreen } = useAgentRun();

  if (currentScreen === 'screen1_brain') {
    return (
      <AppShell fullBleed showSponsorStrip={false}>
        <div className="flex-1 min-h-0">
          <ProberLayout />
        </div>
        <ThoughtDetailDrawer />
        <BackendModal />
        <ShortcutModal />
      </AppShell>
    );
  }

  return (
    <AppShell showSponsorStrip>
      <AnimatePresence mode="wait">
        {currentScreen === 'screen3_sandbox' && (
          <motion.div
            key="screen3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <ScenarioLibrary />
          </motion.div>
        )}

        {currentScreen === 'screen4_analytics' && (
          <motion.div
            key="screen4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <AnalyticsDashboard />
          </motion.div>
        )}

        {currentScreen === 'screen5_correction' && (
          <motion.div
            key="screen5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <CorrectionWorkflow />
          </motion.div>
        )}
      </AnimatePresence>

      <ThoughtDetailDrawer />
      <BackendModal />
      <ShortcutModal />
    </AppShell>
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
