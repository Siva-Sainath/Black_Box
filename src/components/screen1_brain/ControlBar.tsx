import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Play, Pause, RotateCcw, SkipForward, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ControlBarProps {
  compact?: boolean;
  className?: string;
}

export const ControlBar: React.FC<ControlBarProps> = ({ compact = false, className }) => {
  const {
    currentScenario,
    currentStepIndex,
    playbackState,
    playRun,
    pauseRun,
    stepForward,
    resetRun,
    playbackSpeed,
    setPlaybackSpeed,
    openDrawerForStep,
  } = useAgentRun();

  const totalSteps = currentScenario.steps.length;
  const currentStep = currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;

  const inspectButton = (
    <button
      onClick={() => {
        const stepToInspect =
          currentStep ||
          currentScenario.steps.find((s) => s.status === 'flagged') ||
          currentScenario.steps[0];
        openDrawerForStep(stepToInspect);
      }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all shrink-0',
        playbackState === 'flagged'
          ? 'bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30'
          : 'bg-white/[0.08] border border-white/[0.12] text-zinc-200 hover:text-white hover:bg-white/[0.12]'
      )}
    >
      {playbackState === 'flagged' ? (
        <ShieldAlert className="h-4 w-4 text-red-400" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
      <span>Inspect</span>
    </button>
  );

  const playbackControls = (
    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
      <button
        onClick={resetRun}
        title="Reset (R)"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      {playbackState === 'running' ? (
        <button
          onClick={pauseRun}
          title="Pause (Space)"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-zinc-100 transition-colors shrink-0"
        >
          <Pause className="h-4 w-4 fill-current" />
          Pause
        </button>
      ) : (
        <button
          onClick={playRun}
          title="Start (Space)"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-zinc-100 transition-colors shrink-0"
        >
          <Play className="h-4 w-4 fill-current" />
          {playbackState === 'idle' ? 'Run' : 'Resume'}
        </button>
      )}

      <button
        onClick={stepForward}
        title="Step (→)"
        disabled={playbackState === 'running'}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.1] text-zinc-300 hover:text-white disabled:opacity-40 transition-colors shrink-0"
      >
        <SkipForward className="h-4 w-4" />
      </button>

      <div className="flex items-center rounded-lg bg-white/[0.06] border border-white/[0.1] p-1 text-xs font-mono shrink-0">
        {[0.5, 1, 2, 4].map((speed) => (
          <button
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            className={cn(
              'px-2.5 py-1 rounded transition-colors text-xs font-medium',
              playbackSpeed === speed
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className={cn('flex flex-col gap-3 min-w-0', className)}>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-white truncate max-w-full">
                {currentScenario.name}
              </span>
              <span className="rounded px-2 py-0.5 font-mono text-xs text-zinc-400 border border-white/[0.08] bg-white/[0.03] shrink-0">
                {currentScenario.id}
              </span>
            </div>
            <div className="mt-0.5 text-xs font-mono text-zinc-400">
              <span className="text-zinc-200 font-medium">
                {currentStepIndex === -1 ? 'Standby' : `Step ${currentStepIndex + 1}/${totalSteps}`}
              </span>
            </div>
          </div>
          {inspectButton}
        </div>
        {playbackControls}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-4 gap-y-3',
        'rounded-xl border border-white/[0.08] bg-[#09090b] px-4 py-2.5',
        className
      )}
    >
      {/* Left: Task Name & Live Step Counter */}
      <div className="flex items-center gap-3.5 min-w-0">
        {!compact && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/[0.1] text-white shrink-0">
            <Sparkles className="h-4 w-4 text-zinc-200" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('font-semibold text-white truncate', compact ? 'text-xs' : 'text-sm')}>
              {currentScenario.name}
            </span>
            <span className="rounded px-2 py-0.5 font-mono text-xs text-zinc-400 border border-white/[0.08] bg-white/[0.03] shrink-0">
              {currentScenario.id}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-zinc-200 font-medium shrink-0">
              {currentStepIndex === -1 ? 'Standby' : `Step ${currentStepIndex + 1}/${totalSteps}`}
            </span>
            {!compact && (
              <>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-300 truncate max-w-xl">
                  {currentStep ? currentStep.stepName : 'Ready to run'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Playback Controls */}
      {playbackControls}

      {/* Right: Inspector */}
      {inspectButton}
    </div>
  );
};
