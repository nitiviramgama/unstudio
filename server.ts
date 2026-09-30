import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { AIService } from './src/server/aiService';
import { 
  EventData, 
  ContentPreferences, 
  PlatformPost, 
  BrandProfile, 
  ConnectedAccount, 
  ScheduledPostItem,
  MediaItem 
} from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// ==========================================
// In-Memory Database (Seeded with real demo data)
// ==========================================

let eventsDB: EventData[] = [
  {
    id: 'evt-technofest-2026',
    name: 'Technofest 2026',
    type: 'Technical Event',
    date: '2026-04-12 to 2026-04-13',
    location: 'Main Auditorium & Innovation Labs',
    organizer: 'Computer Science & Engineering Department',
    context: 'A two-day college technical festival. Students participated in coding competitions, AI workshops, project exhibitions, and guest lectures from industry pioneers.',
    participants: ['Students', 'Faculty', 'Guests', 'Industry Experts', 'Speakers'],
    highlights: [
      '24-Hour Hackathon Championship',
      'AI & Machine Learning Hands-on Workshop',
      'Student Project Exhibition with 85+ Projects',
      'Keynote Address on Future of Intelligent Agents'
    ],
    experiences: {
      student: 'Students enjoyed learning, collaborating in intense teams, and competing against top peer innovators.',
      faculty: 'Faculty guided students throughout the event, evaluated project booths, and supported student mentorship.',
      guest: 'Industry judges were deeply impressed by the technical depth and problem-solving grit shown by the teams.',
      organizer: 'Seamless execution across 4 halls with electric enthusiasm from start to finish.'
    },
    feedback: 'The event gave us an opportunity to showcase our skills, collaborate with peers, and learn practical industry-grade tools.',
    achievements: 'Over 650 active participants, 85 demonstrated projects, and 6 corporate sponsored awards presented.',
    importantMoments: 'Inauguration lamp lighting, surprise prompt reveal at midnight hackathon, and trophy distribution ceremony.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
    status: 'generated',
    createdAt: '2026-04-13T10:00:00Z'
  },
  {
    id: 'evt-ai-workshop',
    name: 'AI Workshop & GenAI Masterclass',
    type: 'Workshop',
    date: '2026-03-22',
    location: 'Seminar Hall 3',
    organizer: 'Tech Club & Developer Student Circle',
    context: 'Interactive full-day masterclass on modern generative AI tooling, prompt engineering patterns, and autonomous agent architecture.',
    participants: ['Students', 'Faculty', 'Industry Experts'],
    highlights: [
      'Hands-on Multi-modal Agent Lab',
      'Architecture Patterns for Enterprise AI',
      'Live Deployment Challenge'
    ],
    experiences: {
      student: 'Gained hands-on confidence building end-to-end fullstack AI prototypes.',
      faculty: 'A great bridge between textbook theory and practical industry applications.'
    },
    feedback: 'Clear, concise, and incredibly practical. We built working apps within 3 hours!',
    achievements: '120 students certified with live working project portfolios.',
    importantMoments: 'Live code demonstration and real-time app deployment.',
    mediaUrls: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80',
    status: 'draft',
    createdAt: '2026-03-22T14:30:00Z'
  },
  {
    id: 'evt-annual-sports',
    name: 'Annual Sports Meet 2026',
    type: 'Sports Event',
    date: '2026-02-18',
    location: 'University Stadium Ground',
    organizer: 'Sports Committee & Physical Education Department',
    context: 'Intra-college athletic competitions, track events, football finals, and championship prize distribution celebrating sportsmanship.',
    participants: ['Students', 'Faculty', 'Alumni', 'Parents'],
    highlights: [
      '100m & 400m Track Finals',
      'Inter-Department Football Championship',
      'Faculty vs Alumni Friendly Cricket Match'
    ],
    experiences: {
      student: 'Unmatched team spirit and adrenaline cheering for our departments!',
      faculty: 'Great camaraderie playing alongside students and returning alumni.'
    },
    feedback: 'High energy, disciplined sportsmanship, and incredible crowd enthusiasm throughout the day.',
    achievements: '3 new university track records set and trophy lifted by Mechanical Department.',
    importantMoments: 'Torch relay at opening ceremony and medal presentation.',
    mediaUrls: ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&q=80',
    status: 'published',
    createdAt: '2026-02-18T18:00:00Z'
  }
];

let postsDB: PlatformPost[] = [];

// Seed default posts for Technofest 2026
const technofestEvent = eventsDB[0];
postsDB.push(
  {
    id: 'post-tf-ig',
    eventId: technofestEvent.id,
    platform: 'instagram',
    hook: 'What an electrifying two days at Technofest 2026! 🚀✨',
    content: `What an electrifying two days at Technofest 2026! 🚀✨

Organized by the Computer Science & Engineering Department, the campus was buzzing with intense coding competitions, cutting-edge AI workshops, and over 85 student project demonstrations.

🎯 Key Highlights:
• 24-Hour Hackathon Championship
• AI & Machine Learning Hands-on Workshop
• Student Project Exhibition with 85+ Projects
• Keynote Address on Future of Intelligent Agents

💬 Student Experience:
"Students enjoyed learning, collaborating in intense teams, and competing against top peer innovators."

🤝 Faculty Mentorship:
Special thanks to our faculty mentors who guided students throughout the event, evaluated project booths, and supported student mentorship every step of the way!

🏆 Milestones:
Over 650 active participants, 85 demonstrated projects, and 6 corporate sponsored awards presented.

What was your favorite moment of Technofest? Drop it in the comments below! 👇`,
    hashtags: ['#Technofest2026', '#CollegeTechFest', '#InnovationInAction', '#Hackathon', '#StudentInnovators', '#CampusLife'],
    cta: 'Drop your favorite moment of Technofest in the comments below! 👇',
    charCount: 915,
    qualityScore: {
      overall: 94,
      platformFit: 96,
      readability: 92,
      engagement: 91,
      toneConsistency: 95,
      factualSafety: 99
    },
    suggestions: [
      'Hook grabs attention immediately with strong emoji placement',
      'Faculty mentorship is clearly spotlighted as requested',
      'Tag winning hackathon teams to maximize engagement'
    ],
    versions: [
      {
        versionNumber: 1,
        timestamp: '2026-04-13T10:15:00Z',
        content: `Technofest 2026 was a great success with coding competitions and workshops. Students showed lots of talent.`,
        hook: 'Technofest 2026 Recap',
        hashtags: ['#Technofest', '#Coding'],
        feedbackUsed: 'Initial generation'
      },
      {
        versionNumber: 2,
        timestamp: '2026-04-13T10:25:00Z',
        content: `What an electrifying two days at Technofest 2026! 🚀✨\n\nOrganized by the Computer Science & Engineering Department, the campus was buzzing with intense coding competitions, cutting-edge AI workshops, and over 85 student project demonstrations.\n\n🎯 Key Highlights:\n• 24-Hour Hackathon Championship\n• AI & Machine Learning Hands-on Workshop\n• Student Project Exhibition with 85+ Projects\n\n🤝 Faculty Mentorship:\nSpecial thanks to our faculty mentors who guided students throughout the event, evaluated project booths, and supported student mentorship every step of the way!\n\nWhat was your favorite moment of Technofest? Drop it in the comments below! 👇`,
        hook: 'What an electrifying two days at Technofest 2026! 🚀✨',
        hashtags: ['#Technofest2026', '#CollegeTechFest', '#InnovationInAction', '#Hackathon', '#StudentInnovators'],
        feedbackUsed: 'Make it more energetic and mention how faculty guided the students.',
        changesMade: [
          'Improved opening hook with higher energy',
          'Integrated faculty mentorship contribution prominently',
          'Structured bullet points for visual scanability'
        ]
      }
    ],
    activeVersionIndex: 1,
    publishingStatus: 'ready'
  },
  {
    id: 'post-tf-li',
    eventId: technofestEvent.id,
    platform: 'linkedin',
    hook: 'Empowering future engineers: Highlights and takeaways from Technofest 2026.',
    content: `Empowering future engineers: Highlights and takeaways from Technofest 2026.

Organized by the Department of Computer Science & Engineering, Technofest 2026 served as a high-impact platform connecting academic inquiry with hands-on technical problem solving.

Key Initiatives & Focus Areas:
• 24-Hour Hackathon Championship challenging teams on real-world constraints
• Hands-on AI & Machine Learning Workshop focusing on production deployment
• Project Exhibition featuring 85+ student-led research and software prototypes
• Keynote on the future of autonomous systems and engineering leadership

Mentorship & Collaborative Culture:
A central pillar of the event's success was the continuous mentorship provided by our faculty members, who evaluated project booths, provided technical critique, and guided student innovators across both days.

As participant feedback reflected: "The event gave us an opportunity to showcase our skills, collaborate with peers, and learn practical industry-grade tools."

With over 650 active participants and 6 corporate partner awards presented, we commend the organizing committee, faculty advisors, and student teams for their relentless dedication.

#HigherEducation #EngineeringExcellence #Technofest2026 #STEM #StudentInnovation #Mentorship`,
    hashtags: ['#HigherEducation', '#EngineeringExcellence', '#Technofest2026', '#STEM', '#StudentInnovation', '#Mentorship'],
    cta: 'Connect with our department to learn more about student innovation projects.',
    charCount: 1140,
    qualityScore: {
      overall: 96,
      platformFit: 98,
      readability: 94,
      engagement: 90,
      toneConsistency: 97,
      factualSafety: 100
    },
    suggestions: [
      'Executive tone is consistent and well-calibrated for academic/corporate viewers',
      'Strong connection between student execution and faculty mentorship'
    ],
    versions: [
      {
        versionNumber: 1,
        timestamp: '2026-04-13T10:15:00Z',
        content: `Empowering future engineers: Highlights and takeaways from Technofest 2026.\n\nOrganized by the Department of Computer Science & Engineering, Technofest 2026 served as a high-impact platform connecting academic inquiry with hands-on technical problem solving...`,
        hook: 'Empowering future engineers: Highlights and takeaways from Technofest 2026.',
        hashtags: ['#HigherEducation', '#EngineeringExcellence', '#Technofest2026'],
        feedbackUsed: 'Initial generation'
      }
    ],
    activeVersionIndex: 0,
    publishingStatus: 'ready'
  },
  {
    id: 'post-tf-x',
    eventId: technofestEvent.id,
    platform: 'x',
    hook: 'That\'s a wrap on Technofest 2026! 🚀',
    content: `That's a wrap on Technofest 2026! 🚀 650+ participants, 85 student projects & a 24-hr Hackathon led by Computer Science Dept. Proud of our students & faculty mentors who guided every step! 👏 #Technofest2026 #Hackathon #Innovation`,
    hashtags: ['#Technofest2026', '#Hackathon', '#Innovation'],
    cta: 'Retweet to celebrate our student innovators!',
    charCount: 236,
    qualityScore: {
      overall: 95,
      platformFit: 98,
      readability: 96,
      engagement: 92,
      toneConsistency: 95,
      factualSafety: 100
    },
    suggestions: [
      'Character count safely under the 280-character limit (236 chars)',
      'Sharp punchy hook with verified numbers only'
    ],
    versions: [
      {
        versionNumber: 1,
        timestamp: '2026-04-13T10:15:00Z',
        content: `That's a wrap on Technofest 2026! 🚀 650+ participants, 85 student projects & a 24-hr Hackathon led by Computer Science Dept. Proud of our students & faculty mentors who guided every step! 👏 #Technofest2026 #Hackathon #Innovation`,
        hook: 'That\'s a wrap on Technofest 2026! 🚀',
        hashtags: ['#Technofest2026', '#Hackathon', '#Innovation'],
        feedbackUsed: 'Initial generation'
      }
    ],
    activeVersionIndex: 0,
    publishingStatus: 'ready'
  },
  {
    id: 'post-tf-fb',
    eventId: technofestEvent.id,
    platform: 'facebook',
    hook: 'Two unforgettable days of talent, creativity, and teamwork at Technofest 2026! 🌟',
    content: `Two unforgettable days of talent, creativity, and teamwork at Technofest 2026! 🌟

Huge congratulations to the Computer Science & Engineering Department for hosting an incredible edition of Technofest! Over two days, our campus welcomed 650+ participants for hackathons, workshops, and exhibitions.

Highlights we loved:
👉 24-Hour Hackathon with round-the-clock coding
👉 Inspiring student projects addressing real challenges
👉 Faculty mentors actively advising and encouraging teams
👉 Electric enthusiasm during the closing award ceremony

"The event gave us an opportunity to showcase our skills, collaborate with peers, and learn practical industry-grade tools."

Were you at Technofest 2026? Tag your teammates and share your favorite photo in the comments below! 📸✨`,
    hashtags: ['#Technofest2026', '#CampusPride', '#TechCommunity', '#StudentSuccess'],
    cta: 'Tag your teammates and share your favorite photo in the comments below! 📸✨',
    charCount: 780,
    qualityScore: {
      overall: 93,
      platformFit: 95,
      readability: 93,
      engagement: 92,
      toneConsistency: 94,
      factualSafety: 100
    },
    suggestions: [
      'Encourages community photo sharing',
      'Warm conversational tone suitable for parents, alumni, and campus community'
    ],
    versions: [
      {
        versionNumber: 1,
        timestamp: '2026-04-13T10:15:00Z',
        content: `Two unforgettable days of talent, creativity, and teamwork at Technofest 2026! 🌟...`,
        hook: 'Two unforgettable days of talent, creativity, and teamwork at Technofest 2026! 🌟',
        hashtags: ['#Technofest2026', '#CampusPride'],
        feedbackUsed: 'Initial generation'
      }
    ],
    activeVersionIndex: 0,
    publishingStatus: 'ready'
  },
  {
    id: 'post-tf-wa',
    eventId: technofestEvent.id,
    platform: 'whatsapp',
    hook: '📢 *Technofest 2026 — Official Event Highlights & Thank You*',
    content: `📢 *Technofest 2026 — Official Event Highlights & Thank You*

Organized by: *Department of Computer Science & Engineering*
Dates: *April 12 - 13, 2026*
Venue: *Main Auditorium & Innovation Labs*

*Event Summary:*
Technofest 2026 concluded with tremendous success, featuring 650+ participants across 2 days of rigorous technical events.

*Key Highlights:*
✅ 24-Hour Hackathon Championship
✅ AI & Machine Learning Hands-on Workshop
✅ 85+ Student Projects Exhibited
✅ 6 Corporate Sponsored Awards Presented

*Faculty & Mentorship Acknowledgement:*
Special thanks to our faculty coordinators and judges whose continuous guidance ensured smooth execution.

_Please share this update with your department groups and student batches!_ 🌟`,
    hashtags: [],
    cta: 'Forward to department groups and student batches!',
    charCount: 710,
    qualityScore: {
      overall: 95,
      platformFit: 99,
      readability: 98,
      engagement: 88,
      toneConsistency: 96,
      factualSafety: 100
    },
    suggestions: [
      'Bold formatting markers designed for WhatsApp typography',
      'Direct broadcast message ready to forward to groups'
    ],
    versions: [
      {
        versionNumber: 1,
        timestamp: '2026-04-13T10:15:00Z',
        content: `📢 *Technofest 2026 — Official Event Highlights & Thank You*...`,
        hook: '📢 *Technofest 2026 — Official Event Highlights & Thank You*',
        hashtags: [],
        feedbackUsed: 'Initial generation'
      }
    ],
    activeVersionIndex: 0,
    publishingStatus: 'ready'
  }
);

let brandProfileDB: BrandProfile = {
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
};

let connectedAccountsDB: ConnectedAccount[] = [
  {
    platform: 'instagram',
    accountName: 'GITI Official Instagram',
    handle: '@giti_official',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    lastSynced: '2026-04-13T09:00:00Z'
  },
  {
    platform: 'linkedin',
    accountName: 'Global Institute of Technology',
    handle: 'company/giti-institute',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    lastSynced: '2026-04-13T09:00:00Z'
  },
  {
    platform: 'facebook',
    accountName: 'GITI Official Community',
    handle: 'giti.official.page',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    lastSynced: '2026-04-12T16:00:00Z'
  },
  {
    platform: 'x',
    accountName: 'GITI Campus News',
    handle: '@GITI_Campus',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    lastSynced: '2026-04-13T08:30:00Z'
  },
  {
    platform: 'whatsapp',
    accountName: 'GITI Announcements Broadcast',
    handle: '+1-555-019-9000',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    lastSynced: '2026-04-13T07:15:00Z'
  }
];

let calendarDB: ScheduledPostItem[] = [
  {
    id: 'cal-1',
    eventId: technofestEvent.id,
    eventName: 'Technofest 2026',
    platform: 'instagram',
    scheduledTime: '2026-04-14T17:00:00Z',
    status: 'scheduled',
    preview: 'What an electrifying two days at Technofest 2026! 🚀✨ Organized by the Computer Science...',
    accountHandle: '@giti_official',
    postId: 'post-tf-ig'
  },
  {
    id: 'cal-2',
    eventId: technofestEvent.id,
    eventName: 'Technofest 2026',
    platform: 'linkedin',
    scheduledTime: '2026-04-15T09:30:00Z',
    status: 'scheduled',
    preview: 'Empowering future engineers: Highlights and takeaways from Technofest 2026...',
    accountHandle: 'company/giti-institute',
    postId: 'post-tf-li'
  },
  {
    id: 'cal-3',
    eventId: 'evt-annual-sports',
    eventName: 'Annual Sports Meet 2026',
    platform: 'instagram',
    scheduledTime: '2026-02-18T19:00:00Z',
    status: 'published',
    preview: 'Unmatched team spirit and athleticism at our Annual Sports Meet 2026! 🏃‍♂️🏆',
    accountHandle: '@giti_official'
  }
];

let mediaLibraryDB: MediaItem[] = [
  {
    id: 'med-1',
    name: 'Technofest Hackathon Stage.jpg',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
    type: 'image',
    size: '2.4 MB',
    caption: 'Student teams collaborating during the 24-hour coding challenge at Technofest 2026.',
    altText: 'Wide-angle view of university tech festival auditorium packed with students and laptops.',
    eventId: technofestEvent.id,
    uploadedAt: '2026-04-12T11:00:00Z'
  },
  {
    id: 'med-2',
    name: 'AI Workshop Presentation.jpg',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80',
    type: 'image',
    size: '1.8 MB',
    caption: 'Faculty mentor walking students through generative AI architecture models.',
    altText: 'Speaker addressing students in seminar room with code diagrams projected on screen.',
    eventId: 'evt-ai-workshop',
    uploadedAt: '2026-03-22T10:30:00Z'
  },
  {
    id: 'med-3',
    name: 'Closing Trophy Handover.jpg',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&q=80',
    type: 'image',
    size: '3.1 MB',
    caption: 'Winning team holding their hackathon championship trophy on stage with faculty advisors.',
    altText: 'Smiling student team celebrating on stage holding a trophy with faculty members.',
    eventId: technofestEvent.id,
    uploadedAt: '2026-04-13T17:30:00Z'
  }
];

// ==========================================
// REST API Endpoints (Section 42)
// ==========================================

// Events Endpoints
app.get('/api/events', (_req: Request, res: Response) => {
  res.json(eventsDB);
});

app.post('/api/events', (req: Request, res: Response) => {
  const data = req.body;
  const newEvent: EventData = {
    id: `evt-${Date.now()}`,
    name: data.name || 'Untitled Event',
    type: data.type || 'General Event',
    date: data.date || new Date().toISOString().split('T')[0],
    location: data.location || '',
    organizer: data.organizer || '',
    context: data.context || '',
    participants: data.participants || [],
    highlights: data.highlights || [],
    experiences: data.experiences || {},
    feedback: data.feedback || '',
    achievements: data.achievements || '',
    importantMoments: data.importantMoments || '',
    mediaUrls: data.mediaUrls || [],
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
    status: 'draft',
    createdAt: new Date().toISOString()
  };
  eventsDB.unshift(newEvent);
  res.status(201).json(newEvent);
});

app.get('/api/events/:id', (req: Request, res: Response) => {
  const event = eventsDB.find(e => e.id === req.params.id);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json(event);
});

app.put('/api/events/:id', (req: Request, res: Response) => {
  const index = eventsDB.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  eventsDB[index] = { ...eventsDB[index], ...req.body };
  res.json(eventsDB[index]);
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  const index = eventsDB.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  eventsDB.splice(index, 1);
  postsDB = postsDB.filter(p => p.eventId !== req.params.id);
  res.json({ success: true });
});

// Content Endpoints
app.get('/api/content', (req: Request, res: Response) => {
  const eventId = req.query.eventId as string;
  if (eventId) {
    res.json(postsDB.filter(p => p.eventId === eventId));
  } else {
    res.json(postsDB);
  }
});

app.post('/api/content/generate', async (req: Request, res: Response) => {
  try {
    const { event, preferences } = req.body;
    if (!event || !event.name) {
      res.status(400).json({ error: 'Missing required event information' });
      return;
    }

    const defaultPrefs: ContentPreferences = preferences || {
      platforms: ['instagram', 'linkedin'],
      contentType: 'post',
      tone: 'engaging',
      language: 'English',
      applyBrandProfile: true
    };

    const newPosts = await AIService.generate_content(
      event, 
      defaultPrefs, 
      defaultPrefs.applyBrandProfile ? brandProfileDB : undefined
    );

    // Replace or add posts for this event
    postsDB = postsDB.filter(p => p.eventId !== event.id).concat(newPosts);

    // Update event status
    const evIndex = eventsDB.findIndex(e => e.id === event.id);
    if (evIndex !== -1) {
      eventsDB[evIndex].status = 'generated';
    }

    res.json({
      posts: newPosts,
      eventAnalysis: await AIService.analyze_event(event)
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message || 'AI generation is temporarily unavailable. Please try again.' });
  }
});

app.post('/api/content/improve', async (req: Request, res: Response) => {
  try {
    const { postId, feedback } = req.body;
    const post = postsDB.find(p => p.id === postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const event = eventsDB.find(e => e.id === post.eventId) || {
      id: post.eventId,
      name: 'Event',
      type: 'General',
      date: '',
      location: '',
      organizer: '',
      context: '',
      participants: [],
      highlights: [],
      experiences: {},
      mediaUrls: [],
      status: 'generated',
      createdAt: ''
    };

    const result = await AIService.improve_content(post, event, feedback || 'Make it more engaging');
    
    // Update in postsDB
    const index = postsDB.findIndex(p => p.id === postId);
    if (index !== -1) {
      postsDB[index] = result.improvedPost;
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error improving content:', error);
    res.status(500).json({ error: error.message || 'AI improvement service encountered an error.' });
  }
});

app.post('/api/content/regenerate', async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const post = postsDB.find(p => p.id === postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const event = eventsDB.find(e => e.id === post.eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const singleResult = await AIService.generate_content(
      event,
      {
        platforms: [post.platform],
        contentType: 'post',
        tone: 'energetic',
        language: 'English',
        applyBrandProfile: true
      },
      brandProfileDB
    );

    if (singleResult.length > 0) {
      const regenerated = singleResult[0];
      const index = postsDB.findIndex(p => p.id === postId);
      if (index !== -1) {
        postsDB[index] = {
          ...regenerated,
          id: post.id,
          versions: [...post.versions, ...regenerated.versions]
        };
      }
      res.json(postsDB[index]);
    } else {
      res.status(500).json({ error: 'Could not regenerate content' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to regenerate' });
  }
});

app.post('/api/content/evaluate', async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const post = postsDB.find(p => p.id === postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const event = eventsDB.find(e => e.id === post.eventId) || {
      id: post.eventId,
      name: 'Event',
      type: 'General',
      date: '',
      location: '',
      organizer: '',
      context: '',
      participants: [],
      highlights: [],
      experiences: {},
      mediaUrls: [],
      status: 'generated',
      createdAt: ''
    };

    const evaluation = await AIService.evaluate_content(post, event);
    res.json(evaluation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Evaluation failed' });
  }
});

app.post('/api/content/carousel', async (req: Request, res: Response) => {
  try {
    const { eventId, tone } = req.body;
    const event = eventsDB.find(e => e.id === eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    const carousel = await AIService.generate_carousel(event, tone || 'engaging');
    res.json(carousel);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate carousel' });
  }
});

app.post('/api/content/reel', async (req: Request, res: Response) => {
  try {
    const { eventId, tone } = req.body;
    const event = eventsDB.find(e => e.id === eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    const reel = await AIService.generate_reel_script(event, tone || 'energetic');
    res.json(reel);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate reel script' });
  }
});

// Media Endpoints
app.get('/api/media', (_req: Request, res: Response) => {
  res.json(mediaLibraryDB);
});

app.post('/api/media/upload', (req: Request, res: Response) => {
  const { name, url, type, eventId } = req.body;
  const newMedia: MediaItem = {
    id: `med-${Date.now()}`,
    name: name || 'Uploaded media file',
    url: url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
    type: type || 'image',
    size: '2.1 MB',
    caption: 'Official event photography capture.',
    altText: 'Event attendees and participants celebrating.',
    eventId,
    uploadedAt: new Date().toISOString()
  };
  mediaLibraryDB.unshift(newMedia);
  res.status(201).json(newMedia);
});

// Calendar Endpoints
app.get('/api/calendar', (_req: Request, res: Response) => {
  res.json(calendarDB);
});

app.post('/api/calendar/schedule', (req: Request, res: Response) => {
  const { eventId, platform, scheduledTime, preview, accountHandle, postId } = req.body;
  const event = eventsDB.find(e => e.id === eventId);
  const newSchedule: ScheduledPostItem = {
    id: `cal-${Date.now()}`,
    eventId: eventId || 'evt-unknown',
    eventName: event ? event.name : 'Scheduled Event',
    platform: platform || 'instagram',
    scheduledTime: scheduledTime || new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    preview: preview || 'Preview snippet',
    accountHandle: accountHandle || '@brand_official',
    postId
  };
  calendarDB.unshift(newSchedule);

  if (postId) {
    const post = postsDB.find(p => p.id === postId);
    if (post) {
      post.publishingStatus = 'scheduled';
      post.scheduledDate = scheduledTime;
    }
  }

  res.status(201).json(newSchedule);
});

app.put('/api/calendar/:id', (req: Request, res: Response) => {
  const index = calendarDB.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Schedule not found' });
    return;
  }
  calendarDB[index] = { ...calendarDB[index], ...req.body };
  res.json(calendarDB[index]);
});

app.delete('/api/calendar/:id', (req: Request, res: Response) => {
  const index = calendarDB.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Schedule not found' });
    return;
  }
  calendarDB.splice(index, 1);
  res.json({ success: true });
});

// Brand Profile Endpoints
app.get('/api/brand', (_req: Request, res: Response) => {
  res.json(brandProfileDB);
});

app.put('/api/brand', (req: Request, res: Response) => {
  brandProfileDB = { ...brandProfileDB, ...req.body };
  res.json(brandProfileDB);
});

// Social Accounts Endpoints
app.get('/api/social/accounts', (_req: Request, res: Response) => {
  res.json(connectedAccountsDB);
});

app.post('/api/social/connect', (req: Request, res: Response) => {
  const { platform, handle, accountName } = req.body;
  const existing = connectedAccountsDB.find(a => a.platform === platform);
  if (existing) {
    existing.connected = true;
    if (handle) existing.handle = handle;
    if (accountName) existing.accountName = accountName;
    existing.lastSynced = new Date().toISOString();
    res.json(existing);
  } else {
    const newAcc: ConnectedAccount = {
      platform,
      accountName: accountName || `${platform} Profile`,
      handle: handle || `@${platform}_account`,
      connected: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      lastSynced: new Date().toISOString()
    };
    connectedAccountsDB.push(newAcc);
    res.json(newAcc);
  }
});

app.post('/api/social/publish', (req: Request, res: Response) => {
  const { postId, platform, isDemoMode = true } = req.body;
  const post = postsDB.find(p => p.id === postId);

  if (!post) {
    res.status(404).json({ error: 'Post not found for publishing' });
    return;
  }

  // Publishing verification per requirements:
  // "If in demo mode, clearly state Demo Mode — No real post was published."
  post.publishingStatus = 'published';
  post.publishedUrl = `https://${platform}.com/share/post-${post.id}`;

  const targetAccount = connectedAccountsDB.find(a => a.platform === platform);

  res.json({
    success: true,
    status: 'published',
    publishedUrl: post.publishedUrl,
    isDemoMode,
    message: isDemoMode 
      ? `Demo Mode — Simulated publishing to ${targetAccount?.handle || platform}. (No real external post was published.)`
      : `Successfully published to ${platform}!`,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Vite Integration (Dev Middleware & Static Build)
// ==========================================

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 AI Content Studio server active at http://localhost:${PORT}`);
  });
}

startServer();
