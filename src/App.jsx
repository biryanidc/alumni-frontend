import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './Auth';
import Board from './Board';
import AIAssistant from './AIAssistant';
import Profile from './ProfilePage';
import Search from './Search';
import Admin from './Admin';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('board'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return unsubscribe;
  }, []);

  if (!user) return <Auth />;

  const isAdmin = user?.email === 'admin@nitjsr.ac.in';

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#1a1a1a', color: 'white', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>AlumniConnect</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setCurrentView('board')} style={navButtonStyle(currentView === 'board')}>Opportunities</button>
          <button onClick={() => setCurrentView('search')} style={navButtonStyle(currentView === 'search')}>Explore Alumni</button>
          <button onClick={() => setCurrentView('ai')} style={navButtonStyle(currentView === 'ai')}>AI Assistant</button>
          <button onClick={() => setCurrentView('profile')} style={navButtonStyle(currentView === 'profile')}>Profile</button>
          
          {isAdmin && (
            <button onClick={() => setCurrentView('admin')} style={{...navButtonStyle(currentView === 'admin'), backgroundColor: '#ff9800'}}>Admin Panel</button>
          )}
          
          <button onClick={() => signOut(auth)} style={{ ...navButtonStyle(false), backgroundColor: '#d9534f' }}>Log Out</button>
        </div>
      </nav>
      
      <main style={{ padding: '20px' }}>
        {currentView === 'board' && <Board />}
        {currentView === 'search' && <Search />}
        {currentView === 'ai' && <AIAssistant />}
        {currentView === 'profile' && <Profile />}
        {currentView === 'admin' && isAdmin && <Admin />}
      </main>
    </div>
  );
}

const navButtonStyle = (isActive) => ({
  padding: '8px 12px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#4CAF50' : '#444',
  color: 'white',
  border: 'none',
  borderRadius: '4px'
});

export default App;