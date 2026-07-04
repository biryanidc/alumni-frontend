import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Referrals({ userRole }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userRole || !auth.currentUser) return;
      
      try {
        const field = userRole === 'student' ? 'studentId' : 'alumniId';
        const q = query(collection(db, 'referrals'), where(field, '==', auth.currentUser.uid));
        
        const snap = await getDocs(q);
        const data = [];
        snap.forEach(d => data.push({ id: d.id, ...d.data() }));
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [userRole]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'referrals', id), { status: newStatus });
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return <div className="text-center font-mono text-xs uppercase opacity-60 mt-10">Syncing Network...</div>;

  return (
    <div className="max-w-4xl mx-auto font-sans text-copper mt-8">
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Referral Network</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Manage your professional connections</p>
      </div>

      <div className="bg-panel border border-copper/20 shadow-xl p-6">
        {requests.length === 0 ? (
          <div className="text-center opacity-60 font-mono text-xs uppercase tracking-widest py-10">No active referral requests.</div>
        ) : (
          <div className="space-y-4 font-mono text-sm">
            {requests.map(req => (
              <div key={req.id} className="flex justify-between items-center p-4 bg-base border border-copper/10">
                <div>
                  <span className="font-bold text-copperLight block mb-1">
                    {userRole === 'student' ? `To: ${req.alumniName}` : `From: ${req.studentName} (${req.studentEmail})`}
                  </span>
                  <span className="opacity-60 text-xs">Timestamp: {req.timestamp?.toDate().toLocaleDateString() || 'Recent'}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`uppercase tracking-widest text-xs font-bold 
                    ${req.status === 'Offered' ? 'text-green-400' : req.status === 'Accepted' ? 'text-green-600' : req.status.includes('Rejected') ? 'text-red-500' : req.status === 'Interviewing' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {req.status}
                  </span>
                  
                  {userRole === 'alumni' && req.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(req.id, 'Accepted')} className="px-3 py-1 bg-green-900/30 text-green-500 hover:bg-green-900/60 border border-green-500/30 transition-colors uppercase tracking-widest text-xs">Accept</button>
                      <button onClick={() => updateStatus(req.id, 'Rejected by Alumnus')} className="px-3 py-1 bg-red-900/30 text-red-500 hover:bg-red-900/60 border border-red-500/30 transition-colors uppercase tracking-widest text-xs">Reject</button>
                    </div>
                  )}

                  {userRole === 'student' && req.status === 'Accepted' && (
                    <div className="flex gap-2 border-l border-copper/20 pl-4">
                      <button onClick={() => updateStatus(req.id, 'Interviewing')} className="px-3 py-1 bg-yellow-900/30 text-yellow-500 hover:bg-yellow-900/60 border border-yellow-500/30 transition-colors uppercase tracking-widest text-xs">Interviewing</button>
                      <button onClick={() => updateStatus(req.id, 'Offered')} className="px-3 py-1 bg-green-900/30 text-green-400 hover:bg-green-900/60 border border-green-400/30 transition-colors uppercase tracking-widest text-xs">Got Offer</button>
                      <button onClick={() => updateStatus(req.id, 'Rejected by Company')} className="px-3 py-1 bg-red-900/30 text-red-500 hover:bg-red-900/60 border border-red-500/30 transition-colors uppercase tracking-widest text-xs">Rejected</button>
                    </div>
                  )}
                  
                  {userRole === 'student' && req.status === 'Interviewing' && (
                    <div className="flex gap-2 border-l border-copper/20 pl-4">
                      <button onClick={() => updateStatus(req.id, 'Offered')} className="px-3 py-1 bg-green-900/30 text-green-400 hover:bg-green-900/60 border border-green-400/30 transition-colors uppercase tracking-widest text-xs">Got Offer</button>
                      <button onClick={() => updateStatus(req.id, 'Rejected by Company')} className="px-3 py-1 bg-red-900/30 text-red-500 hover:bg-red-900/60 border border-red-500/30 transition-colors uppercase tracking-widest text-xs">Rejected</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}