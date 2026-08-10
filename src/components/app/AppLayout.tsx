import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, CheckSquare, Clock, BarChart2, Target, Calendar, User, LogOut, GraduationCap, RotateCcw } from 'lucide-react';
import { DashboardView } from './DashboardView';
import { TaskManagementView } from './TaskManagementView';
import { PomodoroView } from './PomodoroView';
import { StatisticsView } from './StatisticsView';
import { GoalsView } from './GoalsView';
import { ScheduleView } from './ScheduleView';
import { AppTabMode } from '../../types';

export const AppLayout: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, openAuthModal, resetAllData } = useApp();

  const navItems: { id: AppTabMode; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus Timer', icon: <Clock className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation for Desktop */}
      <aside className="w-full md:w-64 border-r border-slate-800/80 bg-[#090b16] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo Badge */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Study OS</div>
              <div className="text-[10px] text-violet-400 font-medium">Student Productivity App</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Reset Data */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={() => {
              if (window.confirm('Reset workspace tasks, schedule, and study timer logs to defaults?')) {
                resetAllData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset App Data</span>
          </button>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {user.name ? user.name.charAt(0) : 'P'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email || 'Student'}</div>
              </div>
            </div>

            {user.isLoggedIn ? (
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="p-1.5 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Main Workspace View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'tasks' && <TaskManagementView />}
        {activeTab === 'focus' && <PomodoroView />}
        {activeTab === 'stats' && <StatisticsView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'schedule' && <ScheduleView />}
      </main>

    </div>
  );
};
