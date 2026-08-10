import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ShowcaseView } from './components/ShowcaseView';
import { AppLayout } from './components/app/AppLayout';
import { MobileSimulator } from './components/MobileSimulator';
import { AuthModal } from './components/app/AuthModal';

const MainContent: React.FC = () => {
  const { mainView } = useApp();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      <Navbar />
      
      <div className="flex-1">
        {mainView === 'showcase' && <ShowcaseView />}
        {mainView === 'app' && <AppLayout />}
        {mainView === 'mobile-preview' && <MobileSimulator />}
      </div>

      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
