import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { AccuracyCurveChart } from './AccuracyCurveChart';
import { FailureTaxonomyChart } from './FailureTaxonomyChart';
import { IncidentFeed } from './IncidentFeed';
import { MetricCard } from '../common/MetricCard';
import { PROVIDER_CONFIG, SPONSOR_ORDER } from '../../utils/providerConfig';
import { Download } from 'lucide-react';

const SPONSOR_STATS = {
  elevenlabs: { passRate: 94.2, flagged: 5.8, mttc: 142 },
  freshworks_studio: { passRate: 91.8, flagged: 8.2, mttc: 178 },
  dodo_payments: { passRate: 98.6, flagged: 1.4, mttc: 124 },
};

export const AnalyticsDashboard: React.FC = () => {
  const { batches } = useAgentRun();
  const currentBatch = batches[batches.length - 1];
  const sparklineFlagged = batches.map((b) => b.flaggedRate);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-display text-white">Insights</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Reliability across sponsor agent platforms
          </p>
        </div>
        <button
          onClick={() => alert('Exporting audit report...')}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-xs self-start"
        >
          <Download className="w-3.5 h-3.5" />
          Export report
        </button>
      </div>

      {/* Per-sponsor KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SPONSOR_ORDER.map((id) => {
          const config = PROVIDER_CONFIG[id];
          const stats = SPONSOR_STATS[id];
          return (
            <div
              key={id}
              className="glass-card p-4"
              style={{ borderTop: `2px solid ${config.accent}` }}
            >
              <p className="text-[11px] text-zinc-500">{config.productName}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-white">{stats.passRate}%</span>
                <span className="text-xs text-emerald-400">pass rate</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-zinc-500">
                <span>{stats.flagged}% flagged</span>
                <span>{stats.mttc}ms MTTC</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${stats.passRate}%`, backgroundColor: config.accent }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard
          title="Overall flagged rate"
          value={`${currentBatch?.flaggedRate ?? 14.2}%`}
          subtitle="Down from 31.4% cold-start"
          accent="red"
          trend={{ value: '-17.2%', direction: 'down', isPositive: true }}
          sparklineData={sparklineFlagged}
        />
        <MetricCard
          title="Mean time to catch"
          value={`${currentBatch?.mttcMs ?? 164} ms`}
          subtitle="Across all platforms"
          accent="green"
          trend={{ value: '-76ms', direction: 'down', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <p className="text-sm font-medium text-white mb-1">Error rate trend</p>
          <p className="text-xs text-zinc-500 mb-4">Batch-over-batch improvement</p>
          <AccuracyCurveChart batches={batches} />
        </div>
        <div className="glass-card p-5">
          <FailureTaxonomyChart />
        </div>
      </div>

      <div className="glass-card p-5">
        <IncidentFeed />
      </div>
    </div>
  );
};
