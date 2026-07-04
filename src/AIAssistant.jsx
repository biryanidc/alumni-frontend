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
  <div className="max-w-4xl mx-auto mt-8">
    
    {/* Themed Card Container */}
    <div className="bg-panel border border-copper/20 p-8 shadow-2xl">
      
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-copper/20 pb-6 gap-4">
        <h2 className="text-3xl font-serif text-copperLight">AI Career Assistant</h2>
        
        <div className="flex gap-2 font-mono text-xs">
          <button className="px-4 py-2 uppercase tracking-widest transition-colors bg-copper text-base font-bold">
            Resume Optimizer
          </button>
          <button className="px-4 py-2 uppercase tracking-widest transition-colors bg-base text-copper border border-copper/30 hover:bg-copper/10">
            Referral Writer
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <textarea
          className="w-full h-32 bg-base border border-copper/30 p-4 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors resize-none font-sans"
          placeholder="Paste Resume here..."
          // Ensure your value and onChange props remain here
        ></textarea>

        <textarea
          className="w-full h-32 bg-base border border-copper/30 p-4 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors resize-none font-sans"
          placeholder="Paste Job Description here..."
          // Ensure your value and onChange props remain here
        ></textarea>

        {/* Themed Submit Button */}
        <button 
          // Ensure your onClick handler remains here
          className="w-full py-4 bg-copper text-base font-mono uppercase tracking-widest font-bold hover:bg-copperLight transition-colors mt-4"
        >
          Analyze Fit & Gaps
        </button>
      </div>

    </div>
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