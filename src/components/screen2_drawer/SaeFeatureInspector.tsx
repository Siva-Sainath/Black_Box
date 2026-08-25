import React, { useState } from 'react';
import { SaeFeatureDetails } from '../../types';
import { cn } from '../../utils/cn';
import {
  Brain,
  BarChart3,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

interface SaeFeatureInspectorProps {
  saeFeature: SaeFeatureDetails;
  isFlagged: boolean;
}

export const SaeFeatureInspector: React.FC<SaeFeatureInspectorProps> = ({ saeFeature, isFlagged }) => {
  const [clampingValue, setClampingValue] = useState<number>(saeFeature.activationSigma);
  const [isClamped, setIsClamped] = useState<boolean>(false);

  const handleClampToggle = () => {
    if (isClamped) {
      setClampingValue(saeFeature.activationSigma);
      setIsClamped(false);
    } else {
      setClampingValue(0.0);
      setIsClamped(true);
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-4 space-y-4 font-mono text-xs">
      {/* SAE Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-white tracking-wide">
            SAE Latent Dictionary Profile
          </span>
        </div>
        <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-300 border border-white/[0.08]">
          Dict: 65,536 Latents
        </span>
      </div>

      {/* Latent Identification Card */}
      <div
        className={cn(
          'p-3.5 rounded-xl border space-y-2 transition-colors',
          isFlagged && !isClamped
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-zinc-900/60 border-white/[0.06]'
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{saeFeature.featureId}</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400 border border-white/[0.06]">
                Layer {saeFeature.layerIndex} Residual Stream
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-200 mt-1">
              "{saeFeature.monosemanticLabel}"
            </p>
          </div>

          {/* Activation Amplitude Meter */}
          <div className="text-right">
            <span className="text-[10px] uppercase text-zinc-500 block">Activation</span>
            <span
              className={cn(
                'text-lg font-bold',
                clampingValue > 3 ? 'text-red-400' : 'text-emerald-400'
              )}
            >
              +{clampingValue.toFixed(2)}σ
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/[0.06] pt-2">
          {saeFeature.explanation}
        </p>
      </div>

      {/* Direct Logit Attribution (DLA) Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-zinc-300 uppercase flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
            Direct Logit Attribution ($W_U$ Projection)
          </span>
          <span className="text-zinc-500 text-[10px]">Softmax Odds Shift</span>
        </div>

        <div className="space-y-1.5">
          {saeFeature.logitAttributions.map((la, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className={la.isPromoted ? 'text-red-300' : 'text-emerald-300'}>
                  <code>{la.token}</code>
                </span>
                <span className={cn('font-bold', la.isPromoted ? 'text-red-400' : 'text-emerald-400')}>
                  {la.attribution > 0 ? `+${la.attribution}%` : `${la.attribution}%`}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    la.isPromoted ? 'bg-red-500' : 'bg-emerald-400'
                  )}
                  style={{ width: `${Math.abs(la.attribution)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upstream Mechanistic Circuit Decomposition */}
      <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] space-y-1 text-[11px]">
        <span className="text-[10px] uppercase text-zinc-500 block font-semibold">
          Upstream Attention & MLP Circuit Pathway:
        </span>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="rounded bg-zinc-900 border border-white/[0.08] px-2 py-0.5">
            {saeFeature.circuitSource}
          </span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
          <span className="rounded bg-red-950/40 border border-red-500/30 text-red-300 px-2 py-0.5 font-bold">
            {saeFeature.featureId}
          </span>
        </div>
      </div>

      {/* Interactive Activation Clamping / Synaptic Steering Simulator */}
      <div className="p-3.5 rounded-xl border border-white/[0.1] bg-zinc-900/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-300" />
            <span className="font-semibold text-white text-xs">
              Live Mechanistic Activation Clamping
            </span>
          </div>
          <button
            onClick={handleClampToggle}
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors',
              isClamped
                ? 'bg-emerald-500 text-black font-semibold'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            )}
          >
            {isClamped ? '✓ Clamped (0.00σ)' : 'Clamp to 0.0σ'}
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Ablate (0.0σ)</span>
            <span className="text-white font-bold">Current: {clampingValue.toFixed(2)}σ</span>
            <span>Boost (+5.0σ)</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={clampingValue}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setClampingValue(val);
              setIsClamped(val === 0);
            }}
            className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        <div className="text-[10px] text-zinc-400 leading-tight">
          {clampingValue === 0 ? (
            <span className="text-emerald-400 font-medium">
              ✓ Clamping this SAE latent to 0.0σ suppresses premature refund generation and forces the model into ground-truth courier verification.
            </span>
          ) : (
            <span>
              Adjust slider to test how steering this sparse dictionary vector alters downstream decision logits.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
