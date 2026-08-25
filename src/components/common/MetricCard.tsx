import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive: boolean;
  };
  icon?: LucideIcon;
  accent?: 'green' | 'red' | 'cyan' | 'amber';
  sparklineData?: number[];
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accent = 'cyan',
  sparklineData,
  className,
}) => {
  // SVG Sparkline path generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 72;
    const height = 24;

    const points = sparklineData
      .map((d, i) => {
        const x = (i / (sparklineData.length - 1)) * width;
        const y = height - ((d - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible opacity-60 hover:opacity-100 transition-opacity">
        <polyline
          fill="none"
          stroke={accent === 'red' ? '#EF4444' : accent === 'green' ? '#10B981' : '#FFFFFF'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      className={cn(
        'group rounded-xl border border-white/[0.08] bg-[#09090b] p-4 transition-all duration-150 hover:border-white/[0.16]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400">{title}</span>
        {Icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold font-mono tracking-tight text-white">
            {value}
          </span>
          {subtitle && <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>}
        </div>

        {sparklineData && <div className="ml-2">{renderSparkline()}</div>}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono">
          {trend.direction === 'down' ? (
            <TrendingDown className={cn('h-3.5 w-3.5', trend.isPositive ? 'text-emerald-400' : 'text-red-400')} />
          ) : (
            <TrendingUp className={cn('h-3.5 w-3.5', trend.isPositive ? 'text-emerald-400' : 'text-red-400')} />
          )}
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-red-400 font-medium'}>
            {trend.value}
          </span>
          <span className="text-zinc-500">vs prev</span>
        </div>
      )}
    </div>
  );
};
