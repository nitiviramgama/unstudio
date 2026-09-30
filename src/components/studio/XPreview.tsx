import React from 'react';
import { MessageSquare, Repeat, Heart, Bookmark, Share, Sparkles } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface XPreviewProps {
  post: PlatformPost;
  event?: EventData;
  orgName?: string;
  orgHandle?: string;
  orgAvatar?: string;
}

export const XPreview: React.FC<XPreviewProps> = ({
  post,
  event,
  orgName = 'GITI Campus News',
  orgHandle = '@GITI_Campus',
  orgAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
}) => {
  const isOverLimit = post.charCount > 280;

  return (
    <div className="max-w-xl mx-auto bg-black text-white rounded-2xl border border-neutral-800 shadow-xl p-4 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={orgAvatar}
            alt={orgName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                {orgName}
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-black text-[9px] flex items-center justify-center font-bold">✓</span>
              <span className="text-neutral-400 text-xs">{orgHandle}</span>
              <span className="text-neutral-500 text-xs">· 4h</span>
            </div>
            <span className="text-[11px] text-neutral-400 block">{event?.location || 'Live Announcement'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/60">
          <Sparkles className="w-3 h-3" />
          <span>Concise Hook</span>
        </div>
      </div>

      {/* Tweet Body */}
      <div className="mt-3 text-sm text-neutral-100 leading-relaxed whitespace-pre-line pl-12">
        {post.content}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 text-sky-400">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Character count pill */}
      <div className="mt-3 pl-12 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800 pt-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs px-2 py-0.5 rounded ${
            isOverLimit ? 'bg-rose-900/60 text-rose-300 font-bold' : 'bg-neutral-800 text-neutral-300'
          }`}>
            {post.charCount} / 280 chars
          </span>
          {isOverLimit && (
            <span className="text-rose-400 text-[11px]">Warning: Exceeds X character limit</span>
          )}
        </div>
        <span className="text-[11px] text-neutral-500">Post ready</span>
      </div>

      {/* Tweet action bar */}
      <div className="mt-2 pl-12 flex items-center justify-between text-neutral-400 text-xs max-w-md">
        <button className="flex items-center gap-1.5 hover:text-sky-400 transition">
          <MessageSquare className="w-4 h-4" />
          <span>28</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-emerald-400 transition">
          <Repeat className="w-4 h-4" />
          <span>44</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-rose-400 transition">
          <Heart className="w-4 h-4" />
          <span>168</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-sky-400 transition">
          <Bookmark className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1.5 hover:text-sky-400 transition">
          <Share className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
