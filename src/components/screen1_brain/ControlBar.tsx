import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Play, Pause, RotateCcw, SkipForward, Eye, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ControlBar: React.FC = () => {
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#09090b] px-4 py-2.5">
      {/* Left: Task Name & Live Step Counter */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-white">
          <Sparkles className="h-4 w-4 text-zinc-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">
              {currentScenario.name}
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300 border border-white/[0.06]">
              {currentScenario.id}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-white font-medium">
              {currentStepIndex === -1 ? 'Standby' : `Step ${currentStepIndex + 1}/${totalSteps}`}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 truncate max-w-md">
              {currentStep ? currentStep.stepName : 'Press Space to start 3D neural stream'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Playback Controls (Cursor/Linear Style) */}
      <div className="flex items-center gap-1.5">
        {/* Reset Button */}
        <button
          onClick={resetRun}
          title="Reset to start (R)"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.16] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Primary Play/Pause (White button with black text) */}
        {playbackState === 'running' ? (
          <button
            onClick={pauseRun}
            title="Pause (Space)"
            className="flex items-center gap-1.5 rounded-lg bg-white text-black px-4 py-1.5 text-xs font-medium hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <Pause className="h-3.5 w-3.5 fill-current" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={playRun}
            title="Start Inference Stream (Space)"
            className="flex items-center gap-1.5 rounded-lg bg-white text-black px-4 py-1.5 text-xs font-medium hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{playbackState === 'idle' ? 'Run Scenario' : 'Resume'}</span>
          </button>
        )}

        {/* Step Forward */}
        <button
          onClick={stepForward}
          title="Step Forward (→)"
          disabled={playbackState === 'running'}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.16] disabled:opacity-40 transition-colors"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>

        {/* Speed Multipliers */}
        <div className="ml-2 flex items-center rounded-lg bg-zinc-900 border border-white/[0.08] p-0.5 text-[11px] font-mono">
          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                'px-2 py-0.5 rounded transition-colors',
                playbackSpeed === speed
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Right: Drawer Inspector Trigger */}
      <div>
        <button
          onClick={() => {
            const stepToInspect =
              currentStep ||
              currentScenario.steps.find((s) => s.status === 'flagged') ||
              currentScenario.steps[0];
            openDrawerForStep(stepToInspect);
          }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
            playbackState === 'flagged'
              ? 'bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 shadow-sm'
              : 'bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.16]'
          )}
        >
          {playbackState === 'flagged' ? (
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-zinc-400" />
          )}
          <span>Inspect SAE Latents</span>
        </button>
      </div>
    </div>
  );
};
