import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface InstagramPreviewProps {
  post: PlatformPost;
  event?: EventData;
  orgName?: string;
  orgLogo?: string;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  post,
  event,
  orgName = 'giti_official',
  orgLogo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
}) => {
  const displayImage = event?.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80';
  const cleanHandle = orgName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-900 font-sans">
      {/* Instagram Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full ring-2 ring-pink-500/70 p-0.5 overflow-hidden">
            <img src={orgLogo} alt={orgName} className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs text-slate-900">{cleanHandle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">{event?.location || 'Live Event'}</span>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-800 p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative aspect-4/3 bg-slate-900 overflow-hidden group">
        <img
          src={displayImage}
          alt={event?.name || 'Event Photo'}
          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>AI Optimized Post</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-3.5 pt-3 pb-2 flex items-center justify-between text-slate-800">
        <div className="flex items-center gap-4">
          <button className="hover:text-red-500 transition active:scale-125">
            <Heart className="w-6 h-6 stroke-[1.6]" />
          </button>
          <button className="hover:text-slate-600 transition">
            <MessageCircle className="w-6 h-6 stroke-[1.6]" />
          </button>
          <button className="hover:text-slate-600 transition">
            <Send className="w-6 h-6 stroke-[1.6]" />
          </button>
        </div>
        <button className="hover:text-slate-600 transition">
          <Bookmark className="w-6 h-6 stroke-[1.6]" />
        </button>
      </div>

      {/* Likes */}
      <div className="px-3.5 pb-1">
        <span className="text-xs font-semibold text-slate-900">482 likes</span>
      </div>

      {/* Caption Content */}
      <div className="px-3.5 pb-4 text-xs leading-relaxed text-slate-800 space-y-2">
        <div className="whitespace-pre-line">
          <strong className="text-slate-900 mr-1.5">{cleanHandle}</strong>
          {post.content}
        </div>

        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 text-indigo-600 font-medium">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}

        <div className="pt-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
          2 hours ago • Verified by AI Content Studio
        </div>
      </div>
    </div>
  );
};
