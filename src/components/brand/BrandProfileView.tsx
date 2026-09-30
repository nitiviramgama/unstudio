import React, { useState } from 'react';
import { Building2, Save, Sparkles, Hash, AlertOctagon, Palette, Globe, Check } from 'lucide-react';
import { BrandProfile, Tone } from '../../types';
import { useToast } from '../ui/Toast';

interface BrandProfileViewProps {
  brandProfile: BrandProfile;
  setBrandProfile: React.Dispatch<React.SetStateAction<BrandProfile>>;
}

export const BrandProfileView: React.FC<BrandProfileViewProps> = ({
  brandProfile,
  setBrandProfile
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<BrandProfile>(brandProfile);
  const [tagInput, setTagInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/brand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setBrandProfile(data);
      showToast('Brand profile & voice guidelines saved!', 'success');
    } catch (err) {
      setBrandProfile(formData);
      showToast('Brand guidelines updated locally', 'success');
    }
  };

  const addHashtag = () => {
    if (tagInput.trim()) {
      const formatted = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
      setFormData(prev => ({
        ...prev,
        preferredHashtags: [...prev.preferredHashtags, formatted]
      }));
      setTagInput('');
    }
  };

  const removeHashtag = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      preferredHashtags: prev.preferredHashtags.filter((_, i) => i !== idx)
    }));
  };

  const addAvoidWord = () => {
    if (avoidInput.trim()) {
      setFormData(prev => ({
        ...prev,
        wordsToAvoid: [...prev.wordsToAvoid, avoidInput.trim().toLowerCase()]
      }));
      setAvoidInput('');
    }
  };

  const removeAvoidWord = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      wordsToAvoid: prev.wordsToAvoid.filter((_, i) => i !== idx)
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Brand Memory
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Organization Identity & Brand Voice
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The AI automatically aligns event stories to your official tone, handles, and approved hashtags.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Brand Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: General Identity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Organization Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / University / Company Name
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                About & Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Social Handles */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Official Handles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Instagram Handle</span>
                  <input
                    type="text"
                    value={formData.socialHandles.instagram || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialHandles: { ...formData.socialHandles, instagram: e.target.value }
                    })}
                    placeholder="@official_handle"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">LinkedIn Page</span>
                  <input
                    type="text"
                    value={formData.socialHandles.linkedin || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialHandles: { ...formData.socialHandles, linkedin: e.target.value }
                    })}
                    placeholder="company/org-name"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">X (Twitter)</span>
                  <input
                    type="text"
                    value={formData.socialHandles.x || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialHandles: { ...formData.socialHandles, x: e.target.value }
                    })}
                    placeholder="@org_news"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">WhatsApp Broadcast</span>
                  <input
                    type="text"
                    value={formData.socialHandles.whatsapp || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialHandles: { ...formData.socialHandles, whatsapp: e.target.value }
                    })}
                    placeholder="+1 555-0199"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: AI Voice Directives (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Tone Preference */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Default Voice Tone
            </h3>
            <select
              value={formData.preferredTone}
              onChange={(e) => setFormData({ ...formData, preferredTone: e.target.value as Tone })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
            >
              <option value="engaging">Engaging & Vibrant</option>
              <option value="professional">Professional & Impactful</option>
              <option value="energetic">Energetic & Youthful</option>
              <option value="inspirational">Inspirational & Visionary</option>
              <option value="celebratory">Celebratory & Proud</option>
              <option value="formal">Formal Academic / Institutional</option>
            </select>
          </div>

          {/* Preferred Hashtags */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Approved Hashtags
              </h3>
              <span className="text-[11px] text-slate-400">Included in AI outputs</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="#InstitutionTag"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
              />
              <button
                type="button"
                onClick={addHashtag}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.preferredHashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200 flex items-center gap-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeHashtag(idx)}
                    className="text-indigo-400 hover:text-indigo-700 text-xs ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Words to Avoid (Blacklist) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Words to Avoid
              </h3>
              <span className="text-[11px] text-rose-500 font-medium">Banned keywords</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={avoidInput}
                onChange={(e) => setAvoidInput(e.target.value)}
                placeholder="e.g. cheap, synergy..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAvoidWord())}
              />
              <button
                type="button"
                onClick={addAvoidWord}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg"
              >
                Ban
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.wordsToAvoid.map((word, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200 flex items-center gap-1"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => removeAvoidWord(idx)}
                    className="text-rose-400 hover:text-rose-700 text-xs ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </form>
  );
};
