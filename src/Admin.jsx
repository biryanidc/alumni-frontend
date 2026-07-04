import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    alumni: 0,
    opportunities: 0,
    totalPoints: 0,
    placements: 0,
    activeInterviews: 0
  });
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        let studentCount = 0;
        let alumniCount = 0;
        let points = 0;
        let fetchedAlumni = [];

        usersSnap.forEach(document => {
          const data = document.data();
          if (data.role === 'student') studentCount++;
          if (data.role === 'alumni') {
            alumniCount++;
            fetchedAlumni.push({ id: document.id, ...data });
          }
          if (data.contributionScore) points += data.contributionScore;
        });

        const oppsSnap = await getDocs(collection(db, 'opportunities'));

        const refsSnap = await getDocs(collection(db, 'referrals'));
        let offers = 0;
        let interviews = 0;
        refsSnap.forEach(document => {
          const status = document.data().status;
          if (status === 'Offered') offers++;
          if (status === 'Interviewing') interviews++;
        });
        
        setStats({ 
          totalUsers: usersSnap.size, 
          students: studentCount, 
          alumni: alumniCount, 
          opportunities: oppsSnap.size, 
          totalPoints: points,
          placements: offers,
          activeInterviews: interviews
        });
        setAlumniList(fetchedAlumni);
      } catch (error) {
        console.error("Failed to compile analytics:", error);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const handleVerify = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), { isVerified: true });
      setAlumniList(alumniList.map(alumnus => alumnus.id === id ? { ...alumnus, isVerified: true } : alumnus));
    } catch (error) {
      console.error("Verification failed.", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-copper font-mono text-sm uppercase tracking-widest">
      Compiling System Telemetry...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto font-sans text-copper mt-8">
      
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">System Analytics</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Platform Health & Engagement Telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-panel border border-copper/20 p-8 shadow-lg">
          <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Total Nodes</div>
          <div className="text-5xl font-serif text-copperLight mb-4">{stats.totalUsers}</div>
          <div className="flex justify-between border-t border-copper/10 pt-4 font-mono text-xs">
            <span>Students: <span className="text-copperLight">{stats.students}</span></span>
            <span>Alumni: <span className="text-copperLight">{stats.alumni}</span></span>
          </div>
        </div>
        <div className="bg-panel border border-copper/20 p-8 shadow-lg">
          <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Active Opportunities</div>
          <div className="text-5xl font-serif text-copperLight mb-4">{stats.opportunities}</div>
          <div className="border-t border-copper/10 pt-4 font-mono text-xs opacity-60">Jobs, Internships & Referrals</div>
        </div>
        <div className="bg-panel border border-copper/20 p-8 shadow-lg">
          <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Network Engagement</div>
          <div className="text-5xl font-serif text-copperLight mb-4">{stats.totalPoints}</div>
          <div className="border-t border-copper/10 pt-4 font-mono text-xs opacity-60">Total Impact Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-panel border border-green-500/30 p-8 shadow-lg">
          <div className="font-mono text-xs uppercase tracking-widest text-green-500 opacity-80 mb-2">Confirmed Placements</div>
          <div className="text-5xl font-serif text-green-400 mb-4">{stats.placements}</div>
          <div className="border-t border-green-500/20 pt-4 font-mono text-xs text-green-500 opacity-60">Offers secured via network</div>
        </div>
        
        <div className="bg-panel border border-yellow-500/30 p-8 shadow-lg">
          <div className="font-mono text-xs uppercase tracking-widest text-yellow-500 opacity-80 mb-2">Active Pipeline</div>
          <div className="text-5xl font-serif text-yellow-400 mb-4">{stats.activeInterviews}</div>
          <div className="border-t border-yellow-500/20 pt-4 font-mono text-xs text-yellow-500 opacity-60">Students currently interviewing</div>
        </div>
      </div>

      <div className="bg-panel border border-copper/20 p-8 shadow-xl">
         <h3 className="font-mono text-sm uppercase tracking-widest text-copperLight mb-6 border-b border-copper/10 pb-2">Alumni Verification Queue</h3>
         <div className="space-y-4 font-mono text-sm">
            {alumniList.map(alumnus => (
              <div key={alumnus.id} className="flex justify-between items-center p-4 bg-base border border-copper/10">
                <div>
                  <span className="font-bold text-copperLight text-base">{alumnus.fullName || alumnus.email}</span>
                  <span className="opacity-60 ml-4">{alumnus.company ? `${alumnus.role} at ${alumnus.company}` : 'No details'}</span>
                </div>
                {alumnus.isVerified ? (
                  <span className="text-green-500 uppercase tracking-widest text-xs font-bold">Verified ✓</span>
                ) : (
                  <button onClick={() => handleVerify(alumnus.id)} className="px-4 py-2 bg-copper/10 hover:bg-copper hover:text-base border border-copper/30 transition-colors uppercase tracking-widest text-xs">
                    Verify Node
                  </button>
                )}
              </div>
            ))}
            {alumniList.length === 0 && <div className="opacity-60 uppercase tracking-widest text-xs">No alumni records found.</div>}
         </div>
      </div>

    </div>
  );
}