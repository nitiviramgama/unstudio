import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveView } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { CreateEventWizard } from './components/events/CreateEventWizard';
import { ContentStudioView } from './components/studio/ContentStudioView';
import { CarouselGeneratorView } from './components/carousel/CarouselGeneratorView';
import { ReelGeneratorView } from './components/reel/ReelGeneratorView';
import { MediaLibraryView } from './components/media/MediaLibraryView';
import { CalendarView } from './components/calendar/CalendarView';
import { SavedEventsView } from './components/events/SavedEventsView';
import { BrandProfileView } from './components/brand/BrandProfileView';
import { ConnectedAccountsView } from './components/social/ConnectedAccountsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';

import { 
  EventData, 
  PlatformPost, 
  BrandProfile, 
  ConnectedAccount, 
  ScheduledPostItem, 
  MediaItem,
  ContentPreferences 
} from './types';

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

function MainApp() {
  const { showToast } = useToast();

  // Navigation & UI state
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // User Profile
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@giti.edu',
    organization: 'Global Institute of Technology'
  });

  // State Collections
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventData | null>(null);
  const [posts, setPosts] = useState<PlatformPost[]>([]);
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    organizationName: 'Global Institute of Technology & Innovation',
    tagline: 'Empowering Next-Generation Creators and Leaders',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80',
    description: 'A premier educational and research institution fostering multidisciplinary innovation, technology leadership, and social impact.',
    website: 'https://www.giti-institute.edu',
    socialHandles: {
      instagram: '@giti_official',
      linkedin: 'company/giti-institute',
      facebook: 'giti.official.page',
      x: '@GITI_Campus',
      whatsapp: '+1-555-019-9000'
    },
    preferredTone: 'engaging',
    preferredHashtags: ['#GITICampus', '#InnovationInAction', '#StudentExcellence'],
    wordsToAvoid: ['synergy', 'cheap', 'unprecedented'],
    primaryColor: '#4f46e5',
    secondaryColor: '#3b82f6'
  });

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      platform: 'instagram',
      accountName: 'GITI Official Instagram',
      handle: '@giti_official',
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      lastSynced: new Date().toISOString()
    },
    {
      platform: 'linkedin',
      accountName: 'Global Institute of Technology',
      handle: 'company/giti-institute',
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
      lastSynced: new Date().toISOString()
    },
    {
      platform: 'facebook',
      accountName: 'GITI Official Community',
      handle: 'giti.official.page',
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      lastSynced: new Date().toISOString()
    },
    {
      platform: 'x',
      accountName: 'GITI Campus News',
      handle: '@GITI_Campus',
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      lastSynced: new Date().toISOString()
    },
    {
      platform: 'whatsapp',
      accountName: 'GITI Announcements Broadcast',
      handle: '+1-555-019-9000',
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
      lastSynced: new Date().toISOString()
    }
  ]);

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [evRes, postRes, brandRes, calRes, medRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/content'),
          fetch('/api/brand'),
          fetch('/api/calendar'),
          fetch('/api/media')
        ]);

        if (evRes.ok) {
          const evData: EventData[] = await evRes.json();
          setEvents(evData);
          if (evData.length > 0) {
            setActiveEvent(evData[0]); // default to Technofest 2026
          }
        }
        if (postRes.ok) {
          const postData: PlatformPost[] = await postRes.json();
          setPosts(postData);
        }
        if (brandRes.ok) {
          const brandData: BrandProfile = await brandRes.json();
          setBrandProfile(brandData);
        }
        if (calRes.ok) {
          const calData: ScheduledPostItem[] = await calRes.json();
          setScheduledPosts(calData);
        }
        if (medRes.ok) {
          const medData: MediaItem[] = await medRes.json();
          setMediaItems(medData);
        }
      } catch (err) {
        console.warn('Initial load using client state:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handlers
  const handleEventCreated = async (newEvent: EventData, preferences: ContentPreferences) => {
    try {
      // 1. Save event to backend
      const evResponse = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      const savedEv = await evResponse.json();
      
      setEvents(prev => [savedEv, ...prev]);
      setActiveEvent(savedEv);

      // 2. Generate platform-adapted content
      const genResponse = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: savedEv,
          preferences
        })
      });
      const genData = await genResponse.json();
      const generatedPosts: PlatformPost[] = genData.posts || [];

      setPosts(prev => {
        const otherPosts = prev.filter(p => p.eventId !== savedEv.id);
        return [...generatedPosts, ...otherPosts];
      });

      showToast('Event story created and optimized for social platforms!', 'success');
      setActiveView('content-studio');
    } catch (err) {
      console.error(err);
      showToast('Encountered an issue during generation. Please check inputs.', 'error');
    }
  };

  const handleLoadDemoTechnofest = () => {
    const technofest = events.find(e => e.id === 'evt-technofest-2026') || events[0];
    if (technofest) {
      setActiveEvent(technofest);
      setActiveView('content-studio');
      showToast('Loaded Technofest 2026 in Content Studio', 'success');
    }
  };

  const handleOpenEventStudio = (event: EventData) => {
    setActiveEvent(event);
    setActiveView('content-studio');
  };

  // If user is on login page, display full standalone login screen
  if (activeView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(u) => {
          setUser(u);
          setActiveView('dashboard');
        }}
        onGoToLanding={() => setActiveView('landing')}
      />
    );
  }

  // If user is on landing page, display full standalone landing
  if (activeView === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setActiveView('dashboard')}
          onExploreDemo={handleLoadDemoTechnofest}
          onOpenAuth={() => setActiveView('login')}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => {
            setUser(u);
            setActiveView('dashboard');
          }}
        />
      </>
    );
  }

  // Filter posts for active event
  const currentEventPosts = activeEvent
    ? posts.filter(p => p.eventId === activeEvent.id)
    : posts;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      
      {/* Persistent Left Sidebar (Section 27) */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        user={user}
        isDemoMode={isDemoMode}
      />

      {/* Main App Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        
        {/* Sticky Global Header */}
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          setMobileOpen={setMobileSidebarOpen}
          onOpenCreateModal={() => setActiveView('create-event')}
          isDemoMode={isDemoMode}
          onLoadDemoEvent={handleLoadDemoTechnofest}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              user={user}
              events={events}
              posts={posts}
              scheduledPosts={scheduledPosts}
              onOpenCreateEvent={() => setActiveView('create-event')}
              onOpenEventStudio={handleOpenEventStudio}
              onNavigateToView={setActiveView}
            />
          )}

          {activeView === 'create-event' && (
            <CreateEventWizard
              onEventCreated={handleEventCreated}
              onCancel={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'content-studio' && activeEvent && (
            <ContentStudioView
              event={activeEvent}
              posts={currentEventPosts.length > 0 ? currentEventPosts : posts}
              setPosts={setPosts}
              connectedAccounts={connectedAccounts}
              brandProfile={brandProfile}
              isDemoMode={isDemoMode}
              onNavigateToCarousel={() => setActiveView('carousel')}
              onNavigateToReel={() => setActiveView('reel')}
            />
          )}

          {activeView === 'carousel' && activeEvent && (
            <CarouselGeneratorView
              event={activeEvent}
              onBackToStudio={() => setActiveView('content-studio')}
            />
          )}

          {activeView === 'reel' && activeEvent && (
            <ReelGeneratorView
              event={activeEvent}
              onBackToStudio={() => setActiveView('content-studio')}
            />
          )}

          {activeView === 'media' && (
            <MediaLibraryView
              mediaItems={mediaItems}
              setMediaItems={setMediaItems}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              scheduledPosts={scheduledPosts}
              setScheduledPosts={setScheduledPosts}
              onOpenCreateEvent={() => setActiveView('create-event')}
            />
          )}

          {activeView === 'saved-events' && (
            <SavedEventsView
              events={events}
              setEvents={setEvents}
              onOpenEvent={handleOpenEventStudio}
              onOpenCreateEvent={() => setActiveView('create-event')}
            />
          )}

          {activeView === 'brand' && (
            <BrandProfileView
              brandProfile={brandProfile}
              setBrandProfile={setBrandProfile}
            />
          )}

          {activeView === 'connected-accounts' && (
            <ConnectedAccountsView
              accounts={connectedAccounts}
              setAccounts={setConnectedAccounts}
              isDemoMode={isDemoMode}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              user={user}
              setUser={setUser}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
              onResetToDemo={handleLoadDemoTechnofest}
            />
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setActiveView('dashboard');
        }}
      />

    </div>
  );
}
