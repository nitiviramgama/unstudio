import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { ConnectedAccount, Platform } from '../../types';
import { useToast } from '../ui/Toast';

interface ConnectedAccountsViewProps {
  accounts: ConnectedAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<ConnectedAccount[]>>;
  isDemoMode: boolean;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  accounts,
  setAccounts,
  isDemoMode
}) => {
  const { showToast } = useToast();
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [customHandle, setCustomHandle] = useState('');

  const toggleConnection = (platform: Platform) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.platform === platform) {
        const nextState = !acc.connected;
        showToast(
          nextState ? `Connected to ${platform}` : `Disconnected ${platform}`,
          nextState ? 'success' : 'info'
        );
        return {
          ...acc,
          connected: nextState,
          lastSynced: nextState ? new Date().toISOString() : acc.lastSynced
        };
      }
      return acc;
    }));
  };

  const platformMeta: Record<Platform, { name: string; icon: string; color: string; desc: string }> = {
    instagram: { name: 'Instagram Professional', icon: '📸', color: 'from-pink-500 to-purple-600', desc: 'Direct publishing via Instagram Graph API' },
    linkedin: { name: 'LinkedIn Organization Page', icon: '💼', color: 'from-blue-600 to-indigo-700', desc: 'Official LinkedIn Community Management API' },
    facebook: { name: 'Facebook Pages', icon: '👥', color: 'from-blue-500 to-blue-700', desc: 'Meta Graph API for verified organization pages' },
    x: { name: 'X Developer API', icon: '🐦', color: 'from-neutral-800 to-black', desc: 'X API v2 Post endpoint with OAuth 2.0 PKCE' },
    whatsapp: { name: 'WhatsApp Business Cloud', icon: '💬', color: 'from-emerald-500 to-green-600', desc: 'Official WhatsApp Cloud API for group broadcast' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Channel Management
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Connected Social Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Secure token authorization for Instagram, LinkedIn, Facebook, X, and WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OAuth 2.0 Secure Storage</span>
        </div>
      </div>

      {/* Security Banner (Section 18) */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 flex items-start gap-3 shadow-md">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-white">Zero Password Policy & Privacy Guarantee</p>
          <p className="text-slate-300 leading-relaxed">
            AI Content Studio connects through official platform OAuth protocols. We will never ask for your passwords. In Demo Mode, all API publishing events are clearly marked with simulation disclaimers.
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const meta = platformMeta[acc.platform];
          return (
            <div
              key={acc.platform}
              className={`p-5 rounded-2xl border transition-all bg-white flex flex-col justify-between ${
                acc.connected ? 'border-slate-200 shadow-xs' : 'border-dashed border-slate-300 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {meta.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{meta.name}</h4>
                      <p className="text-[11px] text-slate-500">{meta.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    acc.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {acc.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={acc.avatar}
                      alt={acc.accountName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block leading-tight">{acc.accountName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{acc.handle}</span>
                    </div>
                  </div>
                  {acc.lastSynced && (
                    <span className="text-[10px] text-slate-400">
                      Synced {new Date(acc.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    acc.lastSynced = new Date().toISOString();
                    setAccounts([...accounts]);
                    showToast(`${acc.platform} credentials re-synchronized`, 'success');
                  }}
                  disabled={!acc.connected}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 disabled:opacity-30"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Token</span>
                </button>

                <button
                  onClick={() => toggleConnection(acc.platform)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    acc.connected
                      ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                  }`}
                >
                  {acc.connected ? 'Disconnect' : 'Connect via OAuth'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
