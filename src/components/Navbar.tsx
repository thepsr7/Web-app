import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Moon, Sun, Layout, Smartphone, Play, User, LogOut, Code, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { mainView, setMainView, isDarkMode, toggleTheme, user, logout, openAuthModal } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090b15]/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#090b15]/90 light:bg-white/90 light:border-slate-200 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0f1d] dark:bg-[#0d0f1d] light:bg-white rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-400 dark:text-purple-400 light:text-purple-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 dark:from-white dark:via-slate-200 dark:to-purple-300 light:from-slate-900 light:to-purple-700 bg-clip-text text-transparent">
                Study Productivity <span className="text-violet-400 font-extrabold">OS</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Web App
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium hidden sm:block">
              Plan. Focus. Improve.
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="hidden md:flex items-center bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-inner">
          <button
            onClick={() => setMainView('app')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainView === 'app'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            Web Application
          </button>

          <button
            onClick={() => setMainView('showcase')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainView === 'showcase'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Overview
          </button>

          <button
            onClick={() => setMainView('mobile-preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainView === 'mobile-preview'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile View
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          
          {/* Developer Credit Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-medium">
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>PSR (Prem Singh Rajput)</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 dark:bg-slate-800/60 dark:border-slate-700/60 light:bg-slate-100 light:border-slate-300 light:text-slate-800 text-slate-300 transition-all hover:scale-105 active:scale-95"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Auth State Buttons */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-all hover:border-violet-500/50"
                title="Account Settings"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-semibold text-white max-w-[100px] truncate leading-none">{user.name}</p>
                  <p className="text-[9px] text-slate-400 leading-none mt-0.5">{user.isGuest ? 'Guest' : user.major || 'Student'}</p>
                </div>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-800/40 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Quick Launch App Button if in showcase view */}
          {mainView === 'showcase' && (
            <button
              onClick={() => setMainView('app')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch OS
            </button>
          )}

        </div>

      </div>

      {/* Mobile view bar navigation */}
      <div className="flex md:hidden items-center justify-around bg-slate-900/90 border-t border-slate-800/60 py-2 px-4 text-xs font-medium">
        <button
          onClick={() => setMainView('app')}
          className={`px-3 py-1 rounded-lg ${mainView === 'app' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Web App
        </button>
        <button
          onClick={() => setMainView('showcase')}
          className={`px-3 py-1 rounded-lg ${mainView === 'showcase' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setMainView('mobile-preview')}
          className={`px-3 py-1 rounded-lg ${mainView === 'mobile-preview' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Mobile
        </button>
      </div>

    </header>
  );
};
