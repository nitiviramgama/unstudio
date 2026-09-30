import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; email: string; organization: string }) => void;
  onGoToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToLanding,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const displayName = name || (email ? email.split('@')[0] : 'Event Organizer');
      onLoginSuccess({
        name: displayName,
        email: email || 'alex.morgan@giti.edu',
        organization: 'Global Institute of Technology'
      });
      showToast(isSignUp ? `Account created! Welcome, ${displayName}` : `Welcome back, ${displayName}!`, 'success');
    }, 400);
  };

  const handleGoogleLogin = () => {
    onLoginSuccess({
      name: 'Google User',
      email: 'user@google.com',
      organization: 'Global University Partner'
    });
    showToast('Signed in with Google', 'success');
  };

  const handleMicrosoftLogin = () => {
    onLoginSuccess({
      name: 'Microsoft Campus Lead',
      email: 'campus@microsoft.edu',
      organization: 'Engineering Faculty Council'
    });
    showToast('Signed in with Microsoft', 'success');
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: 'Alex Morgan',
      email: 'alex.morgan@giti.edu',
      organization: 'Global Institute of Technology'
    });
    showToast('Signed in with Demo Organizer Profile', 'success');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-slate-50 font-sans overflow-hidden">
      
      {/* Subtle Purple / Blue Abstract Shapes in Background (Requested) */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-200/45 to-indigo-200/40 blur-3xl pointer-events-none transform -rotate-12 animate-pulse-subtle"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-200/40 via-blue-200/35 to-purple-200/40 blur-3xl pointer-events-none transform rotate-12"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-radial from-white via-transparent to-transparent opacity-80 pointer-events-none"></div>

      {/* Subtle geometric abstract accent polygons */}
      <div className="absolute top-20 right-24 w-32 h-32 rounded-3xl bg-indigo-100/40 border border-indigo-200/30 transform rotate-45 pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-purple-100/40 border border-purple-200/30 pointer-events-none hidden md:block"></div>

      {/* Main Centered Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-slate-200/80 p-8 sm:p-10 backdrop-blur-xs">
        
        {/* Top: AI Content Studio Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div 
            onClick={onGoToLanding}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 cursor-pointer hover:scale-105 transition-transform"
            title="Go to Landing Page"
          >
            <Sparkles className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full inline-block mb-1.5">
              AI Content Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isSignUp 
                ? 'Join AI Content Studio and start transforming events into social stories.' 
                : 'Log in to continue creating amazing content.'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.edu"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to provided email', 'info')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{isSignUp ? 'Create Free Account' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="uppercase tracking-wider font-semibold text-[10px]">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3">
          
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Microsoft */}
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </div>

        {/* Links: Sign up toggle */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}</span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>

        {/* Instant Demo Shortcut */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl border border-purple-200/80 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>⚡ Instant One-Click Demo Login</span>
          </button>
        </div>

      </div>

      {/* Bottom subtle copyright / branding note */}
      <div className="absolute bottom-4 text-center text-[11px] text-slate-400 z-10">
        AI Content Studio • From Event Experience to Publish-Ready Social Media
      </div>

    </div>
  );
};
