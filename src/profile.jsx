import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');

  // READ: Fetch existing data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setDepartment(data.department || '');
        setSkills(data.skills?.join(', ') || '');
        setCompany(data.company || '');
        setJobRole(data.jobRole || '');
        setIndustry(data.industry || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // WRITE: Push updates to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'users', auth.currentUser.uid);
    
    // Base updates for everyone
    const updates = {
      department,
      skills: skills.split(',').map(s => s.trim()), // Convert string to array
      profileCompleted: true
    };
    
    // Add specific data if they are an alumni
    if (userData.role === 'alumni') {
      updates.company = company;
      updates.jobRole = jobRole;
      updates.industry = industry;
    }

    await updateDoc(docRef, updates);
    alert('Profile saved successfully.');
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Complete Your Profile</h2>
      <p>Role: <strong style={{ textTransform: 'capitalize' }}>{userData?.role}</strong></p>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
            type="text" 
            placeholder="Department (e.g., ECE)" 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)} 
            required 
            style={{ padding: '8px' }} 
        />
        <input 
            type="text" 
            placeholder="Skills (comma separated, e.g., C++, Python, Data Structures)" 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            required 
            style={{ padding: '8px' }} 
        />
        
        {userData?.role === 'alumni' && (
          <>
            <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required style={{ padding: '8px' }} />
            <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required style={{ padding: '8px' }} />
            <input type="text" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required style={{ padding: '8px' }} />
          </>
        )}
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save Profile
        </button>
      </form>
    </div>
  );
}