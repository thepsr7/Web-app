import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Lock, Mail, ShieldCheck, X, Sparkles, UserCheck, Eye, EyeOff, BookOpen, AlertCircle, CheckCircle2, ArrowRight, KeyRound, Globe } from 'lucide-react';

const MAJOR_OPTIONS = [
  'Computer Science & AI',
  'Bioengineering & Pre-Med',
  'Mechanical Engineering',
  'Business & Economics',
  'Physics & Mathematics',
  'Psychology & Neuroscience',
  'Literature & Arts',
  'Other Field of Study',
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, signup, loginAsGuest, registeredUsers, quickLoginUser, resetPassword } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [major, setMajor] = useState(MAJOR_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset mode when modal opens or authModalMode changes
  useEffect(() => {
    setMode(authModalMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please verify your password.');
          return;
        }
        const result = signup(name, email, password, major);
        if (!result.success) {
          setErrorMsg(result.error || 'Failed to create account.');
        } else {
          setSuccessMsg(result.message || 'Account registered successfully!');
        }
      } else if (mode === 'login') {
        const result = login(email, password);
        if (!result.success) {
          setErrorMsg(result.error || 'Invalid credentials.');
        } else {
          setSuccessMsg(result.message || 'Logged in successfully!');
        }
      } else if (mode === 'forgot') {
        const result = resetPassword(email, password);
        if (!result.success) {
          setErrorMsg(result.error || 'Email not found.');
        } else {
          setSuccessMsg(result.message || 'Password reset successfully!');
          setTimeout(() => setMode('login'), 1500);
        }
      }
    }, 400);
  };

  const handleSocialLogin = (providerName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(`${providerName.toLowerCase().replace(/\s+/g, '')}@student.edu`, 'socialPass123');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 relative overflow-hidden my-8">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold text-base shadow-sm">
              P
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {mode === 'signup' && 'Create Student Account'}
                {mode === 'login' && 'Welcome Back'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Study Productivity OS <span className="text-violet-400">Lite</span></p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Local Storage Prototype Notice */}
        <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-800/50 text-[11px] text-violet-200/90 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Browser Local Storage Auth</span>
            <p className="text-[10px] text-violet-300/80 mt-0.5">
              Your account details and password are saved in local <code>localStorage</code>. No external server or setup required.
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Prem Singh Rajput"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Field of Study</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <select
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 appearance-none transition-colors"
                  >
                    {MAJOR_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0 w-3.5 h-3.5 accent-violet-600"
                />
                <span>Remember this device</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Sign In to OS'}
                  {mode === 'forgot' && 'Reset My Password'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Social / Guest Divider */}
        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative px-3 bg-slate-900 text-[10px] text-slate-500 font-bold uppercase">Or Continue With</span>
        </div>

        {/* Social & Guest Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google Student')}
            className="py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] font-medium transition-all flex items-center justify-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Google SSO</span>
          </button>

          <button
            type="button"
            onClick={loginAsGuest}
            className="py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] font-medium transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Guest Session</span>
          </button>
        </div>

        {/* Switch mode footer */}
        <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          {mode === 'login' ? (
            <span>
              Need a new account?{' '}
              <button
                onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
                className="font-bold text-violet-400 hover:text-violet-300 hover:underline ml-1"
              >
                Sign Up Now
              </button>
            </span>
          ) : mode === 'signup' ? (
            <span>
              Already registered?{' '}
              <button
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="font-bold text-violet-400 hover:text-violet-300 hover:underline ml-1"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Remember your password?{' '}
              <button
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="font-bold text-violet-400 hover:text-violet-300 hover:underline ml-1"
              >
                Return to Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

