import React, { useState, useEffect } from 'react';
import { ViewState, UserStats } from './types';
import { getUserStats } from './utils/storage';
import WelcomeView from './views/WelcomeView';
import GameView from './views/GameView';
import StatsView from './views/StatsView';
import NounListView from './views/NounListView';
import SettingsView from './views/SettingsView';
import { BarChart2, List, Home, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('WELCOME');
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [statsVersion, setStatsVersion] = useState(0); // To force re-read stats

  // Refresh stats when view changes or explicitly requested
  useEffect(() => {
    setStats(getUserStats());
  }, [view, statsVersion]);

  // Update stats trigger passed to game
  const handleGameAction = () => {
     setStatsVersion(prev => prev + 1);
  };

  const renderView = () => {
    switch (view) {
      case 'WELCOME':
        return <WelcomeView onStart={() => setView('GAME')} />;
      case 'GAME':
        return (
           <GameView 
             dayStreak={stats.currentDayStreak} 
             correctToday={0} // In a real app, track session stats separately
             onQuit={() => setView('WELCOME')}
           />
        );
      case 'STATS':
        // Return to Welcome/Home instead of Game
        return <StatsView stats={stats} onBack={() => setView('WELCOME')} />;
      case 'NOUN_LIST':
        return <NounListView onBack={() => setView('WELCOME')} />;
      case 'SETTINGS':
        return <SettingsView onBack={() => setView('WELCOME')} />;
      default:
        return <WelcomeView onStart={() => setView('GAME')} />;
    }
  };

  // Navbar is hidden ONLY when playing the game (immersive mode)
  const showNavbar = view !== 'GAME';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col py-6 ${showNavbar ? 'pb-28' : ''}`}>
        {renderView()}
      </main>

      {/* Bottom Navigation Bar */}
      {showNavbar && (
        <>
           <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-6 py-3 flex items-center gap-8 z-40">
              <button 
                onClick={() => setView('WELCOME')}
                className={`flex flex-col items-center gap-1 transition-colors ${view === 'WELCOME' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Beranda"
              >
                <Home className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setView('STATS')}
                className={`flex flex-col items-center gap-1 transition-colors ${view === 'STATS' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Statistik"
              >
                <BarChart2 className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setView('NOUN_LIST')}
                className={`flex flex-col items-center gap-1 transition-colors ${view === 'NOUN_LIST' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Daftar Kata"
              >
                <List className="w-6 h-6" />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-[-8px]"></div>
              <button 
                onClick={() => setView('SETTINGS')}
                className={`flex flex-col items-center gap-1 transition-colors ${view === 'SETTINGS' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Pengaturan"
              >
                <Settings className="w-6 h-6" />
              </button>
           </div>
        </>
      )}

      {/* Static Footer Line */}
      <footer className="text-center py-6 px-4 text-[10px] text-slate-400 pb-6">
        <p>Kartu Bahasa — dibuat untuk pembelajar bahasa Jerman asal Indonesia.</p>
      </footer>
    </div>
  );
};

export default App;