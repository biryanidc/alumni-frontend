import { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role,
          createdAt: new Date()
        });
      }
    } catch (err) {
      if (isLogin) {
        if (err.code === 'auth/user-not-found') {
          setError('Access Denied: Register with official college ID first.');
        } else if (err.code === 'auth/wrong-password') {
          setError('Access Denied: Incorrect password.');
        } else if (err.code === 'auth/invalid-credential') {
          // Fallback if Firebase ignores our request
          setError('Access Denied: Invalid credentials or unregistered email.');
        } else {
          setError(err.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base text-copper flex items-center justify-center p-6 selection:bg-copper selection:text-base">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-panel border border-copper/20 p-10 md:p-14 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-serif text-copperLight mb-2">{isLogin ? 'Access Portal' : 'Establish Identity'}</h2>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            {isLogin ? 'Enter your credentials' : 'Register a new node'}
          </p>
        </div>

        {error && <div className="mb-6 p-4 border border-red-900 bg-red-950 text-red-400 text-sm font-mono">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-6 text-lg">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-base border border-copper/30 p-4 text-copper outline-none focus:border-copper transition-colors"
            />
          </div>
          
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-base border border-copper/30 p-4 text-copper outline-none focus:border-copper transition-colors"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Clearance Level</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="w-full bg-base border border-copper/30 p-4 text-copper outline-none focus:border-copper appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-4 bg-copper text-base font-mono uppercase tracking-widest font-bold hover:bg-copperLight transition-colors mt-4">
            {isLogin ? 'Initialize Session' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-copper/10 pt-6">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm font-mono opacity-70 hover:opacity-100 transition-opacity"
          >
            {isLogin ? 'Request access (Register)' : 'Return to login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}