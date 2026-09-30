export type Platform = 'instagram' | 'linkedin' | 'facebook' | 'x' | 'whatsapp';

export type ContentType = 
  | 'post' 
  | 'caption' 
  | 'carousel' 
  | 'story' 
  | 'reel_script' 
  | 'summary' 
  | 'announcement';

export type Tone = 
  | 'engaging' 
  | 'professional' 
  | 'energetic' 
  | 'inspirational' 
  | 'celebratory' 
  | 'formal' 
  | 'emotional' 
  | 'friendly';

export type Language = 'English' | 'Hindi' | 'Gujarati';

export interface EventData {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  organizer: string;
  context: string;
  participants: string[];
  highlights: string[];
  experiences: {
    student?: string;
    faculty?: string;
    guest?: string;
    organizer?: string;
  };
  feedback?: string;
  achievements?: string;
  importantMoments?: string;
  mediaUrls: string[];
  coverImage?: string;
  status: 'draft' | 'generated' | 'published';
  createdAt: string;
}

export interface ContentPreferences {
  platforms: Platform[];
  contentType: ContentType;
  tone: Tone;
  language: Language;
  applyBrandProfile: boolean;
}

export interface ContentVersion {
  versionNumber: number;
  timestamp: string;
  content: string;
  hook?: string;
  hashtags: string[];
  cta?: string;
  feedbackUsed?: string;
  changesMade?: string[];
}

export interface QualityScore {
  overall: number;
  platformFit: number;
  readability: number;
  engagement: number;
  toneConsistency: number;
  factualSafety: number;
}

export interface PlatformPost {
  id: string;
  eventId: string;
  platform: Platform;
  hook: string;
  content: string;
  hashtags: string[];
  cta: string;
  charCount: number;
  qualityScore: QualityScore;
  suggestions: string[];
  versions: ContentVersion[];
  activeVersionIndex: number;
  publishingStatus: 'draft' | 'ready' | 'scheduled' | 'published' | 'failed';
  scheduledDate?: string;
  publishedUrl?: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  body: string;
  visualSuggestion: string;
  accent?: string;
}

export interface CarouselData {
  id: string;
  eventId: string;
  title: string;
  description: string;
  slides: CarouselSlide[];
  coverStyle: string;
}

export interface ReelSection {
  timeRange: string; // e.g. "0-3s"
  phase: string;     // e.g. "HOOK", "EVENT INTRODUCTION", "HIGHLIGHTS", etc.
  scene: string;
  voiceover: string;
  onScreenText: string;
  visualSuggestion: string;
}

export interface ReelScriptData {
  id: string;
  eventId: string;
  title: string;
  targetDuration: string;
  soundtrackSuggestion: string;
  sections: ReelSection[];
}

export interface BrandProfile {
  organizationName: string;
  tagline: string;
  logoUrl: string;
  description: string;
  website: string;
  socialHandles: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    x?: string;
    whatsapp?: string;
  };
  preferredTone: Tone;
  preferredHashtags: string[];
  wordsToAvoid: string[];
  primaryColor: string;
  secondaryColor: string;
}

export interface ConnectedAccount {
  platform: Platform;
  accountName: string;
  handle: string;
  connected: boolean;
  avatar: string;
  lastSynced?: string;
}

export interface ScheduledPostItem {
  id: string;
  eventId: string;
  eventName: string;
  platform: Platform;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
  preview: string;
  accountHandle: string;
  postId?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  caption: string;
  altText: string;
  eventId?: string;
  uploadedAt: string;
}
