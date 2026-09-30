import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  PenTool, 
  Layers, 
  Video, 
  Image as ImageIcon, 
  Calendar as CalendarIcon, 
  Bookmark, 
  Building2, 
  Share2, 
  Settings as SettingsIcon,
  ChevronRight,
  X
} from 'lucide-react';

export type ActiveView = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'create-event'
  | 'content-studio'
  | 'carousel'
  | 'reel'
  | 'media'
  | 'calendar'
  | 'saved-events'
  | 'brand'
  | 'connected-accounts'
  | 'settings';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  user: { name: string; email: string; organization: string };
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
  user,
  isDemoMode
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-event', label: 'Create Event', icon: Sparkles, badge: 'AI' },
    { id: 'content-studio', label: 'Content Studio', icon: PenTool },
    { id: 'carousel', label: 'Carousel Generator', icon: Layers },
    { id: 'reel', label: 'Reel Script Generator', icon: Video },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarIcon },
    { id: 'saved-events', label: 'Saved Events', icon: Bookmark },
    { id: 'brand', label: 'Brand Profile', icon: Building2 },
    { id: 'connected-accounts', label: 'Connected Accounts', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId as ActiveView);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                AI Content Studio
              </span>
              <span className="text-[11px] text-indigo-400 block font-medium">
                Event Storyteller & Social AI
              </span>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mx-4 mt-3 px-3 py-2 bg-indigo-950/60 border border-indigo-800/60 rounded-lg text-xs text-indigo-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong>Demo Mode Ready</strong>
            </span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              Live Mockup
            </span>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => handleNavClick('login')}
              title="Click to view Login Screen"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.organization}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('settings')}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Settings"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('login')}
            className="w-full py-1.5 px-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] font-medium transition text-center"
          >
            Switch Account / Login Screen
          </button>
        </div>
      </aside>
    </>
  );
};
