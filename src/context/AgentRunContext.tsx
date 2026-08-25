import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ScreenType,
  Scenario,
  RunStep,
  PlaybackState,
  CorrectionRule,
  AnalyticsBatch,
  Incident,
  BrainNode,
} from '../types';
import { MOCK_SCENARIOS as INITIAL_SCENARIOS } from '../data/mockScenarios';
import { ANALYTICS_BATCHES, RECENT_INCIDENTS } from '../data/mockAnalytics';
import { BRAIN_NODES } from '../data/mockNodes';
import { sounds } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

interface AgentRunContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  scenarios: Scenario[];
  currentScenario: Scenario;
  setCurrentScenarioById: (id: string) => void;
  playbackState: PlaybackState;
  currentStepIndex: number;
  activeNodeId: string | null;
  nodes: BrainNode[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedStepForDrawer: RunStep | null;
  setSelectedStepForDrawer: (step: RunStep | null) => void;
  openDrawerForStep: (step: RunStep) => void;
  openDrawerForNodeId: (nodeId: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  playRun: () => void;
  pauseRun: () => void;
  stepForward: () => void;
  resetRun: () => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
  
  // Correction Workflow (Screen 5)
  correctionStep: number;
  setCorrectionStep: (step: number) => void;
  activeCorrectionRule: string;
  setActiveCorrectionRule: (rule: string) => void;
  isApplyingMemory: boolean;
  isMemoryApplied: boolean;
  applyMemoryRule: () => Promise<void>;
  isVerifying: boolean;
  isVerified: boolean;
  runVerificationReplay: () => Promise<void>;
  startCorrectionFlowForCurrentScenario: () => void;
  
  // Analytics & Batch runner
  batches: AnalyticsBatch[];
  incidents: Incident[];
  isBatchRunning: boolean;
  batchProgress: number;
  runBatchSimulation: () => Promise<void>;
  
  // Modals
  isBackendModalOpen: boolean;
  setIsBackendModalOpen: (open: boolean) => void;
  isShortcutModalOpen: boolean;
  setIsShortcutModalOpen: (open: boolean) => void;
}

const AgentRunContext = createContext<AgentRunContextType | undefined>(undefined);

export const AgentRunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('screen1_brain');
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('SCN-1082');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedStepForDrawer, setSelectedStepForDrawer] = useState<RunStep | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  
  // Screen 5 Correction States
  const [correctionStep, setCorrectionStep] = useState<number>(1);
  const [activeCorrectionRule, setActiveCorrectionRule] = useState<string>(
    'RULE-402: Prior to authorizing refund dispatch > $100, enforce strict check against get_carrier_tracking_events() API. If status != "DELIVERED_CONFIRMED", block automated refund and dispatch customer status notification.'
  );
  const [isApplyingMemory, setIsApplyingMemory] = useState<boolean>(false);
  const [isMemoryApplied, setIsMemoryApplied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // Batch simulation
  const [batches, setBatches] = useState<AnalyticsBatch[]>(ANALYTICS_BATCHES);
  const [incidents, setIncidents] = useState<Incident[]>(RECENT_INCIDENTS);
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);
  
  // Modals
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentScenario = scenarios.find((s) => s.id === currentScenarioId) || scenarios[0];
  const activeStep = currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;
  const activeNodeId = activeStep ? activeStep.nodeId : null;

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsSoundMuted(muted);
  };

  const setCurrentScenarioById = (id: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentScenarioId(id);
    setPlaybackState('idle');
    setCurrentStepIndex(-1);
    setIsDrawerOpen(false);
    setSelectedStepForDrawer(null);
    sounds.playClick();
  };

  // Node drawer trigger
  const openDrawerForStep = (step: RunStep) => {
    setSelectedStepForDrawer(step);
    setIsDrawerOpen(true);
    sounds.playClick();
  };

  const openDrawerForNodeId = (nodeId: string) => {
    const step = currentScenario.steps.find((s) => s.nodeId === nodeId) || currentScenario.steps[0];
    if (step) {
      openDrawerForStep(step);
    }
  };

  // Step advancement logic
  const stepForward = useCallback(() => {
    const steps = currentScenario.steps;
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < steps.length) {
      const step = steps[nextIndex];
      setCurrentStepIndex(nextIndex);

      if (step.status === 'flagged') {
        // Flagged moment! Stop playback and highlight
        setPlaybackState('flagged');
        sounds.playFlagAlert();
        // Auto open drawer if preferred or let user click
      } else {
        sounds.playStepTick(440 + nextIndex * 70);
        if (nextIndex === steps.length - 1) {
          setPlaybackState(currentScenario.hasActiveCorrection ? 'complete_verified' : 'complete_nominal');
          sounds.playSuccessChime();
        } else {
          setPlaybackState('running');
        }
      }
    } else {
      setPlaybackState(currentScenario.hasActiveCorrection ? 'complete_verified' : 'complete_nominal');
    }
  }, [currentScenario, currentStepIndex]);

  // Auto playback loop
  useEffect(() => {
    if (playbackState === 'running') {
      const stepDelay = Math.max(350, 1400 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        stepForward();
      }, stepDelay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playbackState, currentStepIndex, playbackSpeed, stepForward]);

  const playRun = () => {
    sounds.playClick();
    if (playbackState === 'flagged' || playbackState === 'complete_nominal' || playbackState === 'complete_verified') {
      // restart
      setCurrentStepIndex(0);
      setPlaybackState('running');
      sounds.playStepTick(440);
    } else if (playbackState === 'idle') {
      setCurrentStepIndex(0);
      setPlaybackState('running');
      sounds.playStepTick(440);
    } else {
      setPlaybackState('running');
    }
  };

  const pauseRun = () => {
    sounds.playClick();
    setPlaybackState('idle');
  };

  const resetRun = () => {
    sounds.playClick();
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIndex(-1);
    setPlaybackState('idle');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (playbackState === 'running') {
          pauseRun();
        } else {
          playRun();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        resetRun();
      } else if (e.key === 'ArrowRight') {
        stepForward();
      } else if (e.key === '1') {
        setCurrentScreen('screen1_brain');
      } else if (e.key === '2') {
        if (selectedStepForDrawer || currentScenario.steps[0]) {
          openDrawerForStep(selectedStepForDrawer || currentScenario.steps[4] || currentScenario.steps[0]);
        }
      } else if (e.key === '3') {
        setCurrentScreen('screen3_sandbox');
      } else if (e.key === '4') {
        setCurrentScreen('screen4_analytics');
      } else if (e.key === '5') {
        setCurrentScreen('screen5_correction');
      } else if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsBackendModalOpen(false);
        setIsShortcutModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackState, selectedStepForDrawer, currentScenario]);

  // Start Screen 5 Correction flow
  const startCorrectionFlowForCurrentScenario = () => {
    setIsDrawerOpen(false);
    setCorrectionStep(1);
    setIsMemoryApplied(false);
    setIsVerified(false);
    setCurrentScreen('screen5_correction');
    sounds.playClick();
  };

  // Apply memory rule (Screen 5 Step 4)
  const applyMemoryRule = async () => {
    setIsApplyingMemory(true);
    sounds.playClick();
    await new Promise((r) => setTimeout(r, 1200));
    setIsApplyingMemory(false);
    setIsMemoryApplied(true);
    sounds.playMemoryAbsorbed();
    setCorrectionStep(5);
  };

  // Run Verification Replay (Screen 5 Step 5 Closing Loop)
  const runVerificationReplay = async () => {
    setIsVerifying(true);
    sounds.playClick();
    // Realistic verification execution delay
    await new Promise((r) => setTimeout(r, 1800));

    // Mark current scenario as verified and update steps
    setScenarios((prev) =>
      prev.map((scn) => {
        if (scn.id === currentScenarioId) {
          const updatedSteps = scn.steps.map((step) => {
            if (step.status === 'flagged') {
              return {
                ...step,
                status: 'verified' as const,
                stepName: 'Independent Tracking Verified & Action Safe-Guarded',
                reasoning:
                  'RULE-402 Applied: Queried carrier webhook & Dodo Payments idempotent ledger. Verified package is in transit with ETA today. Suppressed unauthorized voice refund and sent live tracking assurance to caller.',
                confidenceScore: 98,
                flagReason: undefined,
                internalSignals: {
                  epistemicUncertainty: 4,
                  prematureActionBias: 5,
                  contextDrift: 3,
                  verificationGap: 4,
                },
              };
            }
            return step;
          });
          return {
            ...scn,
            hasActiveCorrection: true,
            lastRunResult: 'passed' as const,
            steps: updatedSteps,
          };
        }
        return scn;
      })
    );

    // Update Analytics Batches with new improved batch (flagged rate ticks down from 14.2% -> 11.8%!)
    setBatches((prev) => {
      const newBatch: AnalyticsBatch = {
        batchId: `BATCH-00${prev.length + 1}`,
        batchName: 'Post-Verification Continuous Run',
        timestamp: 'Just now',
        totalScenarios: 250,
        flaggedRate: 11.8,
        passedRate: 84.4,
        missedRate: 3.8,
        mttcMs: 148,
        activeRulesCount: 29,
        ruleInjected: 'RULE-402: Delivery Status Verification',
      };
      return [...prev, newBatch];
    });

    // Update incidents feed
    setIncidents((prev) =>
      prev.map((inc) => (inc.scenarioId === currentScenarioId ? { ...inc, status: 'corrected' as const } : inc))
    );

    setIsVerifying(false);
    setIsVerified(true);
    sounds.playSuccessChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10B981', '#06B6D4', '#34D399', '#38BDF8'],
      });
    } catch {
      // Ignored if canvas fails
    }
  };

  // Run Batch Simulation (Screen 3)
  const runBatchSimulation = async () => {
    setIsBatchRunning(true);
    setBatchProgress(0);
    sounds.playClick();

    for (let p = 10; p <= 100; p += 15) {
      await new Promise((r) => setTimeout(r, 220));
      setBatchProgress(Math.min(p, 100));
      sounds.playStepTick(300 + p * 3);
    }

    // Refresh scenarios timestamps
    setScenarios((prev) =>
      prev.map((scn) => ({
        ...scn,
        lastRunTimestamp: 'Just now',
      }))
    );

    setIsBatchRunning(false);
    sounds.playSuccessChime();
  };

  return (
    <AgentRunContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        scenarios,
        currentScenario,
        setCurrentScenarioById,
        playbackState,
        currentStepIndex,
        activeNodeId,
        nodes: BRAIN_NODES,
        isDrawerOpen,
        setIsDrawerOpen,
        selectedStepForDrawer,
        setSelectedStepForDrawer,
        openDrawerForStep,
        openDrawerForNodeId,
        playbackSpeed,
        setPlaybackSpeed,
        playRun,
        pauseRun,
        stepForward,
        resetRun,
        isSoundMuted,
        toggleSound,
        
        correctionStep,
        setCorrectionStep,
        activeCorrectionRule,
        setActiveCorrectionRule,
        isApplyingMemory,
        isMemoryApplied,
        applyMemoryRule,
        isVerifying,
        isVerified,
        runVerificationReplay,
        startCorrectionFlowForCurrentScenario,
        
        batches,
        incidents,
        isBatchRunning,
        batchProgress,
        runBatchSimulation,
        
        isBackendModalOpen,
        setIsBackendModalOpen,
        isShortcutModalOpen,
        setIsShortcutModalOpen,
      }}
    >
      {children}
    </AgentRunContext.Provider>
  );
};

export const useAgentRun = () => {
  const context = useContext(AgentRunContext);
  if (!context) {
    throw new Error('useAgentRun must be used within an AgentRunProvider');
  }
  return context;
};
