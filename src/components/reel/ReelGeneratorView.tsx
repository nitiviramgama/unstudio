import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  RotateCw, 
  Download, 
  Music, 
  Play, 
  Pause, 
  Clock, 
  Eye, 
  MessageSquare, 
  Film 
} from 'lucide-react';
import { EventData, ReelScriptData } from '../../types';
import { useToast } from '../ui/Toast';

interface ReelGeneratorViewProps {
  event: EventData;
  onBackToStudio: () => void;
}

export const ReelGeneratorView: React.FC<ReelGeneratorViewProps> = ({
  event,
  onBackToStudio
}) => {
  const { showToast } = useToast();
  const [reelData, setReelData] = useState<ReelScriptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const fetchReelScript = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content/reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          tone: 'energetic'
        })
      });
      const data = await response.json();
      setReelData(data);
    } catch (err) {
      console.error(err);
      showToast('Could not generate reel script', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReelScript();
  }, [event.id]);

  // Audio/Teleprompter playback simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingSimulation && reelData) {
      timer = setTimeout(() => {
        if (currentSectionIndex < reelData.sections.length - 1) {
          setCurrentSectionIndex(prev => prev + 1);
        } else {
          setIsPlayingSimulation(false);
          setCurrentSectionIndex(0);
          showToast('30-second reel preview finished!', 'info');
        }
      }, 5000); // 5 seconds per phase for visual demo
    }
    return () => clearTimeout(timer);
  }, [isPlayingSimulation, currentSectionIndex, reelData]);

  const handleDownloadScript = () => {
    if (!reelData) return;
    const text = `REEL / SHORTS SCRIPT: ${reelData.title}\nEvent: ${event.name}\nTarget Duration: ${reelData.targetDuration}\nSoundtrack Suggestion: ${reelData.soundtrackSuggestion}\n\n` +
      reelData.sections.map(s => `[${s.timeRange}] - ${s.phase}\nSCENE: ${s.scene}\nVOICEOVER: "${s.voiceover}"\nON-SCREEN TEXT: ${s.onScreenText}\nVISUAL SUGGESTION: ${s.visualSuggestion}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${event.name.replace(/\s+/g, '_')}_Reel_Script_30s.txt`;
    a.click();
    showToast('Reel script downloaded!', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              Instagram Reel & YouTube Shorts Script
            </span>
            <span className="text-xs text-slate-500">• 0-30s Timeline</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {reelData?.title || `${event.name} in 30 Seconds`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Timed scene breakdown with voice-overs, on-screen kinetic typography, and soundtrack advice.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReelScript}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
            <span>Regenerate Script</span>
          </button>
          <button
            onClick={handleDownloadScript}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Script</span>
          </button>
        </div>
      </div>

      {reelData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Live Simulated Reel Phone (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-9/16 max-w-[320px] mx-auto bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex flex-col justify-between text-white p-5">
              
              {/* Top Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
                <span className="font-bold tracking-wider text-[10px] bg-black/50 px-2 py-0.5 rounded">
                  0-30s SIMULATOR
                </span>
                <span className="font-mono text-xs font-bold text-pink-400">
                  {reelData.sections[currentSectionIndex]?.timeRange}
                </span>
              </div>

              {/* Center Kinetic Typography Mockup */}
              <div className="relative z-10 text-center my-auto space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/30 inline-block animate-pulse">
                  {reelData.sections[currentSectionIndex]?.phase}
                </span>

                <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {reelData.sections[currentSectionIndex]?.onScreenText}
                </h4>

                <div className="p-3 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 text-xs text-slate-200 italic leading-relaxed">
                  🗣️ "{reelData.sections[currentSectionIndex]?.voiceover}"
                </div>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 space-y-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Music className="w-3.5 h-3.5 text-pink-400" />
                  <span className="truncate">{reelData.soundtrackSuggestion}</span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  Scene: {reelData.sections[currentSectionIndex]?.scene}
                </div>
              </div>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black/80 to-black pointer-events-none"></div>
            </div>

            {/* Play/Pause Simulation Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 shadow-md transition"
              >
                {isPlayingSimulation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingSimulation ? 'Pause Timeline' : 'Simulate 30s Run-through'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 5-Part Timeline Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Soundtrack Box */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Recommended Audio Direction</h4>
                  <p className="text-purple-800 text-[11px] font-medium">{reelData.soundtrackSuggestion}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-purple-700 bg-white px-2 py-1 rounded-md border border-purple-200">
                Trending Beat
              </span>
            </div>

            {/* Timed Sections Cards */}
            <div className="space-y-3">
              {reelData.sections.map((section, idx) => {
                const isActive = idx === currentSectionIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentSectionIndex(idx)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isActive
                        ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          {section.timeRange}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                          {section.phase}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                          Now Playing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                          Visual Scene & Camera Action
                        </span>
                        <p className="text-slate-700 leading-relaxed font-medium">{section.scene}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                          Voiceover Line
                        </span>
                        <p className="text-slate-900 font-semibold italic">"{section.voiceover}"</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] gap-2">
                      <span className="text-slate-600">
                        <strong>Text Overlay:</strong> <span className="text-indigo-600 font-bold">{section.onScreenText}</span>
                      </span>
                      <span className="text-slate-500 italic">
                        Visual note: {section.visualSuggestion}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
