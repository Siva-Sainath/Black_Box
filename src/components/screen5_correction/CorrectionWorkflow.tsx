import React from 'react';
import { useAgentRun } from '../../context/AgentRunContext';
import { Step1Review } from './Step1Review';
import { Step2Confirm } from './Step2Confirm';
import { Step3Generate } from './Step3Generate';
import { Step4Apply } from './Step4Apply';
import { Step5Verify } from './Step5Verify';
import { cn } from '../../utils/cn';
import { GitCompare, UserCheck, Sparkles, HardDrive, ShieldCheck, Check } from 'lucide-react';

export const CorrectionWorkflow: React.FC = () => {
  const { correctionStep, setCorrectionStep } = useAgentRun();

  const steps = [
    { number: 1, label: 'Review', icon: GitCompare, desc: 'Side-by-side Diff' },
    { number: 2, label: 'Confirm', icon: UserCheck, desc: 'Human Validation' },
    { number: 3, label: 'Generate', icon: Sparkles, desc: 'Rule Synthesis' },
    { number: 4, label: 'Apply', icon: HardDrive, desc: 'Memory Absorption' },
    { number: 5, label: 'Verify', icon: ShieldCheck, desc: 'Harness Proof' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 5-Step Horizontal Stepper Header (Linear Style) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-3">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((step, idx) => {
            const isCurrent = correctionStep === step.number;
            const isCompleted = correctionStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => setCorrectionStep(step.number)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0',
                    isCurrent
                      ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.12]'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0',
                      isCurrent
                        ? 'bg-white text-black'
                        : isCompleted
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : `0${step.number}`}
                  </div>

                  <div className="text-left">
                    <div className="font-semibold">{step.label}</div>
                    <div className="text-[10px] text-zinc-500 hidden md:block">{step.desc}</div>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="hidden sm:block text-zinc-600 font-mono text-xs">→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Render Current Step Component */}
      <div>
        {correctionStep === 1 && <Step1Review onNext={() => setCorrectionStep(2)} />}
        {correctionStep === 2 && <Step2Confirm onNext={() => setCorrectionStep(3)} />}
        {correctionStep === 3 && <Step3Generate onNext={() => setCorrectionStep(4)} />}
        {correctionStep === 4 && <Step4Apply onNext={() => setCorrectionStep(5)} />}
        {correctionStep === 5 && <Step5Verify />}
      </div>
    </div>
  );
};
