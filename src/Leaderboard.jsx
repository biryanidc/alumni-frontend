import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // Query: Only Alumni, sorted by score, top 10
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'alumni'),
          orderBy('contributionScore', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const topAlumni = [];
        querySnapshot.forEach((doc) => {
          topAlumni.push({ id: doc.id, ...doc.data() });
        });
        setLeaders(topAlumni);
      } catch (error) {
        console.error("Failed to retrieve rankings:", error);
      }
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-copper font-mono text-sm uppercase tracking-widest">
      Calculating Rankings...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto font-sans text-copper mt-8">
      
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Hall of Fame</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Top institutional contributors by impact score</p>
      </div>

      <div className="bg-panel border border-copper/20 shadow-2xl overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-copper/20 bg-base/50 font-mono text-xs uppercase tracking-widest text-copperLight">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Alumnus Identity</div>
          <div className="col-span-4 text-right pr-4">Impact Score</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-copper/10">
          {leaders.map((alumnus, index) => (
            <div key={alumnus.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-copper/5 transition-colors">
              <div className="col-span-2 text-center font-serif text-2xl text-copperLight opacity-80">
                #{index + 1}
              </div>
              <div className="col-span-6">
                <div className="font-bold text-copperLight text-lg">{alumnus.fullName || alumnus.email.split('@')[0]}</div>
                <div className="font-mono text-xs opacity-60 uppercase tracking-widest mt-1">
                  {alumnus.company ? `${alumnus.role} at ${alumnus.company}` : 'Awaiting Assignment'}
                </div>
              </div>
              <div className="col-span-4 text-right pr-4 font-mono text-xl text-copperLight">
                {alumnus.contributionScore || 0} <span className="text-xs opacity-50">PTS</span>
              </div>
            </div>
          ))}

          {leaders.length === 0 && (
            <div className="text-center py-12 font-mono text-sm uppercase tracking-widest opacity-60">
              No contribution data available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}