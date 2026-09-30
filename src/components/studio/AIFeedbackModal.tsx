import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, CheckCircle2, RotateCcw, Wand2, Loader2, ArrowLeftRight } from 'lucide-react';
import { PlatformPost, EventData } from '../../types';

interface AIFeedbackModalProps {
  post: PlatformPost;
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
  onApplyImprovement: (improvedPost: PlatformPost) => void;
}

export const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({
  post,
  event,
  isOpen,
  onClose,
  onApplyImprovement
}) => {
  const [feedbackPrompt, setFeedbackPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [improvedResult, setImprovedResult] = useState<{
    improvedPost: PlatformPost;
    changesMade: string[];
  } | null>(null);

  if (!isOpen) return null;

  const quickChips = [
    { label: 'Make it more energetic', prompt: 'Make it more energetic and add enthusiastic opening hook.' },
    { label: 'Add faculty contribution', prompt: 'Mention how faculty guided and mentored the students.' },
    { label: 'Make it shorter', prompt: 'Make it shorter and more concise for quick scanning.' },
    { label: 'Make it more professional', prompt: 'Make it more professional and suitable for executive readers.' },
    { label: 'Highlight students', prompt: 'Put stronger emphasis on student projects and experiences.' },
    { label: 'Add more hashtags', prompt: 'Add 3-4 more relevant and trending hashtags.' },
    { label: 'Make it more emotional', prompt: 'Emphasize the human warmth and community connection.' },
    { label: 'Reduce emojis', prompt: 'Keep emojis minimal and subtle.' }
  ];

  const handleImprove = async () => {
    if (!feedbackPrompt.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/content/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          feedback: feedbackPrompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to improve post');
      }

      const data = await response.json();
      setImprovedResult(data);
    } catch (err) {
      console.error('Improvement error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (improvedResult) {
      onApplyImprovement(improvedResult.improvedPost);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Improve with AI Feedback
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {post.platform}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Tell AI what you want to refine, and it will update the existing text while preserving factual truth.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Quick feedback chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeedbackPrompt(chip.prompt)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition ${
                    feedbackPrompt === chip.prompt
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Feedback Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              How would you like to improve this post?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={feedbackPrompt}
                onChange={(e) => setFeedbackPrompt(e.target.value)}
                placeholder="e.g. Make it more energetic and mention how faculty guided the students..."
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
              />
              <button
                onClick={handleImprove}
                disabled={isLoading || !feedbackPrompt.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-2 disabled:opacity-50 transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Improving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Improve Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Split comparison view */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Original Box */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Original Version (v{post.versions[post.activeVersionIndex]?.versionNumber || 1})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {post.content.length} chars
                </span>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto max-h-64 font-sans">
                {post.content}
              </div>
            </div>

            {/* AI Improved Box */}
            <div className={`rounded-xl border p-4 flex flex-col transition-all ${
              improvedResult 
                ? 'bg-purple-50/50 border-purple-200 shadow-md shadow-purple-500/10' 
                : 'bg-slate-50/50 border-dashed border-slate-300 items-center justify-center text-center'
            }`}>
              {improvedResult ? (
                <>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-200">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      AI Improved Version (v{improvedResult.improvedPost.versions.length})
                    </span>
                    <span className="text-[11px] text-purple-600 font-mono font-semibold">
                      {improvedResult.improvedPost.content.length} chars
                    </span>
                  </div>

                  <div className="text-xs text-slate-900 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto max-h-56 font-sans">
                    {improvedResult.improvedPost.content}
                  </div>

                  {/* Changes Made breakdown */}
                  {improvedResult.changesMade?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-200/80 bg-white/80 p-2.5 rounded-lg">
                      <p className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Changes Made:
                      </p>
                      <ul className="space-y-1">
                        {improvedResult.changesMade.map((change, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 px-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Ready for your input</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Select a quick chip or type instructions above to see a live comparison side-by-side.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setImprovedResult(null)}
            disabled={!improvedResult}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Comparison</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!improvedResult}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
