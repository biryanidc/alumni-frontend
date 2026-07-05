import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, orderBy, query,updateDoc, increment } from 'firebase/firestore';

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postType, setPostType] = useState('Referral');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const initializeBoard = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      const q = query(collection(db, "opportunities"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(fetchedPosts);
      setLoading(false);
    };
    initializeBoard();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (userRole !== 'alumni') return;

    try {
      // 1. Save the opportunity to the board
      await addDoc(collection(db, "opportunities"), {
        postType, company, jobRole, 
        skills: skills.split(',').map(s => s.trim()), 
        deadline, link, 
        authorId: auth.currentUser.uid, authorEmail: auth.currentUser.email, 
        timestamp: new Date()
      });
      
      // 2. Award 10 points to the Alumni's profile score
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        contributionScore: increment(10)
      });

      // 3. Clear the form
      setCompany(''); setJobRole(''); setSkills(''); setDeadline(''); setLink('');
      
      // 4. Refresh the board
      const q = query(collection(db, "opportunities"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const updatedPosts = [];
      querySnapshot.forEach((doc) => {
        updatedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Transmission failed: ", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-copper font-mono text-sm uppercase tracking-widest">
      Retrieving Data Matrix...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto font-sans text-copper mt-8">
      
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Opportunity Board</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Campus Careers & Referrals</p>
      </div>
      
      {/* The Gatekeeper Form */}
      {userRole === 'alumni' && (
        <form onSubmit={handlePost} className="bg-panel border border-copper/20 p-8 mb-10 shadow-2xl">
          <h3 className="font-mono text-sm uppercase tracking-widest text-copperLight mb-6 border-b border-copper/10 pb-2">Inject Opportunity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper appearance-none font-mono text-sm">
              <option value="Referral">Referral</option>
              <option value="Internship">Internship</option>
              <option value="Full-Time">Full-Time</option>
            </select>
            <input type="text" placeholder="Company Name (e.g. Google)" value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input type="text" placeholder="Job Role (e.g., SDE-1)" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors"/>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors font-mono"/>
          </div>

          <input type="text" placeholder="Required Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} required className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors mb-6"/>
          <input type="url" placeholder="Application or Referral Link" value={link} onChange={(e) => setLink(e.target.value)} required className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors mb-8"/>
          
          <button type="submit" className="px-8 py-3 bg-copper text-base font-mono uppercase tracking-widest font-bold hover:bg-copperLight transition-colors">
            Transmit
          </button>
        </form>
      )}

      {/* The Grid Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-panel border border-copper/20 p-8 shadow-lg flex flex-col justify-between hover:border-copper/40 transition-colors">
            
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-copperLight mb-1">{post.jobRole}</h3>
                  <p className="font-mono text-sm opacity-80 uppercase tracking-widest">{post.company}</p>
                </div>
                <span className="bg-base border border-copper/30 px-3 py-1 text-xs font-mono uppercase tracking-widest text-copperLight">
                  {post.postType}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-base border border-copper/10 text-copper px-3 py-1 text-xs font-mono uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-copper/10 pt-6 mt-4">
              <div className="flex justify-between items-center font-mono text-xs opacity-60 mb-6 uppercase tracking-wider">
                <span>By: {post.authorEmail}</span>
                <span>Closes: {post.deadline}</span>
              </div>
              
              <div className="flex gap-4">
                <a href={post.link} target="_blank" rel="noreferrer" className="flex-1 text-center bg-copper text-base py-3 font-mono text-sm uppercase tracking-widest font-bold hover:bg-copperLight transition-colors">
                  Apply
                </a>
               
              </div>
            </div>

          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full text-center py-16 text-copper border border-dashed border-copper/30 font-mono text-sm uppercase tracking-widest opacity-60">
            System empty. Awaiting injections.
          </div>
        )}
      </div>
      
    </div>
  );
}