import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Globe, Sparkles } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface FacebookPreviewProps {
  post: PlatformPost;
  event?: EventData;
  orgName?: string;
  orgLogo?: string;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  post,
  event,
  orgName = 'GITI Official Community',
  orgLogo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
}) => {
  const displayImage = event?.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80';

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* Facebook Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <img
            src={orgLogo}
            alt={orgName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-slate-900 leading-tight hover:underline cursor-pointer">
                {orgName}
              </span>
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">✓</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span>Yesterday at 3:45 PM</span>
              <span>•</span>
              <Globe className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3" />
          <span>Community Post</span>
        </div>
      </div>

      {/* Post Text */}
      <div className="px-4 py-3 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
        {post.content}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 text-blue-600 font-semibold">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
        <img
          src={displayImage}
          alt={event?.name || 'Event Cover'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Engagement Counter */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center">👍</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">❤️</span>
          </div>
          <span>194</span>
        </div>
        <div className="flex items-center gap-3">
          <span>32 comments</span>
          <span>12 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 grid grid-cols-3 gap-1 text-slate-600 text-xs font-semibold">
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <ThumbsUp className="w-4 h-4 text-slate-500" />
          <span>Like</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <MessageCircle className="w-4 h-4 text-slate-500" />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 rounded-lg transition">
          <Share2 className="w-4 h-4 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
