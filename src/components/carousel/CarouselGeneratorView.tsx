import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Check, 
  Lightbulb, 
  Share2 
} from 'lucide-react';
import { EventData, CarouselData, CarouselSlide } from '../../types';
import { useToast } from '../ui/Toast';

interface CarouselGeneratorViewProps {
  event: EventData;
  onBackToStudio: () => void;
}

export const CarouselGeneratorView: React.FC<CarouselGeneratorViewProps> = ({
  event,
  onBackToStudio
}) => {
  const { showToast } = useToast();
  const [carousel, setCarousel] = useState<CarouselData | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editBody, setEditBody] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const fetchCarousel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          tone: 'engaging'
        })
      });
      const data = await response.json();
      setCarousel(data);
    } catch (err) {
      console.error(err);
      showToast('Could not generate carousel', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, [event.id]);

  const activeSlide = carousel?.slides[activeSlideIndex];

  const handleStartEdit = () => {
    if (activeSlide) {
      setEditTitle(activeSlide.title);
      setEditBody(activeSlide.body);
      setIsEditingSlide(true);
    }
  };

  const handleSaveEdit = () => {
    if (!carousel) return;
    const updatedSlides = [...carousel.slides];
    updatedSlides[activeSlideIndex] = {
      ...updatedSlides[activeSlideIndex],
      title: editTitle,
      body: editBody
    };
    setCarousel({ ...carousel, slides: updatedSlides });
    setIsEditingSlide(false);
    showToast('Slide updated!', 'success');
  };

  const handleDownloadDeck = () => {
    if (!carousel) return;
    const content = `CAROUSEL DECK: ${carousel.title}\nEvent: ${event.name}\n\n` +
      carousel.slides.map(s => `--- SLIDE ${s.slideNumber}: ${s.title} ---\nSubtitle: ${s.subtitle || ''}\nBody: ${s.body}\nVisual Suggestion: ${s.visualSuggestion}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${event.name.replace(/\s+/g, '_')}_Instagram_Carousel.txt`;
    a.click();
    showToast('Carousel deck downloaded', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full">
              Instagram Carousel Builder
            </span>
            <span className="text-xs text-slate-500">• {event.name}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {carousel?.title || 'Multi-Slide Event Story'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            6-slide visual progression designed for high swipe-through rates and dwell time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCarousel}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Regenerate Slides</span>
          </button>
          <button
            onClick={handleDownloadDeck}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Deck</span>
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Viewer */}
      {carousel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Interactive Visual Slide Mockup (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Square 1:1 Aspect Ratio Instagram Carousel Preview */}
            <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white shadow-2xl overflow-hidden border border-slate-800">
              
              {/* Background ambient pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Top row: Brand & Slide Indicator */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold tracking-wider uppercase text-[11px] text-pink-400">
                  {event.name}
                </span>
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[11px] font-bold">
                  Slide {activeSlideIndex + 1} / {carousel.slides.length}
                </span>
              </div>

              {/* Slide Body Content */}
              <div className="relative z-10 space-y-4 my-auto">
                {isEditingSlide ? (
                  <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 text-sm bg-slate-800 text-white border border-slate-600 rounded-lg"
                    />
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={4}
                      className="w-full p-2 text-xs bg-slate-800 text-white border border-slate-600 rounded-lg"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingSlide(false)}
                        className="px-3 py-1 text-xs text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block">
                      {activeSlide?.subtitle || 'Event Moment'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                      {activeSlide?.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md font-sans">
                      {activeSlide?.body}
                    </p>
                  </>
                )}
              </div>

              {/* Bottom Visual Art Direction Note */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-medium text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Swipe Left →</span>
                </span>
                <button
                  onClick={handleStartEdit}
                  className="hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Slide</span>
                </button>
              </div>

            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={activeSlideIndex === 0}
                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {carousel.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === activeSlideIndex
                        ? 'w-8 bg-indigo-600'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlideIndex(prev => Math.min(carousel.slides.length - 1, prev + 1))}
                disabled={activeSlideIndex === carousel.slides.length - 1}
                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 shadow-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right: Slide List & Photo Recommendations (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Slide Structure & Visual Directions
              </h3>
              
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {carousel.slides.map((slide, idx) => {
                  const isCurrent = idx === activeSlideIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          Slide {slide.slideNumber}: {slide.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 line-clamp-1">{slide.body}</p>
                      
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-purple-700">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong>Visual Idea:</strong> {slide.visualSuggestion}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-2">
              <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Carousel Storytelling Tip</span>
              </h4>
              <p className="leading-relaxed">
                Notice how Slide 3 highlights students and Slide 4 highlights faculty contribution, matching real event feedback without inventing fictional quotes.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
