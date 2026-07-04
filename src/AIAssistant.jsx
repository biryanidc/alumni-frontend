import { useState } from 'react';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [inputText, setInputText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);

 const handleAIRequest = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setOutput(null);

    // 1. Construct the exact prompt based on what the user is doing
    let prompt = "";
    
    if (activeTab === 'optimizer') {
      prompt = `Act as an expert technical recruiter. Analyze this resume. Provide an ATS score out of 100, identify missing keywords, analyze skill gaps, and give 3 bullet points for improvement. Resume: ${inputText}`;
    } else if (activeTab === 'referral') {
      prompt = `Write a professional, concise referral request message for a student to send to an alumnus. Use this context: ${inputText}`;
    } else if (activeTab === 'guidance') {
      prompt = `Provide a structured career roadmap for this role: ${targetRole}. List required technical skills, recommended certifications, and 2 project ideas.`;
    } else if (activeTab === 'matching') {
      prompt = `Based on a target role of ${targetRole}, what specific types of alumni (roles, industries) should a student network with? Be specific and tactical.`;
    }

    try {
      // 2. Send the prompt to your secure Vercel backend
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      // 3. Display the response
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(`[ERROR]: ${data.error}`);
      }
    } catch (error) {
      setOutput("[FATAL ERROR]: Could not establish connection to the AI network.");
    }
    
    setIsProcessing(false);
  };
  return (
    <div className="max-w-6xl mx-auto font-sans text-copper mt-8 flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-1/4 bg-panel border border-copper/20 p-6 shadow-2xl h-fit sticky top-24">
        <h2 className="text-2xl font-serif text-copperLight mb-6 border-b border-copper/10 pb-4">AI Core</h2>
        
        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
          <button 
            onClick={() => { setActiveTab('optimizer'); setOutput(null); }}
            className={`py-3 px-4 text-left border ${activeTab === 'optimizer' ? 'bg-copper text-base font-bold border-copper' : 'bg-base text-copper border-copper/30 hover:bg-copper/10'} transition-colors`}
          >
            Resume Optimizer
          </button>
          <button 
            onClick={() => { setActiveTab('referral'); setOutput(null); }}
            className={`py-3 px-4 text-left border ${activeTab === 'referral' ? 'bg-copper text-base font-bold border-copper' : 'bg-base text-copper border-copper/30 hover:bg-copper/10'} transition-colors`}
          >
            Referral Writer
          </button>
          <button 
            onClick={() => { setActiveTab('guidance'); setOutput(null); }}
            className={`py-3 px-4 text-left border ${activeTab === 'guidance' ? 'bg-copper text-base font-bold border-copper' : 'bg-base text-copper border-copper/30 hover:bg-copper/10'} transition-colors`}
          >
            Career Guidance
          </button>
          <button 
            onClick={() => { setActiveTab('matching'); setOutput(null); }}
            className={`py-3 px-4 text-left border ${activeTab === 'matching' ? 'bg-copper text-base font-bold border-copper' : 'bg-base text-copper border-copper/30 hover:bg-copper/10'} transition-colors`}
          >
            Opportunity Match
          </button>
        </div>
      </div>

      {/* Main Execution Terminal */}
      <div className="w-full lg:w-3/4 bg-panel border border-copper/20 p-8 shadow-2xl">
        
        <div className="mb-8 border-b border-copper/10 pb-6">
          <h3 className="text-3xl font-serif text-copperLight">
            {activeTab === 'optimizer' && 'Resume Analysis & ATS Scoring'}
            {activeTab === 'referral' && 'Smart Connection Messages'}
            {activeTab === 'guidance' && 'Strategic Career Roadmaps'}
            {activeTab === 'matching' && 'Intelligent Network Matching'}
          </h3>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">
            {activeTab === 'optimizer' && 'Scans for keywords, gaps, and improvements.'}
            {activeTab === 'referral' && 'Generates requests and follow-ups.'}
            {activeTab === 'guidance' && 'Provides skill lists and learning resources.'}
            {activeTab === 'matching' && 'Aligns your data with alumni opportunities.'}
          </p>
        </div>

        <form onSubmit={handleAIRequest} className="space-y-6">
          {(activeTab === 'optimizer' || activeTab === 'referral') && (
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Paste Document / Context</label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 bg-base border border-copper/30 p-4 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors resize-none font-sans"
                placeholder={activeTab === 'optimizer' ? "Paste your plain-text resume here..." : "Paste the job description or alumni profile details here..."}
                required
              ></textarea>
            </div>
          )}

          {(activeTab === 'guidance' || activeTab === 'matching') && (
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2 opacity-80">Target Role / Company</label>
              <input 
                type="text" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-base border border-copper/30 p-4 text-copper placeholder-copper/40 outline-none focus:border-copper transition-colors font-sans"
                placeholder="e.g., SDE at Google, Data Scientist..."
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full py-4 bg-copper text-base font-mono uppercase tracking-widest font-bold hover:bg-copperLight transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing Matrix...' : 'Initialize Analysis'}
          </button>
        </form>

        {/* Output Console */}
        {output && (
          <div className="mt-8 p-6 bg-base border border-copper/30">
            <h4 className="font-mono text-xs uppercase tracking-widest text-copperLight mb-4 border-b border-copper/10 pb-2">Analysis Output</h4>
            <div className="font-sans whitespace-pre-wrap opacity-90 leading-relaxed">
              {output}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}