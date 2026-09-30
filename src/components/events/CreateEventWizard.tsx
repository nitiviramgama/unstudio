import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Building2, 
  Users, 
  MessageSquare, 
  Trophy, 
  Layers, 
  Wand2 
} from 'lucide-react';
import { EventData, ContentPreferences, Platform, Tone, Language, ContentType } from '../../types';
import { ProcessingScreen } from './ProcessingScreen';
import { useToast } from '../ui/Toast';

interface CreateEventWizardProps {
  onEventCreated: (event: EventData, preferences: ContentPreferences) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<EventData>;
}

export const CreateEventWizard: React.FC<CreateEventWizardProps> = ({
  onEventCreated,
  onCancel,
  initialData
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'Technical Event');
  const [date, setDate] = useState(initialData?.date || '2026-04-12 to 2026-04-13');
  const [location, setLocation] = useState(initialData?.location || 'Main Auditorium & Innovation Labs');
  const [organizer, setOrganizer] = useState(initialData?.organizer || 'Computer Science & Engineering Department');
  const [context, setContext] = useState(initialData?.context || '');

  // Participants
  const availableParticipants = [
    'Students', 'Faculty', 'Guests', 'Speakers', 'Industry Experts',
    'Organizers', 'Alumni', 'Parents', 'General Public', 'Other'
  ];
  const [participants, setParticipants] = useState<string[]>(
    initialData?.participants || ['Students', 'Faculty', 'Industry Experts']
  );

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights || ['24-Hour Hackathon Championship', 'AI & Machine Learning Workshop', 'Project Exhibition']
  );
  const [highlightInput, setHighlightInput] = useState('');

  // Experiences
  const [studentExp, setStudentExp] = useState(initialData?.experiences?.student || '');
  const [facultyExp, setFacultyExp] = useState(initialData?.experiences?.faculty || '');
  const [guestExp, setGuestExp] = useState(initialData?.experiences?.guest || '');
  const [organizerExp, setOrganizerExp] = useState(initialData?.experiences?.organizer || '');

  // Feedback & Achievements
  const [feedback, setFeedback] = useState(initialData?.feedback || '');
  const [achievements, setAchievements] = useState(initialData?.achievements || '');
  const [importantMoments, setImportantMoments] = useState(initialData?.importantMoments || '');

  // Content Preferences
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'instagram', 'linkedin', 'x'
  ]);
  const [contentType, setContentType] = useState<ContentType>('post');
  const [tone, setTone] = useState<Tone>('engaging');
  const [language, setLanguage] = useState<Language>('English');
  const [applyBrandProfile, setApplyBrandProfile] = useState<boolean>(true);

  // Quick Demo Prefill (Technofest 2026 per Section 47)
  const handleLoadDemoValues = () => {
    setName('Technofest 2026');
    setType('Technical Event');
    setDate('2026-04-12 to 2026-04-13');
    setLocation('Main Auditorium & Innovation Labs');
    setOrganizer('Computer Science & Engineering Department');
    setContext('A two-day college technical festival. Students participated in coding competitions, AI workshops, project exhibitions, and guest lectures from industry pioneers.');
    setParticipants(['Students', 'Faculty', 'Guests', 'Industry Experts', 'Speakers']);
    setHighlights([
      '24-Hour Hackathon Championship',
      'AI & Machine Learning Hands-on Workshop',
      'Student Project Exhibition with 85+ Projects',
      'Keynote Address on Future of Intelligent Agents'
    ]);
    setStudentExp('Students enjoyed learning, collaborating in intense teams, and competing against top peer innovators.');
    setFacultyExp('Faculty guided students throughout the event, evaluated project booths, and supported student mentorship.');
    setFeedback('The event gave us an opportunity to showcase our skills, collaborate with peers, and learn practical industry-grade tools.');
    setAchievements('Over 650 active participants, 85 demonstrated projects, and 6 corporate sponsored awards presented.');
    setImportantMoments('Inauguration lamp lighting, midnight coding challenge, and final trophy distribution.');
    setSelectedPlatforms(['instagram', 'linkedin', 'facebook', 'x', 'whatsapp']);
    setTone('engaging');
    showToast('Loaded Technofest 2026 details into form!', 'success');
  };

  const toggleParticipant = (p: string) => {
    setParticipants(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights(prev => [...prev, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, idx) => idx !== index));
  };

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        showToast('Please enter an event name', 'error');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!context.trim()) {
        showToast('Please provide some event context (tell us what happened)', 'error');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedPlatforms.length === 0) {
        showToast('Please select at least one social media platform', 'error');
        return;
      }
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    const newEvent: EventData = {
      id: initialData?.id || `evt-${Date.now()}`,
      name,
      type,
      date,
      location,
      organizer,
      context,
      participants,
      highlights,
      experiences: {
        student: studentExp || undefined,
        faculty: facultyExp || undefined,
        guest: guestExp || undefined,
        organizer: organizerExp || undefined,
      },
      feedback,
      achievements,
      importantMoments,
      mediaUrls: initialData?.mediaUrls || [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    const preferences: ContentPreferences = {
      platforms: selectedPlatforms,
      contentType,
      tone,
      language,
      applyBrandProfile
    };

    try {
      await onEventCreated(newEvent, preferences);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      showToast('Generation encountered an issue, please retry.', 'error');
    }
  };

  if (isProcessing) {
    return <ProcessingScreen eventName={name} />;
  }

  const stepTitles = [
    { num: 1, label: 'Basic Information' },
    { num: 2, label: 'Experience & Highlights' },
    { num: 3, label: 'Content Preferences' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-4">
      
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 via-purple-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-full">
            AI Event Story Creator
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Turn What Happened Into Authentic Content
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide the real moments, experiences, and feedback. AI adapts it to each platform with zero hallucinations.
          </p>
        </div>

        {/* Demo filler button */}
        <button
          onClick={handleLoadDemoValues}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-100/80 hover:bg-purple-200 rounded-xl transition shadow-xs cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>⚡ Prefill Technofest 2026</span>
        </button>
      </div>

      {/* Progress Steps (Section 30) */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {stepTitles.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    isCurrent ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepTitles.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* ================= STEP 1: Basic Information ================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technofest 2026, AI Workshop, Sports Meet..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                >
                  <option value="Technical Event">Technical Event</option>
                  <option value="College Festival">College Festival</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Conference">Conference</option>
                  <option value="Cultural Program">Cultural Program</option>
                  <option value="Sports Event">Sports Event</option>
                  <option value="Competition">Competition</option>
                  <option value="Award Ceremony">Award Ceremony</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Faculty Development">Faculty Development</option>
                  <option value="Other">Other Occasion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Date / Duration
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 2026-04-12 or April 12-13, 2026"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Main Auditorium & Innovation Labs"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organizer / Host Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering Department, Student Council..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: Experience & Highlights ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Event Context */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tell us what happened at the event <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                placeholder="Example: A two-day college technical festival organized by the Computer Department. Students participated in coding competitions, AI workshops, project exhibitions, and guest lectures from industry pioneers..."
                className="w-full p-4 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Be as descriptive as you like. AI extracts key moments without fabricating any facts.
              </span>
            </div>

            {/* Participants Multiple Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Participants (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableParticipants.map((p) => {
                  const isSelected = participants.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleParticipant(p)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Highlights Tag List */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Highlights
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="e.g. 24-Hour Hackathon, Guest Lecture, Quiz Competition..."
                  className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlights.map((h, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-medium"
                  >
                    <span>{h}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-purple-400 hover:text-purple-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Distinct Experiences Fields (Section 3) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Experiences (Optional)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Student Experience
                  </label>
                  <input
                    type="text"
                    value={studentExp}
                    onChange={(e) => setStudentExp(e.target.value)}
                    placeholder="e.g. Students enjoyed learning, collaborating and competing..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Faculty Experience
                  </label>
                  <input
                    type="text"
                    value={facultyExp}
                    onChange={(e) => setFacultyExp(e.target.value)}
                    placeholder="e.g. Faculty guided students throughout the event..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Guest Experience
                  </label>
                  <input
                    type="text"
                    value={guestExp}
                    onChange={(e) => setGuestExp(e.target.value)}
                    placeholder="e.g. Industry judges praised student creativity..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Organizer Experience
                  </label>
                  <input
                    type="text"
                    value={organizerExp}
                    onChange={(e) => setOrganizerExp(e.target.value)}
                    placeholder="e.g. Seamless execution across 4 halls..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* User Feedback & Testimonials (Section 4) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                What did people say about the event? (Feedback & Testimonials)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={2}
                placeholder='Example: "The event gave us an opportunity to showcase our skills, collaborate with peers, and learn practical industry-grade tools."'
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                The AI integrates real attendee voices to make social posts genuinely authentic.
              </span>
            </div>

            {/* Achievements & Important Moments (Section 5) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Achievements / Milestones
                </label>
                <input
                  type="text"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="e.g. Over 650 participants, 85 projects, 6 awards..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Important Moments
                </label>
                <input
                  type="text"
                  value={importantMoments}
                  onChange={(e) => setImportantMoments(e.target.value)}
                  placeholder="e.g. Inauguration lamp lighting, trophy distribution..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 3: Content Preferences ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Platform Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Platforms
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'instagram' as Platform, name: 'Instagram', icon: '📸', desc: 'Visual hook & hashtags' },
                  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: '💼', desc: 'Impact & collaboration' },
                  { id: 'facebook' as Platform, name: 'Facebook', icon: '👥', desc: 'Community & memories' },
                  { id: 'x' as Platform, name: 'X', icon: '🐦', desc: '<280 chars concise' },
                  { id: 'whatsapp' as Platform, name: 'WhatsApp', icon: '💬', desc: 'Clean broadcast memo' }
                ].map((plat) => {
                  const isChecked = selectedPlatforms.includes(plat.id);
                  return (
                    <div
                      key={plat.id}
                      onClick={() => togglePlatform(plat.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-xl">{plat.icon}</span>
                        <h4 className="font-bold text-xs text-slate-900 mt-2">{plat.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{plat.desc}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Content Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'engaging' as Tone, label: 'Engaging & Vibrant' },
                  { id: 'professional' as Tone, label: 'Professional & Executive' },
                  { id: 'energetic' as Tone, label: 'Energetic & Youthful' },
                  { id: 'inspirational' as Tone, label: 'Inspirational' },
                  { id: 'celebratory' as Tone, label: 'Celebratory' },
                  { id: 'formal' as Tone, label: 'Formal' },
                  { id: 'friendly' as Tone, label: 'Friendly & Warm' },
                  { id: 'emotional' as Tone, label: 'Emotional & Heartfelt' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left ${
                      tone === t.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Language
              </label>
              <div className="flex gap-3">
                {(['English', 'Hindi', 'Gujarati'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      language === lang
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Profile Integration */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Apply Saved Brand Guidelines</h4>
                <p className="text-[11px] text-slate-500">
                  Infuse official hashtags, organization voice tone, and avoid blacklist keywords.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyBrandProfile}
                  onChange={(e) => setApplyBrandProfile(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

          </div>
        )}

      </div>

      {/* Navigation Buttons Footer */}
      <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition"
        >
          {currentStep === 3 ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>✨ Generate Content</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
