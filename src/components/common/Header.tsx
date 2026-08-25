import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { ScreenType } from '../../types';
import {
  Activity,
  Layers,
  BarChart3,
  Wrench,
  Volume2,
  VolumeX,
  Keyboard,
  ChevronDown,
  Terminal,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    scenarios,
    currentScenario,
    setCurrentScenarioById,
    isSoundMuted,
    toggleSound,
    setIsShortcutModalOpen,
    setIsBackendModalOpen,
    playbackState,
  } = useAgentRun();

  const navTabs: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'screen1_brain', label: '3D Neural Prober', icon: Activity },
    { id: 'screen3_sandbox', label: 'Multi-Agent Sandbox', icon: Layers },
    { id: 'screen4_analytics', label: 'Telemetry & Evals', icon: BarChart3 },
    { id: 'screen5_correction', label: 'Memory Patching', icon: Wrench },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl px-4 sm:px-6 py-2.5">
      <div className="max-w-[1780px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity (Cursor/Linear Minimalist Style) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            {/* Geometric Minimal Monogram */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.12] text-white font-mono text-xs font-bold shadow-sm">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-white tracking-tight">BLACK BOX</span>
                <span className="font-mono text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06]">
                  v0.9.4
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-white/[0.08] mx-1 hidden md:block" />

          {/* Engine Probe Status Indicator */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                playbackState === 'flagged'
                  ? 'bg-red-500 animate-ping'
                  : playbackState === 'running'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-zinc-500'
              )}
            />
            <span className="text-zinc-500">PROBE:</span>
            <span
              className={cn(
                'font-medium',
                playbackState === 'flagged'
                  ? 'text-red-400'
                  : playbackState === 'running'
                  ? 'text-emerald-400'
                  : 'text-zinc-300'
              )}
            >
              {playbackState === 'flagged'
                ? 'ANOMALY INTERCEPTED'
                : playbackState === 'running'
                ? 'ACTIVE STREAMING'
                : 'IDLE STANDBY'}
            </span>
          </div>
        </div>

        {/* Center: Segmented Navigation Pill (Cursor / Linear Style) */}
        <nav className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-colors group',
                  isActive ? 'text-black font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-tab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className={cn('w-3.5 h-3.5 relative z-10', isActive ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-400')} />
                <span className="relative z-10">{tab.label}</span>
                {tab.id === 'screen5_correction' && (
                  <span className={cn("relative z-10 w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-600" : "bg-emerald-400")} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Scenario Selector & Utilities */}
        <div className="flex items-center gap-2">
          {/* Scenario Selector Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-white/[0.08] hover:border-white/[0.16] transition-colors cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={currentScenario.id}
                onChange={(e) => setCurrentScenarioById(e.target.value)}
                className="bg-transparent text-xs font-mono text-zinc-200 focus:outline-none cursor-pointer pr-4 max-w-[220px] truncate"
              >
                {scenarios.map((scn) => {
                  const prefix = scn.provider === 'elevenlabs' ? '[11Labs]' : scn.provider === 'dodo_payments' ? '[Dodo]' : scn.provider === 'freshworks_studio' ? '[Freshworks]' : '[Voice]';
                  return (
                    <option key={scn.id} value={scn.id} className="bg-zinc-900 text-zinc-200 font-mono">
                      {prefix} {scn.id}: {scn.name.slice(0, 24)}...
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-400 pointer-events-none -ml-3" />
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.16] transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-zinc-200" />}
          </button>

          {/* Shortcut Trigger (⌘K) */}
          <button
            onClick={() => setIsShortcutModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400 hover:text-white hover:border-white/[0.16] transition-colors"
            title="Keyboard Shortcuts"
          >
            <span>⌘K</span>
          </button>

          {/* API Backend Trigger */}
          <button
            onClick={() => setIsBackendModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API Spec</span>
          </button>
        </div>
      </div>
    </header>
  );
};
