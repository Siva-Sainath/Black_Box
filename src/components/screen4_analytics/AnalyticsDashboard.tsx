import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { MetricCard } from '../common/MetricCard';
import { AccuracyCurveChart } from './AccuracyCurveChart';
import { FailureTaxonomyChart } from './FailureTaxonomyChart';
import { IncidentFeed } from './IncidentFeed';
import {
  BarChart3,
  Layers,
  Clock,
  ShieldCheck,
  Download,
  Calendar,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { batches } = useAgentRun();

  const currentBatch = batches[batches.length - 1] || {
    flaggedRate: 14.2,
    totalScenarios: 250,
    mttcMs: 164,
    activeRulesCount: 28,
  };

  const sparklineFlagged = batches.map((b) => b.flaggedRate);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#09090b] p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-white tracking-tight">
              Accuracy & Reliability Telemetry
            </h1>
            <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 border border-white/[0.06]">
              Audit Grade
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Aggregate reliability progression across consecutive evaluation batches with persistent memory rule injections.
          </p>
        </div>

        {/* Date / Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-xs font-mono text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Past 7 Days (6 Batches)</span>
          </div>

          <button
            onClick={() => alert('Exporting audit PDF & JSON telemetry trace...')}
            className="flex items-center gap-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Current Flagged Error Rate"
          value={`${currentBatch.flaggedRate}%`}
          subtitle="Down from 31.4% base cold-start"
          accent="red"
          trend={{
            value: '-17.2%',
            direction: 'down',
            isPositive: true,
          }}
          sparklineData={sparklineFlagged}
        />

        <MetricCard
          title="Total Scenarios Evaluated"
          value="1,480"
          subtitle="Across 6 batch runs"
          accent="cyan"
          icon={Layers}
          trend={{
            value: '+250 new',
            direction: 'up',
            isPositive: true,
          }}
        />

        <MetricCard
          title="Mean Time to Catch (MTTC)"
          value={`${currentBatch.mttcMs} ms`}
          subtitle="Continuous background probe"
          accent="green"
          icon={Clock}
          trend={{
            value: '-76ms speedup',
            direction: 'down',
            isPositive: true,
          }}
        />

        <MetricCard
          title="Active Memory Rules"
          value={`${currentBatch.activeRulesCount} Rules`}
          subtitle="98.2% regression immunity"
          accent="amber"
          icon={ShieldCheck}
          trend={{
            value: '+4 this cycle',
            direction: 'up',
            isPositive: true,
          }}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Accuracy Curve */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.08] bg-[#09090b] p-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 font-mono">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                Batch-Over-Batch Error Rate Reduction
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Empirical learning curve convergence with each rule injection
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Flagged Error Rate (%)</span>
            </div>
          </div>

          <AccuracyCurveChart batches={batches} />
        </div>

        {/* Right 1 Col: Taxonomy Breakdown */}
        <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5">
          <FailureTaxonomyChart />
        </div>
      </div>

      {/* Bottom Row: Recent Incidents */}
      <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5">
        <IncidentFeed />
      </div>
    </div>
  );
};
