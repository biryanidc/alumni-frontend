import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Search() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('skills'); // skills, company, jobRole, department

  // 1. Fetch all active alumni profiles
  useEffect(() => {
    const fetchAlumni = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'alumni'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setAlumni(list);
      setFilteredAlumni(list);
    };
    fetchAlumni();
  }, []);

  // 2. The Ranking and Filtering Engine
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredAlumni(alumni);
      return;
    }

    const scored = alumni
      .map(person => {
        let weight = 0;

        // Skill similarity scoring
        const skillMatches = person.skills?.filter(s => s.toLowerCase().includes(term)) || [];
        weight += skillMatches.length * 20;

        // Company/Role exact match scoring
        if (person.company?.toLowerCase().includes(term)) weight += 30;
        if (person.jobRole?.toLowerCase().includes(term)) weight += 30;
        if (person.department?.toLowerCase().includes(term)) weight += 15;

        // Merit-based criteria from specification
        const successRate = person.referralSuccessRate || 0.85; // Default fallback metric
        weight += successRate * 50;

        return { ...person, searchScore: weight };
      })
      // Filter out people with zero query relationship
      .filter(person => {
        if (searchFilter === 'skills') return person.skills?.some(s => s.toLowerCase().includes(term));
        return person[searchFilter]?.toLowerCase().includes(term);
      })
      // Sort descending by highest calculated match score
      .sort((a, b) => b.searchScore - a.searchScore);

    setFilteredAlumni(scored);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Alumni Directory</h2>
      
      {/* Search Bar Matrix */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select 
          value={searchFilter} 
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px' }}
        >
          <option value="skills">Skills</option>
          <option value="company">Company</option>
          <option value="jobRole">Role</option>
          <option value="department">Department</option>
        </select>
        
        <input 
          type="text" 
          placeholder={`Search alumni by ${searchFilter}...`} 
          value={searchTerm} 
          onChange={handleSearch}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Results Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredAlumni.map(person => (
          <div key={person.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', position: 'relative' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{person.jobRole || 'Alumni'}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}><strong>{person.company || 'Unspecified Company'}</strong> — {person.department}</p>
            
            <div style={{ marginBottom: '10px' }}>
              {person.skills?.map((skill, idx) => (
                <span key={idx} style={{ display: 'inline-block', backgroundColor: '#e0e0e0', color: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85em', marginRight: '5px' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85em', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <span>Batch: {person.gradBatch || person.gradYear}</span>
              <span>Email: {person.email}</span>
            </div>

            {searchTerm && (
              <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.8em', backgroundColor: '#d4edda', color: '#155724', padding: '3px 8px', borderRadius: '12px' }}>
                Match: {Math.round(person.searchScore)}
              </span>
            )}
          </div>
        ))}
        {filteredAlumni.length === 0 && <p>No matching alumni discovered.</p>}
      </div>
    </div>
  );
}
