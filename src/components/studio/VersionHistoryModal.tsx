import React from 'react';
import { History, X, Check, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { PlatformPost, ContentVersion } from '../../types';

interface VersionHistoryModalProps {
  post: PlatformPost;
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (versionIndex: number) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  post,
  isOpen,
  onClose,
  onRestoreVersion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Version History — {post.platform.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500">
                Compare iterations or restore a previous version of this post.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Versions list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {post.versions.map((ver, idx) => {
            const isCurrent = idx === post.activeVersionIndex;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Version {ver.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active Version
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        onRestoreVersion(idx);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  )}
                </div>

                {ver.feedbackUsed && (
                  <div className="mb-2 text-xs text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>Feedback applied: "{ver.feedbackUsed}"</span>
                  </div>
                )}

                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed line-clamp-4">
                  {ver.content}
                </div>

                {ver.changesMade && ver.changesMade.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Changes:</span>
                    {ver.changesMade.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
