import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  // Updated state with skills and projects
  const [profile, setProfile] = useState({
    fullName: '',
    batchYear: '',
    branch: '',
    company: '',
    role: '',
    linkedin: '',
    bio: '',
    skills: '',
    projects: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), profile, { merge: true });
      console.log('Identity updated.'); 
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-copper font-mono text-sm uppercase tracking-widest">
      Loading Identity...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto font-sans text-copper mt-8">
      
      <div className="mb-10 border-b border-copper/20 pb-6">
        <h2 className="text-4xl font-serif text-copperLight">Node Identity</h2>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">Manage your institutional profile</p>
      </div>

      <form onSubmit={handleSave} className="bg-panel border border-copper/20 p-8 shadow-2xl">
        <h3 className="font-mono text-sm uppercase tracking-widest text-copperLight mb-6 border-b border-copper/10 pb-2">Core Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Full Name</label>
            <input type="text" name="fullName" value={profile.fullName || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Batch Year</label>
            <input type="text" name="batchYear" value={profile.batchYear || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Branch / Department</label>
            <input type="text" name="branch" value={profile.branch || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">LinkedIn URL</label>
            <input type="url" name="linkedin" value={profile.linkedin || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
        </div>

        <h3 className="font-mono text-sm uppercase tracking-widest text-copperLight mb-6 mt-10 border-b border-copper/10 pb-2">Professional Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Current Company</label>
            <input type="text" name="company" value={profile.company || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Job Role</label>
            <input type="text" name="role" value={profile.role || ''} onChange={handleChange} className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors"/>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Bio</label>
          <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows="3" className="w-full bg-base border border-copper/30 p-3 text-copper outline-none focus:border-copper transition-colors resize-none font-sans"></textarea>
        </div>

        <h3 className="font-mono text-sm uppercase tracking-widest text-copperLight mb-6 mt-10 border-b border-copper/10 pb-2">Technical Portfolio</h3>

        <div className="mb-6">
          <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Skills (Comma Separated)</label>
          <input type="text" name="skills" value={profile.skills || ''} onChange={handleChange} placeholder="e.g., Python, React, C++" className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/30 outline-none focus:border-copper transition-colors"/>
        </div>

        <div className="mb-8">
          <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Projects (Links or Descriptions)</label>
          <textarea name="projects" value={profile.projects || ''} onChange={handleChange} rows="3" placeholder="List your key projects here..." className="w-full bg-base border border-copper/30 p-3 text-copper placeholder-copper/30 outline-none focus:border-copper transition-colors resize-none font-sans"></textarea>
        </div>

        <button type="submit" disabled={saving} className="px-8 py-3 bg-copper text-base font-mono uppercase tracking-widest font-bold hover:bg-copperLight transition-colors disabled:opacity-50">
          {saving ? 'Updating...' : 'Save Identity'}
        </button>
      </form>
    </div>
  );
}