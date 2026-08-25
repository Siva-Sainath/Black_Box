import React from 'react';
import { SPONSOR_ORDER, PROVIDER_CONFIG } from '../../utils/providerConfig';

export const SponsorShowcase: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div
      className={
        compact
          ? 'flex items-center gap-3'
          : 'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-2.5 px-4 border-b border-white/[0.06] bg-black/40'
      }
    >
      {!compact && (
        <span className="text-[11px] text-zinc-500 shrink-0">
          Evaluating agents built on
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {SPONSOR_ORDER.map((id) => {
          const config = PROVIDER_CONFIG[id];
          return (
            <div
              key={id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
              style={{ boxShadow: `inset 0 1px 0 ${config.glow}` }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: config.accent }}
              />
              <span className="text-xs font-medium text-zinc-200">{config.shortName}</span>
              {!compact && (
                <span className="text-[10px] text-zinc-500 hidden md:inline">
                  {config.productName}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
