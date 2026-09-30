import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface ProcessingScreenProps {
  eventName: string;
  onComplete?: () => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ eventName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing event details & context',
    'Extracting key moments & highlights',
    'Understanding experiences & participant feedback',
    'Verifying factual integrity (zero hallucination)',
    'Creating platform-specific content (Instagram, LinkedIn, X...)',
    'Optimizing for engagement & readability',
    'Finalizing publish-ready story...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl mx-auto my-6 text-center animate-in fade-in duration-300">
      
      {/* Animated AI Glowing Orb */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 animate-spin blur-xl opacity-40 absolute"></div>
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-400 flex items-center justify-center shadow-2xl shadow-purple-500/40 relative z-10 animate-pulse-subtle">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Titles */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Creating Your Content...
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        Our AI is understanding <strong className="text-slate-800">{eventName || 'your event'}</strong> and crafting authentic, platform-optimized stories.
      </p>

      {/* Step Progression List (Section 31) */}
      <div className="mt-8 w-full max-w-md bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isDone
                  ? 'text-slate-700 font-medium'
                  : isCurrent
                  ? 'text-indigo-600 font-bold scale-[1.01]'
                  : 'text-slate-400 opacity-50'
              }`}
            >
              {isDone && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              {isCurrent && (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              )}
              {!isDone && !isCurrent && (
                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                </div>
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Guaranteed factual accuracy • No fabricated quotes</span>
      </div>

    </div>
  );
};
