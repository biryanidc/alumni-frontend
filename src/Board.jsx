import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, orderBy, query } from 'firebase/firestore';

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [postType, setPostType] = useState('Referral');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');

  // 1. READ: Fetch user role and all posts
  useEffect(() => {
    const initializeBoard = async () => {
      // Get the current user's role from the database
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }

      // Fetch posts
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

  // 2. WRITE: Submit structured data (Alumni Only)
  const handlePost = async (e) => {
    e.preventDefault();
    if (userRole !== 'alumni') return;

    await addDoc(collection(db, "opportunities"), {
      postType,
      company,
      jobRole,
      skills: skills.split(',').map(s => s.trim()), 
      deadline,
      link,
      authorId: auth.currentUser.uid,
      authorEmail: auth.currentUser.email,
      timestamp: new Date()
    });
    
    // Reset form
    setCompany(''); setJobRole(''); setSkills(''); setDeadline(''); setLink('');
    
    // Refresh board
    const q = query(collection(db, "opportunities"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const updatedPosts = [];
    querySnapshot.forEach((doc) => {
      updatedPosts.push({ id: doc.id, ...doc.data() });
    });
    setPosts(updatedPosts);
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading board...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Opportunity Board</h2>
      
      {/* THE GATEKEEPER: Only render this form if the user is an Alumni */}
      {userRole === 'alumni' && (
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', padding: '15px', backgroundColor: '#f4f4f9', borderRadius: '8px' }}>
          <h3>Post an Opportunity</h3>
          <select value={postType} onChange={(e) => setPostType(e.target.value)} style={{ padding: '8px' }}>
            <option value="Referral">Referral</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time">Full-Time</option>
          </select>
          <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required style={{ padding: '8px' }}/>
          <input type="text" placeholder="Job Role (e.g., SDE-1)" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required style={{ padding: '8px' }}/>
          <input type="text" placeholder="Required Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} required style={{ padding: '8px' }}/>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>Deadline: </label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required style={{ padding: '8px', flexGrow: 1 }}/>
          </div>
          
          <input type="url" placeholder="Application/Referral Link" value={link} onChange={(e) => setLink(e.target.value)} required style={{ padding: '8px' }}/>
          <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px' }}>Post to Board</button>
        </form>
      )}

      {/* READ: The Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>{post.company} - {post.jobRole}</h3>
              <span style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em' }}>{post.postType}</span>
            </div>
            <p><strong>Skills:</strong> {post.skills?.join(', ')}</p>
            <p><strong>Deadline:</strong> {post.deadline}</p>
            <p style={{ fontSize: '0.85em', color: '#666' }}>Posted by: {post.authorEmail}</p>
            <a href={post.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Apply / Request Referral</a>
          </div>
        ))}
        {posts.length === 0 && <p>No opportunities posted yet.</p>}
      </div>
    </div>
  );
}