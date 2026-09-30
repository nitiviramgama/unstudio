import React from 'react';
import { Menu, Plus, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ActiveView } from './Sidebar';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  setMobileOpen: (open: boolean) => void;
  onOpenCreateModal: () => void;
  isDemoMode: boolean;
  onLoadDemoEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  setMobileOpen,
  onOpenCreateModal,
  isDemoMode,
  onLoadDemoEvent,
}) => {
  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of events and social publishing' };
      case 'create-event':
        return { title: 'Create Event Story', subtitle: 'Turn real event experiences into platform-ready posts' };
      case 'content-studio':
        return { title: 'Content Studio', subtitle: 'Review, edit, and optimize platform-specific posts' };
      case 'carousel':
        return { title: 'Instagram Carousel Generator', subtitle: 'Transform event moments into multi-slide stories' };
      case 'reel':
        return { title: 'Reel Script Generator', subtitle: '30-second high-energy video timeline and voiceovers' };
      case 'media':
        return { title: 'Media Library', subtitle: 'Event imagery with AI captions & alt tags' };
      case 'calendar':
        return { title: 'Content Calendar', subtitle: 'Draft, scheduled, and published social media posts' };
      case 'saved-events':
        return { title: 'Saved Events', subtitle: 'Archive of past fests, workshops, and corporate activities' };
      case 'brand':
        return { title: 'Brand Profile', subtitle: 'Custom organization guidelines & voice preferences' };
      case 'connected-accounts':
        return { title: 'Connected Accounts', subtitle: 'Social media platform accounts and publishing status' };
      case 'settings':
        return { title: 'Settings', subtitle: 'System preferences, AI parameters, and demo controls' };
      default:
        return { title: 'AI Content Studio', subtitle: 'From Event Experience to Publish-Ready Social Media' };
    }
  };

  const { title, subtitle } = getHeaderTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {title}
            {activeView === 'content-studio' && (
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                Studio Active
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Instant Demo loader button */}
        <button
          onClick={onLoadDemoEvent}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition shadow-xs"
          title="Load Technofest 2026 Sample"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Load Technofest Demo</span>
        </button>

        {/* View Landing page */}
        <button
          onClick={() => setActiveView('landing')}
          className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          title="Product Tour"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>

        {/* View Login Screen */}
        <button
          onClick={() => setActiveView('login')}
          className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          title="Login Screen"
        >
          <span>Login Screen</span>
        </button>

        {/* Create Event Primary CTA */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Create Event</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>
    </header>
  );
};
