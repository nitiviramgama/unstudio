import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Layers, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  Plus, 
  Bookmark, 
  TrendingUp 
} from 'lucide-react';
import { EventData, PlatformPost, ScheduledPostItem } from '../../types';

interface DashboardViewProps {
  user: { name: string; email: string; organization: string };
  events: EventData[];
  posts: PlatformPost[];
  scheduledPosts: ScheduledPostItem[];
  onOpenCreateEvent: () => void;
  onOpenEventStudio: (event: EventData) => void;
  onNavigateToView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  events,
  posts,
  scheduledPosts,
  onOpenCreateEvent,
  onOpenEventStudio,
  onNavigateToView
}) => {
  const publishedCount = posts.filter(p => p.publishingStatus === 'published').length + 1; // includes seeded published posts
  const scheduledCount = scheduledPosts.filter(s => s.status === 'scheduled').length;

  const statCards = [
    { label: 'Total Events', value: events.length, icon: Bookmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Generated Posts', value: posts.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Published Posts', value: publishedCount, icon: Send, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Scheduled Posts', value: scheduledCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* SaaS Welcome Header (Section 22) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Storytelling Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Let's create amazing content for your next event. Describe what happened in simple words, and AI will turn it into authentic, publish-ready stories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-2 px-5 py-3 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Section 22) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions (Section 22) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Create Event', icon: Sparkles, action: onOpenCreateEvent, color: 'text-indigo-600' },
            { label: 'Content Studio', icon: FileText, action: () => onNavigateToView('content-studio'), color: 'text-purple-600' },
            { label: 'Create Carousel', icon: Layers, action: () => onNavigateToView('carousel'), color: 'text-pink-600' },
            { label: 'Create Reel', icon: Video, action: () => onNavigateToView('reel'), color: 'text-amber-600' },
            { label: 'View Calendar', icon: Calendar, action: () => onNavigateToView('calendar'), color: 'text-sky-600' }
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.action}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition text-left group flex flex-col justify-between h-28"
              >
                <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center ${action.color} group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                  {action.label} →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Events (Section 22) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Events</h3>
            <p className="text-xs text-slate-500">Pick any event to view generated posts or edit story</p>
          </div>
          <button
            onClick={() => onNavigateToView('saved-events')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            View all ({events.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                  <img
                    src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md text-white ${
                      event.status === 'published' ? 'bg-emerald-600/90' : 'bg-indigo-600/90'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[11px] font-medium text-white/90 bg-slate-950/70 px-2 py-0.5 rounded">
                    {event.type}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition line-clamp-1">
                    {event.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.context}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onOpenEventStudio(event)}
                  className="w-full py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <span>Open in Content Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
