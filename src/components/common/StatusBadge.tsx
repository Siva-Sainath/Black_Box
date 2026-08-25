import React from 'react';
import { cn } from '../../utils/cn';
import { ScenarioCategory, ScenarioRunResult } from '../../types';

interface StatusBadgeProps {
  type?: 'category' | 'result' | 'severity';
  value: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type = 'result',
  value,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  // Category
  if (type === 'category') {
    const cat = value as ScenarioCategory;
    switch (cat) {
      case 'trap':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Trap Case
          </span>
        );
      case 'clean':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Clean Baseline
          </span>
        );
      case 'edge_case':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-zinc-800 border border-white/[0.1] text-zinc-200', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Edge Case
          </span>
        );
      default:
        return <span className={cn('rounded bg-zinc-900 border border-white/[0.08] text-zinc-300', sizeClasses, className)}>{value}</span>;
    }
  }

  // Result
  if (type === 'result') {
    const res = value as ScenarioRunResult;
    switch (res) {
      case 'passed':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Passed (Nominal)
          </span>
        );
      case 'failed_and_caught':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Caught & Flagged
          </span>
        );
      case 'failed_and_missed':
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-red-500/10 border border-red-500/20 text-red-300', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Missed Anomaly
          </span>
        );
      case 'pending':
      default:
        return (
          <span className={cn('inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-zinc-900 border border-white/[0.08] text-zinc-400', sizeClasses, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            Pending Run
          </span>
        );
    }
  }

  // Severity
  if (type === 'severity') {
    switch (value.toLowerCase()) {
      case 'critical':
        return (
          <span className={cn('inline-flex items-center font-mono font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5 text-[10px]', className)}>
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className={cn('inline-flex items-center font-mono font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5 text-[10px]', className)}>
            HIGH
          </span>
        );
      default:
        return (
          <span className={cn('inline-flex items-center font-mono font-medium text-zinc-300 bg-zinc-800 border border-white/[0.08] rounded px-2 py-0.5 text-[10px]', className)}>
            MEDIUM
          </span>
        );
    }
  }

  return <span className={cn('rounded bg-zinc-900 border border-white/[0.08] text-zinc-300', sizeClasses, className)}>{value}</span>;
};
