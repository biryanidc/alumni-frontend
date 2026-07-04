import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Search() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching network:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      (user.fullName && user.fullName.toLowerCase().includes(term)) ||
      (user.company && user.company.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term)) ||
      (user.branch && user.branch.toLowerCase().includes(term))
    );
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-copper font-mono text-sm uppercase tracking-widest">
      Indexing Directory...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto font-sans text-copper mt-8">
      
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Network Matrix</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Query the alumni and student directory</p>
      </div>

      {/* Search Input Console */}
      <div className="mb-10">
        <input 
          type="text" 
          placeholder="Query by name, company, role, or branch..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-panel border border-copper/30 p-5 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors font-mono text-sm shadow-xl"
        />
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-panel border border-copper/20 p-6 shadow-lg flex flex-col justify-between hover:border-copper/40 transition-colors">
            
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-copper/10 pb-4">
                <h3 className="text-2xl font-serif text-copperLight truncate pr-4">
                  {user.fullName || 'Unknown Node'}
                </h3>
                <span className="bg-base border border-copper/30 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-copperLight">
                  {user.role === 'alumni' ? 'ALUMNI' : 'STUDENT'}
                </span>
              </div>
              
              <div className="font-mono text-xs opacity-80 uppercase tracking-widest mb-6 space-y-2">
                <p><span className="opacity-50">ORG:</span> {user.company || 'UNASSIGNED'}</p>
                <p><span className="opacity-50">POS:</span> {user.role || 'UNASSIGNED'}</p>
                <p><span className="opacity-50">DIV:</span> {user.branch || 'UNKNOWN'} {user.batchYear ? `[${user.batchYear}]` : ''}</p>
              </div>
            </div>

            <div className="pt-2">
              {user.linkedin ? (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="block w-full text-center bg-base text-copper border border-copper/30 py-3 font-mono text-xs uppercase tracking-widest hover:bg-copper/10 transition-colors">
                  Establish Link
                </a>
              ) : (
                <button disabled className="w-full text-center bg-base/30 text-copper/30 border border-copper/10 py-3 font-mono text-xs uppercase tracking-widest cursor-not-allowed">
                  No Link Provided
                </button>
              )}
            </div>

          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-16 text-copper border border-dashed border-copper/30 font-mono text-sm uppercase tracking-widest opacity-60">
            No matching nodes found in the matrix.
          </div>
        )}
      </div>

    </div>
  );
}