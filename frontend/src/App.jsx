import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Smartphone, ChevronRight, Scan, UploadCloud, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, loading, complete, error
  const [result, setResult] = useState(null);

  const handleTestDemoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus('loading');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data.analysis);
      setStatus('complete');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="flex items-center space-x-2">
          <Scan className="w-8 h-8 text-cyan-400" />
          {/* BRANDING UPDATED */}
          <span className="text-xl font-bold tracking-widest text-white">NAOL<span className="text-cyan-400">MONITORING</span></span>
        </div>
        <div className="space-x-8 text-sm font-medium">
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Architecture</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </nav>

      <main className="pt-32 px-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Vertex AI Engine Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Eradicate Retail Shrink with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Vision AI.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload footage to test our state-of-the-art computer vision model that tracks cash movement and detects pocket concealment instantly.
          </p>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />

          {/* DYNAMIC UPLOAD BUTTON & RESULTS */}
          {status === 'idle' && (
            <motion.button onClick={handleTestDemoClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-lg font-bold text-lg flex items-center space-x-2 mx-auto transition-all">
              <UploadCloud className="w-5 h-5" />
              <span>Upload Test Footage</span>
            </motion.button>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center text-cyan-400 font-medium">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <span>Processing via Vertex AI...</span>
            </div>
          )}

          {status === 'complete' && result && (
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-md mx-auto text-left shadow-2xl">
              <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2 mb-4 flex justify-between items-center">
                Analysis Complete
                {result.alert_sent ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-emerald-500 w-5 h-5" />}
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">Cash Picked Up:</span> <span className={result.picked_up ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{result.picked_up ? "TRUE" : "FALSE"}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Cash Concealed:</span> <span className={result.concealed ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{result.concealed ? "TRUE" : "FALSE"}</span></p>
                <p className="flex justify-between border-t border-slate-800 pt-3 mt-3"><span className="text-slate-400">Action Taken:</span> 
                  <span className={result.alert_sent ? "text-red-500 font-bold" : "text-slate-500"}>{result.alert_sent ? "Telegram Alert Sent" : "None"}</span>
                </p>
              </div>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-full text-center">Run another test</button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;