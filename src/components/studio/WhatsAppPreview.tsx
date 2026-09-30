import React from 'react';
import { CheckCheck, Sparkles, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface WhatsAppPreviewProps {
  post: PlatformPost;
  event?: EventData;
  groupName?: string;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  post,
  groupName = 'Department & Student Broadcast'
}) => {
  return (
    <div className="max-w-md mx-auto bg-[#0b141a] text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-sans">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#202c33] px-3.5 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            📢
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white leading-tight">{groupName}</h4>
            <span className="text-[10px] text-emerald-400">Official Channel • Broadcast</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Video className="w-4 h-4" />
          <Phone className="w-4 h-4" />
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Chat Wallpaper Background */}
      <div className="p-4 bg-[#0b141a] min-h-[300px] flex flex-col justify-end">
        {/* Date chip */}
        <div className="text-center mb-3">
          <span className="bg-[#182229] text-[10px] text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-semibold shadow-xs">
            Today
          </span>
        </div>

        {/* Message Bubble */}
        <div className="bg-[#005c4b] text-slate-100 p-3.5 rounded-2xl rounded-tl-xs shadow-md max-w-sm ml-auto relative">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Event Broadcast</span>
          </div>

          <div className="text-xs leading-relaxed whitespace-pre-line text-white">
            {post.content}
          </div>

          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-emerald-200/80">
            <span>10:42 AM</span>
            <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Bottom Mock Input Bar */}
      <div className="bg-[#202c33] p-2.5 flex items-center gap-2 text-slate-400 text-xs border-t border-slate-800">
        <span className="p-1">😊</span>
        <Paperclip className="w-4 h-4" />
        <div className="flex-1 bg-[#2a3942] text-slate-300 px-3 py-1.5 rounded-lg text-xs">
          Message
        </div>
        <span className="p-1">🎤</span>
      </div>
    </div>
  );
};
