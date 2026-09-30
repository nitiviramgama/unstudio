import React, { useState } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Building2, 
  Trash2, 
  Copy, 
  ArrowRight, 
  Search, 
  Plus 
} from 'lucide-react';
import { EventData } from '../../types';
import { useToast } from '../ui/Toast';

interface SavedEventsViewProps {
  events: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
  onOpenEvent: (event: EventData) => void;
  onOpenCreateEvent: () => void;
}

export const SavedEventsView: React.FC<SavedEventsViewProps> = ({
  events,
  setEvents,
  onOpenEvent,
  onOpenCreateEvent
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event removed from library', 'info');
  };

  const handleDuplicateEvent = (event: EventData) => {
    const duplicated: EventData = {
      ...event,
      id: `evt-${Date.now()}`,
      name: `${event.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [duplicated, ...prev]);
    showToast(`Created duplicate of "${event.name}"`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Event Archive
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Saved Events & Past Memories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access past campus festivals, tech conferences, workshops, and sports galas.
          </p>
        </div>

        <button
          onClick={onOpenCreateEvent}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Event</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, department, or type..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-500">
          <strong>{filteredEvents.length}</strong> events stored
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 bg-slate-900">
                <img
                  src={evt.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80'}
                  alt={evt.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                    {evt.type}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                  {evt.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {evt.context}
                </p>

                <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.organizer}</span>
                  </div>
                </div>

                {evt.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {evt.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {h}
                      </span>
                    ))}
                    {evt.highlights.length > 2 && (
                      <span className="text-[10px] font-medium text-slate-400 self-center">
                        +{evt.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDuplicateEvent(evt)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                  title="Duplicate event"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onOpenEvent(evt)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
              >
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
