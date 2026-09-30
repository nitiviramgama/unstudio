import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Film, 
  Trash2, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  FileText 
} from 'lucide-react';
import { MediaItem } from '../../types';
import { useToast } from '../ui/Toast';

interface MediaLibraryViewProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  mediaItems,
  setMediaItems
}) => {
  const { showToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(mediaItems[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrlInput, setUploadedUrlInput] = useState('');
  const [uploadedNameInput, setUploadedNameInput] = useState('');

  const sampleStockOptions = [
    {
      name: 'Hackathon Collaboration Pods.jpg',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80',
      caption: 'Students working in teams during project sprints.',
      altText: 'A diverse group of university students gathered around laptops with notes.'
    },
    {
      name: 'Auditorium Crowd and Stage.jpg',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
      caption: 'Keynote session packed with enthusiastic attendees.',
      altText: 'Packed conference hall with stage lights and audience.'
    },
    {
      name: 'Award Ceremony Celebration.jpg',
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&q=80',
      caption: 'Winners celebrating stage moment with faculty advisors.',
      altText: 'Smiling participants holding awards on stage with balloons and confetti.'
    }
  ];

  const handleAddStock = (stock: typeof sampleStockOptions[0]) => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}-${Math.random()}`,
      name: stock.name,
      url: stock.url,
      type: 'image',
      size: '2.4 MB',
      caption: stock.caption,
      altText: stock.altText,
      uploadedAt: new Date().toISOString()
    };
    setMediaItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
    showToast('Photo added to media library with AI descriptions!', 'success');
  };

  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrlInput.trim()) return;

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: uploadedNameInput || 'Uploaded Event Media',
      url: uploadedUrlInput,
      type: 'image',
      size: '1.9 MB',
      caption: 'Event capture representing team innovation and participation.',
      altText: 'Event participants actively engaged in activities.',
      uploadedAt: new Date().toISOString()
    };

    setMediaItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
    setUploadedUrlInput('');
    setUploadedNameInput('');
    setIsUploading(false);
    showToast('Image uploaded successfully with AI caption & alt text', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Asset Hub
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Media Library & AI Vision Tags
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach high-res photos and videos to events with auto-generated captions and accessibility alt text.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Upload Dropzone Modal or Toggle */}
      {isUploading && (
        <form onSubmit={handleCustomUpload} className="bg-white p-6 rounded-2xl border-2 border-dashed border-indigo-300 shadow-sm space-y-4 animate-in fade-in">
          <div className="text-center max-w-md mx-auto">
            <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Add Image URL or Asset</h3>
            <p className="text-xs text-slate-500">Provide an image link to inspect and attach to events</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={uploadedNameInput}
              onChange={(e) => setUploadedNameInput(e.target.value)}
              placeholder="Asset title (e.g. Stage Winners.jpg)"
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
            <input
              type="url"
              value={uploadedUrlInput}
              onChange={(e) => setUploadedUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Confirm & Generate Alt Text
            </button>
          </div>

          {/* Quick presets */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">Or add high-quality event photo presets:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleStockOptions.map((stock, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddStock(stock)}
                  className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                >
                  + {stock.name.split('.')[0]}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Main Grid & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Gallery Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Library Assets ({mediaItems.length})
            </span>
            <span className="text-xs text-slate-400">Supported: JPG, PNG, WEBP, MP4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mediaItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    isSelected ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2.5 flex flex-col justify-end text-white text-[11px]">
                    <span className="font-semibold truncate">{item.name}</span>
                    <span className="text-slate-300 text-[10px]">{item.size}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Asset Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Asset Inspector
          </h3>

          {selectedItem ? (
            <div className="space-y-4">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedItem.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{selectedItem.size}</span>
                  <span>•</span>
                  <span>{new Date(selectedItem.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* AI Auto Caption */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1">
                <span className="font-bold text-purple-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  AI Suggested Caption
                </span>
                <p className="text-purple-950 leading-relaxed font-sans">{selectedItem.caption}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.caption);
                    showToast('Caption copied!', 'success');
                  }}
                  className="text-[11px] text-purple-700 font-bold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy caption</span>
                </button>
              </div>

              {/* AI Alt text */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800">Accessibility Alt Text:</span>
                <p className="text-slate-600 leading-relaxed font-sans">{selectedItem.altText}</p>
              </div>

              <button
                onClick={() => {
                  setMediaItems(prev => prev.filter(m => m.id !== selectedItem.id));
                  setSelectedItem(null);
                  showToast('Asset removed from library', 'info');
                }}
                className="w-full py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select an asset to view metadata and AI captions.</p>
          )}
        </div>

      </div>

    </div>
  );
};
