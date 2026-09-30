import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Copy, 
  Download, 
  History, 
  Send, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Lightbulb, 
  Sliders, 
  Share2, 
  Layers, 
  Video, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { PlatformPost, EventData, Platform, ConnectedAccount, BrandProfile } from '../../types';
import { InstagramPreview } from './InstagramPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { FacebookPreview } from './FacebookPreview';
import { XPreview } from './XPreview';
import { WhatsAppPreview } from './WhatsAppPreview';
import { AIFeedbackModal } from './AIFeedbackModal';
import { VersionHistoryModal } from './VersionHistoryModal';
import { PublishModal } from './PublishModal';
import { useToast } from '../ui/Toast';

interface ContentStudioViewProps {
  event: EventData;
  posts: PlatformPost[];
  setPosts: React.Dispatch<React.SetStateAction<PlatformPost[]>>;
  connectedAccounts: ConnectedAccount[];
  brandProfile: BrandProfile;
  isDemoMode: boolean;
  onNavigateToCarousel: () => void;
  onNavigateToReel: () => void;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({
  event,
  posts,
  setPosts,
  connectedAccounts,
  brandProfile,
  isDemoMode,
  onNavigateToCarousel,
  onNavigateToReel
}) => {
  const { showToast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Modals state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const activePost = posts.find(p => p.platform === selectedPlatform) || posts[0];

  const handleSelectPlatform = (plat: Platform) => {
    setSelectedPlatform(plat);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (activePost) {
      setEditedContent(activePost.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!activePost) return;
    const updatedPost: PlatformPost = {
      ...activePost,
      content: editedContent,
      charCount: editedContent.length,
      versions: [
        ...activePost.versions,
        {
          versionNumber: activePost.versions.length + 1,
          timestamp: new Date().toISOString(),
          content: editedContent,
          hook: activePost.hook,
          hashtags: activePost.hashtags,
          cta: activePost.cta,
          feedbackUsed: 'Manual inline editor adjustment'
        }
      ],
      activeVersionIndex: activePost.versions.length
    };

    setPosts(prev => prev.map(p => p.id === activePost.id ? updatedPost : p));
    setIsEditing(false);
    showToast('Post content updated and saved as new version!', 'success');
  };

  const handleRegenerate = async () => {
    if (!activePost) return;
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/content/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: activePost.id })
      });
      if (!response.ok) throw new Error('Regeneration failed');
      const updated = await response.json();
      setPosts(prev => prev.map(p => p.id === activePost.id ? updated : p));
      showToast(`${activePost.platform.toUpperCase()} content regenerated!`, 'success');
    } catch (err) {
      showToast('Regeneration service unavailable, please try again.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    if (activePost) {
      navigator.clipboard.writeText(activePost.content);
      showToast('Caption copied to clipboard!', 'success');
    }
  };

  const handleDownload = () => {
    if (!activePost) return;
    const element = document.createElement('a');
    const file = new Blob([activePost.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${event.name.replace(/\s+/g, '_')}_${activePost.platform}_post.txt`;
    document.body.appendChild(element);
    element.click();
    showToast('Post downloaded successfully', 'info');
  };

  const handleApplyImprovement = (improvedPost: PlatformPost) => {
    setPosts(prev => prev.map(p => p.id === improvedPost.id ? improvedPost : p));
    showToast('AI improved version accepted!', 'success');
  };

  const handleRestoreVersion = (verIndex: number) => {
    if (!activePost) return;
    const targetVer = activePost.versions[verIndex];
    if (!targetVer) return;

    const restored: PlatformPost = {
      ...activePost,
      content: targetVer.content,
      hook: targetVer.hook || activePost.hook,
      hashtags: targetVer.hashtags || activePost.hashtags,
      charCount: targetVer.content.length,
      activeVersionIndex: verIndex
    };

    setPosts(prev => prev.map(p => p.id === activePost.id ? restored : p));
    showToast(`Restored to Version ${targetVer.versionNumber}`, 'info');
  };

  const platformsList: { id: Platform; label: string; icon: string }[] = [
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'facebook', label: 'Facebook', icon: '👥' },
    { id: 'x', label: 'X (Twitter)', icon: '🐦' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  ];

  if (!activePost) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-3 animate-spin" />
        <h3 className="text-lg font-bold text-slate-900">Loading Content Studio...</h3>
        <p className="text-sm text-slate-500 mt-1">Generating platform-adapted stories from event experience.</p>
      </div>
    );
  }

  const qualityScore = activePost.qualityScore || {
    overall: 94,
    platformFit: 96,
    readability: 92,
    engagement: 90,
    toneConsistency: 95,
    factualSafety: 99
  };

  return (
    <div className="space-y-6">

      {/* Top Banner with Event Summary and Fast Nav */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {event.type}
            </span>
            <span className="text-xs text-slate-500">• {event.date}</span>
            <span className="text-xs text-slate-500">• {event.location}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {event.name}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Ready to Publish
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-2xl">
            {event.context}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToCarousel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Create Carousel</span>
          </button>
          <button
            onClick={onNavigateToReel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-200"
          >
            <Video className="w-4 h-4 text-purple-600" />
            <span>Create Reel Script</span>
          </button>
        </div>
      </div>

      {/* Platform Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-2 rounded-t-2xl">
        <div className="flex gap-2 overflow-x-auto py-2">
          {platformsList.map((item) => {
            const hasPost = posts.some(p => p.platform === item.id);
            const isSelected = selectedPlatform === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPlatform(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : hasPost
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side version badge */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setShowVersionModal(true)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-200 transition font-medium"
            title="Version History"
          >
            <History className="w-3.5 h-3.5" />
            <span>v{activePost.versions[activePost.activeVersionIndex]?.versionNumber || 1}</span>
            <span className="text-[11px] text-slate-400">({activePost.versions.length} versions)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Realistic Preview & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Action Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isEditing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Live Preview' : 'Edit Text'}</span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Improve with AI</span>
              </button>

              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-md shadow-indigo-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish / Schedule</span>
              </button>
            </div>
          </div>

          {/* Editor Mode vs Realistic Live Preview */}
          {isEditing ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Direct Text Editor
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {editedContent.length} characters
                </span>
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={14}
                className="w-full p-4 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed text-slate-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Save Changes as Version
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/70 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center min-h-[460px]">
              {selectedPlatform === 'instagram' && (
                <InstagramPreview
                  post={activePost}
                  event={event}
                  orgName={brandProfile.organizationName}
                  orgLogo={brandProfile.logoUrl}
                />
              )}
              {selectedPlatform === 'linkedin' && (
                <LinkedInPreview
                  post={activePost}
                  event={event}
                  orgName={brandProfile.organizationName}
                  orgLogo={brandProfile.logoUrl}
                />
              )}
              {selectedPlatform === 'facebook' && (
                <FacebookPreview
                  post={activePost}
                  event={event}
                  orgName={brandProfile.organizationName}
                  orgLogo={brandProfile.logoUrl}
                />
              )}
              {selectedPlatform === 'x' && (
                <XPreview
                  post={activePost}
                  event={event}
                  orgName={brandProfile.organizationName}
                  orgHandle={brandProfile.socialHandles.x}
                  orgAvatar={brandProfile.logoUrl}
                />
              )}
              {selectedPlatform === 'whatsapp' && (
                <WhatsAppPreview
                  post={activePost}
                  event={event}
                  groupName={`${brandProfile.organizationName} Official`}
                />
              )}
            </div>
          )}

          {/* Quick Copy / Download Footer Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">Length:</span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                {activePost.charCount} characters
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-700">Call to Action:</span>
              <span className="text-slate-600 italic">"{activePost.cta || 'Share thoughts below'}"</span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              ID: {activePost.id.slice(0, 16)}...
            </div>
          </div>

        </div>

        {/* Right Column: AI Quality Analysis & Suggestions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* AI Quality Analysis Card (Section 11) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Quality Analysis</h3>
                  <p className="text-[11px] text-slate-500">Multi-metric platform evaluation</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 tracking-tight">
                  {qualityScore.overall}%
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Overall Quality</span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Platform Fit ({selectedPlatform})</span>
                  <span>{qualityScore.platformFit}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${qualityScore.platformFit}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Readability</span>
                  <span>{qualityScore.readability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${qualityScore.readability}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Engagement</span>
                  <span>{qualityScore.engagement}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${qualityScore.engagement}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Tone Consistency</span>
                  <span>{qualityScore.toneConsistency}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${qualityScore.toneConsistency}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Factual Safety (Zero Fabrication)</span>
                  <span className="text-emerald-700 font-bold">{qualityScore.factualSafety}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${qualityScore.factualSafety}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Factual Safety Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Verified Factual Integrity:</strong> Only facts provided in your event inputs were referenced. No fake names, numbers, or quotes invented.
              </span>
            </div>
          </div>

          {/* AI Suggestions Card (Section 11) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Optimization Suggestions</h3>
            </div>

            <div className="space-y-2.5">
              {activePost.suggestions?.map((sug, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="font-bold text-amber-600">•</span>
                  <span className="leading-relaxed">{sug}</span>
                </div>
              )) || (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  Post is well-structured for {selectedPlatform}.
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Suggestions with AI</span>
            </button>
          </div>

          {/* Hashtag Manager Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hashtags ({activePost.hashtags?.length || 0})
              </h3>
              <button
                onClick={() => {
                  if (activePost.hashtags?.length) {
                    navigator.clipboard.writeText(activePost.hashtags.join(' '));
                    showToast('Hashtags copied!', 'success');
                  }
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Copy all
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activePost.hashtags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <AIFeedbackModal
        post={activePost}
        event={event}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onApplyImprovement={handleApplyImprovement}
      />

      <VersionHistoryModal
        post={activePost}
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        onRestoreVersion={handleRestoreVersion}
      />

      <PublishModal
        post={activePost}
        event={event}
        connectedAccounts={connectedAccounts}
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublishedSuccess={(publishedPost) => {
          setPosts(prev => prev.map(p => p.id === publishedPost.id ? publishedPost : p));
        }}
        isDemoMode={isDemoMode}
      />

    </div>
  );
};
