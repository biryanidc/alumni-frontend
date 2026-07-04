import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Fetch all users
    const userSnap = await getDocs(collection(db, 'users'));
    const userList = [];
    userSnap.forEach(d => userList.push({ id: d.id, ...d.data() }));
    setUsers(userList);

    // Fetch all posts
    const postSnap = await getDocs(collection(db, 'opportunities'));
    const postList = [];
    postSnap.forEach(d => postList.push({ id: d.id, ...d.data() }));
    setPosts(postList);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async (id) => {
    await deleteDoc(doc(db, 'opportunities', id));
    fetchData(); // Refresh table
  };

  if (loading) return <p>Loading Admin Dashboard...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Administrator Dashboard</h2>
      
      <h3>Platform Activity: Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Grad Year</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textTransform: 'capitalize' }}>{u.role}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.gradYear || u.gradBatch}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Platform Activity: Opportunities</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Company</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Author</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.company}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.jobRole}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.authorEmail}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button onClick={() => handleDeletePost(p.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}