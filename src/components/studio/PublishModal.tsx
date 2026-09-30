import React, { useState } from 'react';
import { Share2, Calendar, Clock, CheckCircle2, AlertCircle, Copy, Download, Sparkles, X, Loader2 } from 'lucide-react';
import { PlatformPost, EventData, ConnectedAccount } from '../../types';
import { useToast } from '../ui/Toast';

interface PublishModalProps {
  post: PlatformPost;
  event: EventData;
  connectedAccounts: ConnectedAccount[];
  isOpen: boolean;
  onClose: () => void;
  onPublishedSuccess: (publishedPost: PlatformPost) => void;
  isDemoMode: boolean;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  post,
  event,
  connectedAccounts,
  isOpen,
  onClose,
  onPublishedSuccess,
  isDemoMode
}) => {
  const { showToast } = useToast();
  const [publishType, setPublishType] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-04-15T10:00');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    status: string;
    message: string;
    publishedUrl?: string;
  } | null>(null);

  if (!isOpen) return null;

  const targetAccount = connectedAccounts.find(a => a.platform === post.platform);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (publishType === 'now') {
        const response = await fetch('/api/social/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: post.id,
            platform: post.platform,
            isDemoMode
          })
        });
        const data = await response.json();
        setPublishResult(data);
        onPublishedSuccess({
          ...post,
          publishingStatus: 'published',
          publishedUrl: data.publishedUrl
        });
        showToast(data.message, 'success');
      } else {
        // Schedule in Calendar
        const response = await fetch('/api/calendar/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            platform: post.platform,
            scheduledTime: new Date(scheduledDateTime).toISOString(),
            preview: post.content.slice(0, 90) + '...',
            accountHandle: targetAccount?.handle || `@${post.platform}_account`,
            postId: post.id
          })
        });
        await response.json();
        setPublishResult({
          success: true,
          status: 'scheduled',
          message: `Post scheduled for ${new Date(scheduledDateTime).toLocaleString()} on ${targetAccount?.handle || post.platform}!`
        });
        onPublishedSuccess({
          ...post,
          publishingStatus: 'scheduled',
          scheduledDate: scheduledDateTime
        });
        showToast(`Post scheduled for ${new Date(scheduledDateTime).toLocaleDateString()}`, 'success');
      }
    } catch (err: any) {
      setPublishResult({
        success: false,
        status: 'failed',
        message: 'Your content was generated successfully, but publishing failed. You can copy or download the post.'
      });
      showToast('Publishing failed. You can copy or download the text.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(post.content);
    showToast('Post copied to clipboard!', 'success');
  };

  const handleDownloadText = () => {
    const blob = new Blob([post.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.name.replace(/\s+/g, '_')}_${post.platform}.txt`;
    a.click();
    showToast('Post downloaded as text file', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Ready to Publish? — {post.platform.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500">
                Publish immediately or schedule to your connected social channels.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Success state */}
          {publishResult && (
            <div className={`p-4 rounded-xl border text-sm ${
              publishResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-start gap-3">
                {publishResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {publishResult.success ? 'Publishing Status: Complete' : 'Publishing Notice'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed">{publishResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Connected Account Display */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={targetAccount?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                alt="Account"
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {targetAccount?.accountName || `${post.platform} Account`}
                </p>
                <p className="text-[11px] text-slate-500">
                  {targetAccount?.handle || `@${post.platform}_official`}
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Connected
            </span>
          </div>

          {/* Demo disclaimer banner */}
          {isDemoMode && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> Clicking publish will simulate a verified publishing workflow. No live public post is published externally.
              </span>
            </div>
          )}

          {/* Scheduling controls */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Publishing Options
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                publishType === 'now'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="publishType"
                  value="now"
                  checked={publishType === 'now'}
                  onChange={() => setPublishType('now')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs">Publish Now</span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                publishType === 'schedule'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="publishType"
                  value="schedule"
                  checked={publishType === 'schedule'}
                  onChange={() => setPublishType('schedule')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs">Schedule for Later</span>
              </label>
            </div>

            {publishType === 'schedule' && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Choose Date and Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Quick Fallback Action Buttons */}
          <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Caption</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            {publishResult?.success ? 'Done' : 'Cancel'}
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-50 transition"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : publishType === 'now' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Publish Now</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Confirm & Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
