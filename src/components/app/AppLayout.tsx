import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, CheckSquare, Clock, BarChart2, Settings, GraduationCap, RotateCcw } from 'lucide-react';
import { DashboardView } from './DashboardView';
import { TaskManagementView } from './TaskManagementView';
import { PomodoroView } from './PomodoroView';
import { StatisticsView } from './StatisticsView';
import { SettingsView } from './SettingsView';
import { AddTaskModal } from './AddTaskModal';
import { MascotWidget } from '../mascot/MascotWidget';
import { AppTabMode } from '../../types';

export const AppLayout: React.FC = () => {
  const { activeTab, setActiveTab, user, resetAllData, preferences } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus', icon: <Clock className="w-5 h-5" /> },
    { id: 'stats', label: 'Progress', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090F] text-white flex flex-col md:flex-row relative font-sans selection:bg-[#8B5CF6] selection:text-white">
      
      {/* Sidebar Navigation for Desktop */}
      <aside className="hidden md:flex w-64 border-r border-[#2A2A40] bg-[#141726] p-5 flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo Badge */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white font-black shadow-lg shadow-[#8B5CF6]/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight">Study OS</div>
              <div className="text-[10px] text-[#8B5CF6] font-bold">Productivity Suite</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id || (item.id === 'settings' && activeTab === 'goals');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AppTabMode)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-lg shadow-[#8B5CF6]/30'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Data Reset */}
        <div className="pt-4 border-t border-[#2A2A40] space-y-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all app statistics, tasks, and timer records to zero?')) {
                resetAllData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#09090F] hover:bg-[#2A2A40] text-[#9CA3AF] text-[11px] font-bold border border-[#2A2A40] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset App Data to 0</span>
          </button>

          <div className="p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] text-white font-black flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-extrabold text-white truncate">{user?.name || 'Guest User'}</div>
              <div className="text-[10px] text-[#9CA3AF] truncate">{user?.email || 'Sign in to sync'}</div>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Workspace View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-28">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'tasks' && <TaskManagementView />}
        {activeTab === 'focus' && <PomodoroView />}
        {activeTab === 'stats' && <StatisticsView />}
        {(activeTab === 'settings' || activeTab === 'goals') && <SettingsView />}
      </main>

      {/* Bottom Navigation Bar for Mobile matching screenshot */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141726]/95 backdrop-blur-xl border-t border-[#2A2A40] px-3 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map(item => {
          const isActive = activeTab === item.id || (item.id === 'settings' && activeTab === 'goals');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTabMode)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#8B5CF6] font-black'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-1 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_#8B5CF6]" />
              )}
              {item.icon}
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal />

      {/* Interactive Mochi Owl Mascot */}
      {preferences?.showMascot !== false && <MascotWidget />}

    </div>
  );
};
