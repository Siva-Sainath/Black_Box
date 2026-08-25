import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import {
  CheckCircle2,
  RotateCw,
  Play,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Activity,
} from 'lucide-react';

export const Step5Verify: React.FC = () => {
  const {
    currentScenario,
    isVerifying,
    isVerified,
    runVerificationReplay,
    setCurrentScreen,
    playRun,
  } = useAgentRun();

  const handleReturnToBrainReplay = () => {
    setCurrentScreen('screen1_brain');
    setTimeout(() => {
      playRun();
    }, 150);
  };

  const handleGoToAnalytics = () => {
    setCurrentScreen('screen4_analytics');
  };

  return (
    <div className="space-y-4 animate-fade-in font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Step 5: Empirical Sandbox Verification (Closing the Loop)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">
            Re-run the exact trap scenario in the empirical test harness to prove the mistake has been permanently prevented.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5 space-y-5">
        {/* Verification Trigger Banner */}
        {!isVerified ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-white/[0.06] bg-black">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-white uppercase block">
                Target Scenario: {currentScenario.id} — {currentScenario.name}
              </span>
              <p className="text-xs text-zinc-400">
                Execute fresh inference run with RULE-402 active to verify full policy compliance.
              </p>
            </div>

            <button
              onClick={runVerificationReplay}
              disabled={isVerifying}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 px-5 py-2 font-semibold transition-colors disabled:opacity-50 shrink-0 shadow-sm"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Verification Harness...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Verification Re-test</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Verified Success Card */
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Verification Complete — 100% Policy Parity
                  </h3>
                  <p className="text-xs text-emerald-300">
                    The agent successfully queried carrier tracking, caught the pending status, and safely declined premature refund!
                  </p>
                </div>
              </div>
              <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 uppercase">
                PASSED (0 Flags)
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-black/60 border border-emerald-900/30">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Pre-Fix State</span>
                <span className="text-red-400 font-semibold">Flagged (Unverified Refund)</span>
              </div>
              <div className="p-3 rounded-lg bg-black/60 border border-emerald-900/30">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Post-Fix State</span>
                <span className="text-emerald-400 font-semibold">Passed (Tracking Verified)</span>
              </div>
              <div className="p-3 rounded-lg bg-black/60 border border-emerald-900/30">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Latency</span>
                <span className="text-white font-semibold">148 ms (Nominal)</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Proof: Aggregate Accuracy Curve Uptick */}
        <div className="p-4 rounded-xl border border-white/[0.06] bg-black space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
              Live Telemetry Proof: Accuracy Curve Uptick
            </span>
            <span className="text-[10px] text-emerald-400">
              {isVerified ? '✓ Batch #7 Telemetry Recorded' : 'Awaiting Re-run'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 block text-[11px]">Flagged Error Rate:</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-zinc-600 line-through">14.2%</span>
                <span className="text-base font-bold text-emerald-400">
                  {isVerified ? '11.8%' : '14.2%'}
                </span>
                {isVerified && (
                  <span className="flex items-center text-xs text-emerald-400 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -2.4% gain
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block text-[11px]">Total Active Rules:</span>
              <span className="text-base font-semibold text-white mt-1 block">
                {isVerified ? '29 Rules' : '28 Rules'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[11px]">Mean Time to Catch:</span>
              <span className="text-base font-semibold text-white mt-1 block">
                {isVerified ? '148 ms' : '164 ms'}
              </span>
            </div>
          </div>
        </div>

        {/* Closing Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            onClick={handleGoToAnalytics}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/[0.08] px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/[0.16] transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Updated Analytics</span>
          </button>

          <button
            onClick={handleReturnToBrainReplay}
            className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-5 py-2 text-xs font-semibold transition-colors shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Replay in 3D Brain View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
