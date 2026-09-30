import React from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe2, Sparkles } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface LinkedInPreviewProps {
  post: PlatformPost;
  event?: EventData;
  orgName?: string;
  orgLogo?: string;
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  post,
  event,
  orgName = 'Global Institute of Technology & Innovation',
  orgLogo = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80'
}) => {
  const displayImage = event?.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80';

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* LinkedIn Header */}
      <div className="p-4 flex items-start justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={orgLogo}
            alt={orgName}
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 leading-tight hover:underline cursor-pointer">
                {orgName}
              </span>
              <span className="text-[11px] text-slate-400">• 1st</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              Higher Education & Research • 48,200 followers
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <span>1d • Edited</span>
              <span>•</span>
              <Globe2 className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          <Sparkles className="w-3 h-3" />
          <span>Professional Impact</span>
        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-4 py-3 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
        {post.content}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 text-indigo-700 font-semibold">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Attached Media */}
      <div className="relative aspect-16/9 bg-slate-900 overflow-hidden border-y border-slate-100">
        <img
          src={displayImage}
          alt={event?.name || 'Event Cover'}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-slate-950/75 backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium text-white">
          {event?.name || 'Event Highlights'}
        </div>
      </div>

      {/* Engagement Counter */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center">👍</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">💡</span>
            <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center">👏</span>
          </div>
          <span className="hover:underline cursor-pointer">342 reactions</span>
        </div>
        <div className="flex items-center gap-2 hover:underline cursor-pointer">
          <span>48 comments</span>
          <span>•</span>
          <span>16 reposts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1.5 grid grid-cols-4 gap-1 text-slate-600 text-xs font-semibold">
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <ThumbsUp className="w-4 h-4 text-slate-500" />
          <span>Like</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <Repeat2 className="w-4 h-4 text-slate-500" />
          <span>Repost</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <Send className="w-4 h-4 text-slate-500" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
