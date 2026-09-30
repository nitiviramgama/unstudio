import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Share2, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { ScheduledPostItem, Platform } from '../../types';
import { useToast } from '../ui/Toast';

interface CalendarViewProps {
  scheduledPosts: ScheduledPostItem[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<ScheduledPostItem[]>>;
  onOpenCreateEvent: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  scheduledPosts,
  setScheduledPosts,
  onOpenCreateEvent
}) => {
  const { showToast } = useToast();
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = scheduledPosts.filter(item => {
    if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
    showToast('Post removed from calendar', 'info');
  };

  const handleMarkPublished = (id: string) => {
    setScheduledPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
    showToast('Post marked as published!', 'success');
  };

  const getPlatformIcon = (plat: Platform) => {
    switch (plat) {
      case 'instagram': return '📸';
      case 'linkedin': return '💼';
      case 'facebook': return '👥';
      case 'x': return '🐦';
      case 'whatsapp': return '💬';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Content Planner
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Publishing Calendar & Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate social media releases across Instagram, LinkedIn, Facebook, X, and WhatsApp.
          </p>
        </div>

        <button
          onClick={onOpenCreateEvent}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter by:</span>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="x">X (Twitter)</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> items
        </span>
      </div>

      {/* Calendar List View (Section 20 & 37) */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  {getPlatformIcon(item.platform)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.eventName}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-indigo-600">{item.accountHandle}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'scheduled'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                    "{item.preview}"
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Scheduled for: {new Date(item.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                {item.status === 'scheduled' && (
                  <button
                    onClick={() => handleMarkPublished(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove from calendar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No scheduled posts found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting the filters or schedule a post from the Content Studio.</p>
          </div>
        )}
      </div>

    </div>
  );
};
