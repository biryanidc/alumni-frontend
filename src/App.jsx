import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Landing from './Landing';
import Auth from './Auth';
import Board from './Board';
import Profile from './ProfilePage';
import AIAssistant from './AIAssistant';
import Search from './Search';
import Admin from './Admin';
import Leaderboard from './Leaderboard';
import Referrals from './Referrals';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentView, setCurrentView] = useState('board');

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // Fetch identity to determine clearance level
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
        // Force routing back to the Board on login
        setCurrentView('board');
      } else {
        setUserRole(null);
        // Force routing back to the Board on logout
        setCurrentView('board');
      }
    });
    return () => unsubscribe();
  }, []);

  if (!hasEntered) {
    return <Landing onEnter={() => setHasEntered(true)} />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-base text-copper font-sans">
      
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
            onClick={() => setCurrentView('leaderboard')} 
            className={`transition-colors ${currentView === 'leaderboard' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            Rankings
          </button>
          <button 
            onClick={() => setCurrentView('ai')} 
            className={`transition-colors ${currentView === 'ai' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
          >
            AI Network
          </button>
          
          {/* SECURITY GATE: Only render button for Admins */}
          {userRole === 'admin' && (
            <button 
              onClick={() => setCurrentView('admin')} 
              className={`transition-colors ${currentView === 'admin' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
            >
              Telemetry
            </button>
          )}
          <button 
  onClick={() => setCurrentView('referrals')} 
  className={`transition-colors ${currentView === 'referrals' ? 'text-copperLight' : 'opacity-50 hover:opacity-100'}`}
>
  Referrals
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

      <main className="p-6">
  {currentView === 'board' && <Board />}
  {currentView === 'search' && <Search userRole={userRole} />}
  {currentView === 'referrals' && <Referrals userRole={userRole} />}
  {currentView === 'leaderboard' && <Leaderboard />}
  {currentView === 'ai' && <AIAssistant />}
  {currentView === 'admin' && userRole === 'admin' && <Admin />}
  {currentView === 'profile' && <Profile />}
</main>
      
    </div>
  );
}