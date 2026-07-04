import { useState, useEffect } from 'react';
import { auth } from './firebase';
import Landing from './Landing';
import Auth from './Auth';
import Board from './Board';
import Profile from './ProfilePage';
import AIAssistant from './AIAssistant';
import Search from './Search';
import Admin from './Admin';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('board');

  // Listen for Firebase login status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Gate 1: The Landing Page
  if (!hasEntered) {
    return <Landing onEnter={() => setHasEntered(true)} />;
  }

  // Gate 2: Authentication
  if (!user) {
    return <Auth />;
  }

  // The Command Center: Dark Theme Layout
  // The Command Center: Dark Theme Layout
  return (
    <div className="min-h-screen bg-base text-copper font-sans">
      
      {/* Top Navigation */}
      <nav className="border-b border-copper/20 bg-panel p-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="font-serif text-2xl text-copperLight tracking-wide">
          Alumni<span className="opacity-50">Connect.</span>
        </div>
        
        <div className="flex gap-6 font-mono text-xs uppercase tracking-widest font-bold">
          <button 
            onClick={() => setCurrentView('board')} 
            className={`transition-colors ${currentView === 'board' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setCurrentView('search')} 
            className={`transition-colors ${currentView === 'search' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => setCurrentView('ai')} 
            className={`transition-colors ${currentView === 'ai' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            AI Network
          </button>
          <button 
            onClick={() => setCurrentView('profile')} 
            className={`transition-colors ${currentView === 'profile' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => auth.signOut()} 
            className="text-red-900 hover:text-red-500 transition-colors ml-4"
          >
            Terminate
          </button>
        </div>
      </nav>

      {/* Main Module Engine */}
      <main className="p-6">
        {currentView === 'board' && <Board />}
        {currentView === 'profile' && <Profile />}
        {currentView === 'ai' && <AIAssistant />}
        {currentView === 'search' && <Search />}
        {currentView === 'admin' && <Admin />}
      </main>
      
    </div>
  );
}