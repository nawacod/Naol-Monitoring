import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, UploadCloud, Loader2, AlertTriangle, CheckCircle, Mail, Info } from 'lucide-react';

const LandingPage = () => {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle');
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
      
      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();
      setResult(data.analysis);
      setStatus('complete');
      
    } catch (error) {
      console.warn("Backend offline: Falling back to Portfolio Demo Mode");
      setTimeout(() => {
        setResult({
          picked_up: true,
          concealed: true,
          alert_sent: true,
          is_demo: true 
        });
        setStatus('complete');
      }, 3500); 
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-100 overflow-x-hidden relative">
      
      {/* BACKGROUND ANIMATION: Revolving Colorful Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-cyan-300 via-blue-200 to-purple-300 rounded-full blur-[120px] opacity-40 origin-bottom-right" 
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[20%] w-[700px] h-[700px] bg-gradient-to-bl from-emerald-200 via-cyan-200 to-blue-300 rounded-full blur-[150px] opacity-30 origin-top-left" 
        />
      </div>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white/70 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <Scan className="w-8 h-8 text-cyan-600" />
          <span className="text-xl font-bold tracking-widest text-slate-900">NAOL<span className="text-cyan-600">MONITORING</span></span>
        </div>
        <div className="space-x-8 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-cyan-600 transition-colors">About</a>
          <a href="#contact" className="hover:text-cyan-600 transition-colors">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-40 pb-20 px-8 flex flex-col items-center justify-center min-h-[90vh] relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Vertex AI Engine Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Eradicate Retail Shrink with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Vision AI.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload footage to test our state-of-the-art computer vision model that tracks cash movement and detects pocket concealment instantly.
          </p>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />

          {status === 'idle' && (
            <motion.button onClick={handleTestDemoClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-2 mx-auto transition-all shadow-xl shadow-slate-900/20">
              <UploadCloud className="w-5 h-5" />
              <span>Upload Test Footage</span>
            </motion.button>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center text-cyan-600 font-bold">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <span>Processing via Vertex AI...</span>
            </div>
          )}

          {status === 'complete' && result && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md mx-auto text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
              <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                Analysis Complete
                {result.alert_sent ? <AlertTriangle className="text-red-500 w-6 h-6" /> : <CheckCircle className="text-emerald-500 w-6 h-6" />}
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <p className="flex justify-between"><span className="text-slate-500">Cash Picked Up:</span> <span className={result.picked_up ? "text-red-600 font-bold bg-red-50 px-2 rounded" : "text-emerald-600 font-bold bg-emerald-50 px-2 rounded"}>{result.picked_up ? "TRUE" : "FALSE"}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Cash Concealed:</span> <span className={result.concealed ? "text-red-600 font-bold bg-red-50 px-2 rounded" : "text-emerald-600 font-bold bg-emerald-50 px-2 rounded"}>{result.concealed ? "TRUE" : "FALSE"}</span></p>
                
                <p className="flex justify-between border-t border-slate-100 pt-4 mt-2">
                  <span className="text-slate-500">Action Taken:</span> 
                  <span className={result.alert_sent ? "text-red-600 font-bold" : "text-slate-500"}>
                    {result.alert_sent ? "Telegram Alert Sent" : "None"}
                  </span>
                </p>

                {result.is_demo && (
                  <p className="text-xs text-amber-600 text-center pt-2 italic font-semibold">
                    * Displaying simulated data for portfolio demonstration
                  </p>
                )}
              </div>
              <button onClick={() => setStatus('idle')} className="mt-8 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors w-full text-center bg-cyan-50 py-2 rounded-lg">Run another test</button>
            </div>
          )}
        </motion.div>
      </main>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-8 relative z-10 bg-white/50 backdrop-blur-sm border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Info className="w-8 h-8 text-cyan-500" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">About The Pipeline</h2>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-lg text-slate-600 leading-relaxed space-y-6">
            <p>
              I built Naol Monitoring to solve a massive problem in retail security: backdoor shrink and point-of-sale cash theft. Traditional security cameras only provide forensic evidence <em>after</em> the money is already gone. 
            </p>
            <p>
              This system intercepts the theft in real-time. By linking an <strong>OpenCV</strong> motion-tracking script with <strong>Google Cloud Vertex AI</strong>, the pipeline automatically scrubs idle footage and evaluates targeted hand trajectories.
            </p>
            <p>
              If the AI determines that cash was picked up and concealed in a pocket or waistband, a Python backend instantly triggers a Telegram bot payload, pushing the video evidence directly to management's mobile devices before the bad actor even leaves the building.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-8 relative z-10 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold mb-6">Let's Connect</h2>
          <p className="text-slate-400 text-lg mb-10">
            Interested in deploying this architecture, or want to talk about full-stack software development? Reach out directly via email.
          </p>
          <a href="mailto:nawashimee@gmail.com" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xl px-10 py-5 rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
            nawashimee@gmail.com
          </a>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;