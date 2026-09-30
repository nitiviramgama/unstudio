import React from 'react';
import { Settings as SettingsIcon, Sparkles, Shield, User, Info, Check, RefreshCw } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface SettingsViewProps {
  user: { name: string; email: string; organization: string };
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string; organization: string }>>;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onResetToDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  setUser,
  isDemoMode,
  setIsDemoMode,
  onResetToDemo
}) => {
  const { showToast } = useToast();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Preferences & Configuration
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            System Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your account identity, demo mode toggles, and AI storytelling model parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Profile Identity
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Your Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Affiliated Organization</label>
              <input
                type="text"
                value={user.organization}
                onChange={(e) => setUser({ ...user, organization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <button
              onClick={() => showToast('Profile identity updated', 'success')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Demo Mode & AI Architecture */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              AI Engine & Demo Controls
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 space-y-1">
              <span className="font-bold block">Active AI Model:</span>
              <p className="font-mono text-[11px] text-purple-800">
                models/gemini-3.8-flash (Server-Side GenAI SDK)
              </p>
              <p className="text-[11px] text-purple-700">
                Temperature calibrated to 0.4–0.6 with zero-hallucination constraint prompts.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Competition Demo Mode</span>
                <span className="text-[11px] text-slate-500">
                  Allows seamless live simulation of publishing & offline failover.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => {
                  setIsDemoMode(e.target.checked);
                  showToast(`Demo mode ${e.target.checked ? 'activated' : 'disabled'}`, 'info');
                }}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <button
              onClick={onResetToDemo}
              className="w-full py-2.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Reload Technofest 2026 Demo Data</span>
            </button>
          </div>
        </div>

      </div>

      {/* Philosophy Banner (Section 49) */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 text-white rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl shrink-0">
          ✨
        </div>
        <div>
          <h4 className="text-base font-bold">"You tell us what happened. AI tells your story."</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            AI Content Studio was engineered to remove the friction of prompt engineering. Users provide authentic experiences, student highlights, and community feedback, while the system creates faithful, platform-optimized stories.
          </p>
        </div>
      </div>

    </div>
  );
};
