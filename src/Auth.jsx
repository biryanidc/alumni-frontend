import { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradYear, setGradYear] = useState('');

  const isCollegeEmail = (email) => {
    return email.endsWith('@college.edu') || email.endsWith('.ac.in'); 
  };

  const handleAuth = async (e) => {
    e.preventDefault(); 
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Please check your spam/inbox and verify your email before logging in.");
          return;
        }
        alert("Logged in successfully.");
      } else {
        if (!isCollegeEmail(email)) {
          alert("You must use an official college email ID.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await sendEmailVerification(user);
        
        const currentYear = new Date().getFullYear();
        const userRole = parseInt(gradYear) > currentYear ? 'student' : 'alumni';

        // Save only the essentials
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: userRole,
          gradYear: parseInt(gradYear),
          points: 0,
          profileCompleted: false
        });

        alert(`Account created! Check spam/inbox for verification link.`);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Log In' : 'Register'}</h2>
      
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="email" placeholder="College Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {!isLogin && (
          <input type="number" placeholder="Graduation Year" value={gradYear} onChange={(e) => setGradYear(e.target.value)} required />
        )}

        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#646cff', cursor: 'pointer' }}>
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}