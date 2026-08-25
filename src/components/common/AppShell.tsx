import React, { useState } from 'react';
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
  Terminal,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { SponsorShowcase } from './SponsorShowcase';
import { BlackBoxLogo } from './BlackBoxLogo';

const NAV_ITEMS: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'screen1_brain', label: 'Prober', icon: Activity },
  { id: 'screen3_sandbox', label: 'Evals', icon: Layers },
  { id: 'screen4_analytics', label: 'Insights', icon: BarChart3 },
  { id: 'screen5_correction', label: 'Fixes', icon: Wrench },
];

interface AppShellProps {
  children: React.ReactNode;
  fullBleed?: boolean;
  showSponsorStrip?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  fullBleed = false,
  showSponsorStrip = true,
}) => {
  const {
    currentScreen,
    setCurrentScreen,
    playbackState,
    isSoundMuted,
    toggleSound,
    setIsShortcutModalOpen,
    setIsBackendModalOpen,
  } = useAgentRun();

  const [menuOpen, setMenuOpen] = useState(false);

  const playbackLabel =
    playbackState === 'flagged'
      ? 'Flagged'
      : playbackState === 'running'
      ? 'Running'
      : 'Idle';

  return (
    <div className="min-h-screen flex bg-black text-zinc-100 font-sans" style={{
      backgroundImage: `
        radial-gradient(ellipse 120% 60% at 50% -10%, rgba(56, 189, 248, 0.12), transparent 50%),
        radial-gradient(ellipse 100% 50% at 100% 10%, rgba(168, 85, 247, 0.08), transparent 50%),
        radial-gradient(ellipse 80% 40% at 0% 100%, rgba(251, 191, 36, 0.05), transparent 60%)
      `
    }}>
      {/* Left rail */}
      <aside className="w-16 sm:w-64 shrink-0 border-r border-white/[0.12] glass-panel flex flex-col z-30">
        <div className="p-4 sm:px-6 sm:py-5 border-b border-white/[0.08]">
          <div className="hidden sm:block">
            <BlackBoxLogo size="sm" showText />
          </div>
          <div className="sm:hidden flex items-center justify-center">
            <BlackBoxLogo size="sm" showText={false} />
          </div>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-black shadow-lg'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08]'
                )}
                title={item.label}
              >
                <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-black' : 'text-zinc-500')} />
                <span className="hidden sm:inline text-base">{item.label}</span>
                {item.id === 'screen5_correction' && !isActive && (
                  <span className="hidden sm:block w-2 h-2 rounded-full bg-emerald-400 ml-auto shadow-lg" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden sm:block px-4 py-3 border-t border-white/[0.08] text-xs text-zinc-500">
          v0.9.4 • Hackathon demo
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="shrink-0 border-b border-white/[0.12] bg-black/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shrink-0 font-medium',
                playbackState === 'flagged'
                  ? 'border-red-500/40 bg-red-500/15 text-red-300'
                  : playbackState === 'running'
                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/[0.1] bg-white/[0.06] text-zinc-400'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  playbackState === 'flagged'
                    ? 'bg-red-400 animate-pulse'
                    : playbackState === 'running'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-zinc-600'
                )}
              />
              {playbackLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.08] border border-white/[0.12] text-zinc-300 hover:text-white text-sm transition-colors hover:bg-white/[0.12]"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Menu</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-white/[0.1] bg-zinc-950 shadow-modal-depth py-1">
                    <button
                      onClick={() => { toggleSound(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06]"
                    >
                      {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isSoundMuted ? 'Unmute' : 'Mute sounds'}
                    </button>
                    <button
                      onClick={() => { setIsShortcutModalOpen(true); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06]"
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      Shortcuts (⌘K)
                    </button>
                    <button
                      onClick={() => { setIsBackendModalOpen(true); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06]"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      API spec
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {showSponsorStrip && <SponsorShowcase />}

        <main
          className={cn(
            'flex-1 flex flex-col min-h-0 overflow-hidden',
            !fullBleed && 'max-w-6xl w-full mx-auto p-4 sm:p-6 overflow-y-auto'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
