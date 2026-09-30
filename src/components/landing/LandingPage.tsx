import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Video, 
  Calendar, 
  Share2, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  Star 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
  onOpenAuth
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            AI Content Studio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </button>
          <button
            onClick={onExploreDemo}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition"
          >
            Launch Studio →
          </button>
        </div>
      </nav>

      {/* Hero Section (Section 28) */}
      <header className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>From Event Experience to Publish-Ready Social Media Content</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Turn Your Event Experience Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Stunning Social Media Content
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Give AI your event details, experiences and feedback. Get platform-ready posts, captions, carousels and more in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-xl shadow-xl shadow-purple-600/30 active:scale-95 transition flex items-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-xl transition flex items-center gap-2"
          >
            <span>⚡ Watch Demo (Technofest 2026)</span>
          </button>
        </div>

        {/* Hero Visual Mockup Card (Section 28) */}
        <div className="pt-8 relative max-w-4xl mx-auto">
          <div className="p-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-left border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Event preview side */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AI Live Adaptation</span>
                </div>
                <h3 className="text-xl font-bold text-white">Technofest 2026 — Recap</h3>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans space-y-2">
                  <p className="text-purple-300 font-semibold">"What an electrifying two days at Technofest 2026! 🚀✨"</p>
                  <p>Students participated in intense 24-hr coding competitions & hands-on AI workshops. Mentored by faculty every step of the way!</p>
                  <div className="flex gap-2 text-[11px] text-indigo-400 font-mono">
                    <span>#Technofest2026</span>
                    <span>#InnovationInAction</span>
                  </div>
                </div>
              </div>

              {/* Floating badges & platforms */}
              <div className="md:col-span-6 space-y-3">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-pink-400 font-semibold">
                    📸 Instagram Hook & Visual Emojis
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">96% Fit</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-blue-400 font-semibold">
                    💼 LinkedIn Impact & Mentorship Focus
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">98% Fit</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-sky-400 font-semibold">
                    🐦 X Concise Tweet (&lt; 280 chars)
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">95% Fit</span>
                </div>
                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/40 flex items-center gap-2 text-xs text-purple-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict zero-hallucination factual guardrails applied</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </header>

      {/* Metrics Bar (Section 28) */}
      <section className="border-y border-slate-800 bg-slate-950/50 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              10K+
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Events Created</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              50K+
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Posts Generated</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              100+
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Organizations</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              95%
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Section 28) */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Everything You Need to Tell Your Event's Story
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From technical hackathons and cultural galas to sports championships and corporate conferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              ✨
            </div>
            <h3 className="font-bold text-base text-white">AI Post Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tell what happened in simple natural language. The AI extracts key moments, participants, and quotes without prompt engineering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              🎯
            </div>
            <h3 className="font-bold text-base text-white">Platform Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never publish generic copy. Adapt custom tones for Instagram hooks, LinkedIn professional depth, Facebook warmth, and X brevity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              🔄
            </div>
            <h3 className="font-bold text-base text-white">AI Feedback Loop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask AI to "make it more energetic" or "mention faculty guidance." It modifies the existing post directly with side-by-side comparison.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Carousel Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate 6-slide Instagram carousel decks with visual photo recommendations, student spotlights, and impactful hooks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Reel Script Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timed 0–30 second short scripts with voiceover audio, kinetic on-screen text, camera scenes, and trending soundtrack suggestions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Content Calendar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule, preview, and organize social media posts in one unified calendar with direct status tracking.
            </p>
          </div>

        </div>
      </section>

      {/* Footer Banner */}
      <footer className="border-t border-slate-800 py-12 px-6 text-center text-xs text-slate-500 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            ✨
          </div>
          <span className="font-bold text-slate-300">AI Content Studio</span>
        </div>
        <p>You tell us what happened. AI tells your story.</p>
        <p className="text-[11px] text-slate-600">Built with Google AI Studio • Gemini 3.8 Flash Engine</p>
      </footer>

    </div>
  );
};
