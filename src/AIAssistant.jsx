import { useState } from 'react';

export default function AIAssistant() {
  const [mode, setMode] = useState('resume'); // 'resume' or 'referral'
  const [loading, setLoading] = useState(false);

  // Resume State
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeResult, setResumeResult] = useState(null);

  // Referral State
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [myBackground, setMyBackground] = useState('');
  const [referralResult, setReferralResult] = useState('');

  const handleScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResumeResult(null);

    try {
      const response = await fetch('https://alumni-backend-4hlj.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription })
      });
      const data = await response.json();
      setResumeResult(data);
    } catch (error) {
      alert("Error reaching the AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReferral = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReferralResult('');

    try {
      const response = await fetch('https://alumni-backend-4hlj.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, targetRole, myBackground })
      });
      const data = await response.json();
      setReferralResult(data.message);
    } catch (error) {
      alert("Error reaching the AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>AI Career Assistant</h2>
        <div>
          <button onClick={() => setMode('resume')} style={toggleStyle(mode === 'resume')}>Resume Optimizer</button>
          <button onClick={() => setMode('referral')} style={toggleStyle(mode === 'referral')}>Referral Writer</button>
        </div>
      </div>
      
      {/* MODE 1: RESUME OPTIMIZER */}
      {mode === 'resume' && (
        <form onSubmit={handleScore} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea placeholder="Paste Resume here..." value={resume} onChange={(e) => setResume(e.target.value)} rows="4" required style={{ padding: '10px' }} />
          <textarea placeholder="Paste Job Description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows="4" required style={{ padding: '10px' }} />
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Analyzing...' : 'Analyze Fit & Gaps'}</button>
          
          {resumeResult && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ color: resumeResult.score > 70 ? '#28a745' : '#dc3545' }}>ATS Score: {resumeResult.score}/100</h3>
              
              <h4>Skill Gaps Identified:</h4>
              <ul>{resumeResult.skillGaps?.map((gap, i) => <li key={i}>{gap}</li>)}</ul>
              
              <h4>Missing ATS Keywords:</h4>
              <ul>{resumeResult.keywordsToAdd?.map((kw, i) => <li key={i}>{kw}</li>)}</ul>
              
              <h4>Actionable Suggestions:</h4>
              <ul>{resumeResult.suggestions?.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </div>
          )}
        </form>
      )}

      {/* MODE 2: REFERRAL WRITER */}
      {mode === 'referral' && (
        <form onSubmit={handleReferral} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Target Company (e.g., Google)" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} required style={{ padding: '10px' }} />
          <input type="text" placeholder="Target Role (e.g., SDE Intern)" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} required style={{ padding: '10px' }} />
          <textarea placeholder="Your Background (e.g., ECE student at NIT Jamshedpur, know C++ and Python)" value={myBackground} onChange={(e) => setMyBackground(e.target.value)} rows="3" required style={{ padding: '10px' }} />
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Writing...' : 'Generate Message'}</button>
          
          {referralResult && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
              <h4>Generated Message:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{referralResult}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

const toggleStyle = (isActive) => ({
  padding: '8px 12px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#007bff' : '#e0e0e0',
  color: isActive ? 'white' : 'black',
  border: 'none',
  borderRadius: '4px',
  marginLeft: '10px'
});

const btnStyle = { padding: '12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' };