import React, { useLayoutEffect, useRef } from 'react';
import { ControlBar } from './ControlBar';
import { StepStrip } from './StepStrip';

const DOCK_CSS_VAR = '--chrome-dock-height';

export const TransportDock: React.FC = () => {
  const dockRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = dockRef.current;
    if (!el) return;

    const syncHeight = () => {
      const height = el.offsetHeight;
      document.documentElement.style.setProperty(DOCK_CSS_VAR, `${height}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty(DOCK_CSS_VAR, '0px');
    };
  }, []);

  return (
    <div
      ref={dockRef}
      className="shrink-0 z-30 px-4 pb-4 pt-2 sm:px-6 sm:pb-6"
      data-chrome-dock
    >
      <div
        className="mx-auto w-full max-w-3xl glass-card rounded-2xl p-4 shadow-modal-depth flex flex-col gap-3"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <ControlBar compact />
        <div className="border-t border-white/[0.08] pt-3">
          <StepStrip />
        </div>
      </div>
    </div>
  );
};
