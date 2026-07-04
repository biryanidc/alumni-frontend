import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Search({ userRole }) {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      const snap = await getDocs(collection(db, 'users'));
      const data = [];
      snap.forEach(doc => {
        const user = doc.data();
        if (user.role === 'alumni') data.push({ id: doc.id, ...user });
      });
      setAlumni(data);
      setLoading(false);
    };
    fetchAlumni();
  }, []);

  const handleRequest = async (alumnus) => {
    setRequestingId(alumnus.id);
    try {
      await addDoc(collection(db, 'referrals'), {
        alumniId: alumnus.id,
        alumniName: alumnus.fullName || alumnus.email,
        studentId: auth.currentUser.uid,
        studentEmail: auth.currentUser.email,
        studentName: auth.currentUser.email.split('@')[0],
        status: 'Pending',
        timestamp: new Date()
      });
      alert("Referral request transmitted.");
    } catch (error) {
      console.error("Transmission failed", error);
    }
    setRequestingId(null);
  };

  if (loading) return <div className="text-center font-mono text-xs uppercase opacity-60 mt-10">Scanning Directory...</div>;

  return (
    <div className="max-w-6xl mx-auto font-sans text-copper mt-8">
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Alumni Directory</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Search and connect with institutional nodes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map(user => (
          <div key={user.id} className="bg-panel border border-copper/20 p-6 shadow-lg hover:border-copper/50 transition-colors">
            <h3 className="text-xl font-serif text-copperLight mb-1 flex items-center gap-2">
              {user.fullName || "Unknown Node"}
              {user.isVerified && (
                <span title="Verified Alumnus" className="text-green-500 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </span>
              )}
            </h3>
            <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">
              {user.company ? `${user.role} at ${user.company}` : 'Awaiting Assignment'}
            </div>
            
            {/* The Request Gateway */}
            {userRole === 'student' && (
              <button 
                onClick={() => handleRequest(user)}
                disabled={requestingId === user.id}
                className="w-full py-2 bg-copper/10 hover:bg-copper hover:text-base border border-copper/30 transition-colors uppercase tracking-widest text-xs font-bold"
              >
                {requestingId === user.id ? 'Transmitting...' : 'Request Referral'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}