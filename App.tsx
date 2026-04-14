
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppView, SecurityMode, Coordinate, SecurityLog, HackerEntry } from './types';
import Keyboard from './components/Keyboard';
import SecurityLogs from './components/SecurityLogs';
import HackerPanel from './components/HackerPanel';
import Dashboard from './components/Dashboard';
import { securityService } from './services/securityService';

const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dim = size === "lg" ? "w-40 h-40" : size === "md" ? "w-20 h-20" : "w-10 h-10";
  return (
    <div className={`${dim} mx-auto relative group`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4A484" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        <rect x="10" y="25" width="80" height="55" rx="20" fill="url(#logoGrad)" />
        <rect x="25" y="40" width="50" height="25" rx="8" fill="white" fillOpacity="0.1" />
        <path d="M40 52.5h20M50 42.5v20" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <circle cx="82" cy="52.5" r="7" fill="#C4A484" />
      </svg>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [mode, setMode] = useState<SecurityMode>(SecurityMode.PROTECTED);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("researcher_01@sec.corp");
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [hackerLogs, setHackerLogs] = useState<HackerEntry[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructedPass, setReconstructedPass] = useState("");
  const [lastCoord, setLastCoord] = useState<Coordinate | null>(null);
  
  const hackerPanelRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: SecurityLog['type'] = 'info') => {
    const newLog: SecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  const spawnPacket = (start: Coordinate) => {
    if (!hackerPanelRef.current) return;
    
    const packet = document.createElement('div');
    packet.className = 'data-packet';
    packet.style.left = `${start.x}px`;
    packet.style.top = `${start.y}px`;
    document.body.appendChild(packet);

    const rect = hackerPanelRef.current.getBoundingClientRect();
    const destX = rect.left + rect.width / 2;
    const destY = rect.top + 100;

    packet.animate([
      { left: `${start.x}px`, top: `${start.y}px`, opacity: 1, transform: 'scale(2)' },
      { left: `${destX}px`, top: `${destY}px`, opacity: 0, transform: 'scale(0.1)' }
    ], {
      duration: 450,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
    }).onfinish = () => packet.remove();
  };

  const addHackerLog = (coord: Coordinate, char?: string) => {
    const newEntry: HackerEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      x: Math.round(coord.x),
      y: Math.round(coord.y),
      actualKey: char
    };
    setHackerLogs(prev => [...prev.slice(-19), newEntry]);
  };

  useEffect(() => {
    if (view === AppView.LOGIN) {
      addLog(`Security Protocol Initialized: ${mode}`, mode === SecurityMode.PROTECTED ? "success" : "warning");
      setHackerLogs([]);
      setReconstructedPass("");
      setPassword("");
    }
  }, [view, mode]);

  const handleCoordinateClick = useCallback((coord: Coordinate, char: string) => {
    setLastCoord(coord);
    spawnPacket(coord);
    
    addHackerLog(coord, mode === SecurityMode.VULNERABLE ? char : undefined);
    addLog(`Intercepted Pulse at ${Math.round(coord.x)}, ${Math.round(coord.y)}`, "info");

    const normalizedChar = char.trim().toUpperCase();
    if (normalizedChar === 'BKSP' || normalizedChar === 'DEL') {
      setPassword(prev => prev.slice(0, -1));
    } else if (normalizedChar === 'SPACE') {
      setPassword(prev => prev + " ");
    } else if (normalizedChar === 'ENTER') {
      handleLogin();
    } else if (normalizedChar.length === 1) {
      setPassword(prev => prev + char);
    }

    if (mode === SecurityMode.PROTECTED) {
      setShuffleKey(prev => prev + 1);
      addLog("Scrambler Cycle: Coordinate mapping re-randomized.", "success");
    }
  }, [mode]);

  const handleAttackSimulation = () => {
    setIsReconstructing(true);
    addLog("Adversary Engine: Running pattern correlation...", "danger");
    
    setTimeout(() => {
      setIsReconstructing(false);
      if (mode === SecurityMode.VULNERABLE) {
        setReconstructedPass(password);
        addLog("Pattern Correlation: SUCCESS. Sequence decoded.", "danger");
      } else {
        const junk = Array(password.length).fill(0).map(() => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random()*36)]).join('');
        setReconstructedPass(junk);
        addLog("Pattern Correlation: FAILED. Coordinate noise too high.", "success");
      }
    }, 1200);
  };

  const handleLogin = () => {
    if (password.length === 0) return;
    addLog("Validating token sequence...", "success");
    setTimeout(() => setView(AppView.DASHBOARD), 800);
  };

  if (view === AppView.LANDING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-[#FDFBF7]">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="animate-float mb-12">
            <Logo size="lg" />
          </div>
          <h1 className="text-7xl font-heading font-black mb-4 text-[#1E293B] tracking-tight">ScramblerKey</h1>
          <p className="text-2xl text-[#C4A484] mb-20 font-medium max-w-2xl leading-relaxed">
            Advanced Side-Channel Attack Mitigation Demo. <br/>
            Protecting coordinate-based input through non-deterministic randomization.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
            <button 
              onClick={() => { setMode(SecurityMode.PROTECTED); setView(AppView.LOGIN); }}
              className="flex-1 py-6 bg-[#C4A484] text-white font-black rounded-3xl shadow-2xl hover:scale-105 transition-all text-xl tracking-[0.2em] uppercase"
            >
              Secure Mode
            </button>
            <button 
              onClick={() => { setMode(SecurityMode.VULNERABLE); setView(AppView.LOGIN); }}
              className="flex-1 py-6 bg-white text-slate-800 border-4 border-slate-800 font-black rounded-3xl hover:bg-slate-50 transition-all text-xl tracking-[0.2em] uppercase"
            >
              Standard Mode
            </button>
          </div>
        </div>
        
        <div className="text-sm text-slate-300 font-black uppercase tracking-[0.5em] flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          Research Project Interface v3.0
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (view === AppView.DASHBOARD) {
    return <Dashboard mode={mode} passwordLength={password.length} onLogout={() => setView(AppView.LANDING)} />;
  }

  const entropy = securityService.calculateEntropy(password, mode);

  return (
    <div className="min-h-screen flex flex-col xl:flex-row bg-[#FDFBF7]">
      {/* GLOBAL HUD */}
      <div className="fixed top-0 w-full h-20 flex items-center justify-between px-12 z-50 bg-white border-b border-slate-100 shadow-xl">
        <div className="flex items-center gap-6">
          <button onClick={() => setView(AppView.LANDING)} className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Research Monitor</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${mode === SecurityMode.PROTECTED ? 'bg-[#C4A484]' : 'bg-red-500 animate-pulse'}`}></div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${mode === SecurityMode.PROTECTED ? 'text-[#C4A484]' : 'text-red-600'}`}>
                {mode} ACTIVE
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Signal Telemetry</span>
             <span className="text-[12px] font-mono text-slate-500 font-bold bg-slate-50 px-4 py-1 rounded-full border border-slate-100">
               {lastCoord ? `X: ${Math.round(lastCoord.x)}px | Y: ${Math.round(lastCoord.y)}px` : 'WAITING FOR PULSE...'}
             </span>
          </div>
          <button 
            onClick={() => setMode(mode === SecurityMode.PROTECTED ? SecurityMode.VULNERABLE : SecurityMode.PROTECTED)}
            className="text-[11px] font-black text-[#C4A484] border-2 border-[#C4A484] px-8 py-3 rounded-full hover:bg-[#C4A484] hover:text-white transition-all uppercase tracking-[0.3em] shadow-lg"
          >
            Switch Protocol
          </button>
        </div>
      </div>

      {/* USER SIDE - AUTHENTICATION TERMINAL */}
      <div className="flex-1 pt-32 pb-16 px-10 flex flex-col items-center overflow-y-auto border-r-2 border-slate-50">
        <div className="w-full max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-heading font-black text-slate-800 tracking-tight">User Input Interface</h2>
            <p className="text-slate-400 text-lg font-medium">Standard QWERTY layout maintained for usability. Coordinate randomization active.</p>
          </div>

          <div className="soft-card p-12 space-y-12 bg-white/50 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Session ID / Identity</label>
                <div className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-800 font-black text-2xl shadow-inner">
                  {email}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Masked Coordinate Sequence</label>
                <div className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl flex items-center gap-6 min-h-[76px] shadow-inner overflow-hidden">
                   {password.split('').map((_, i) => (
                     <div key={i} className={`w-4 h-4 rounded-full flex-shrink-0 transition-all ${mode === SecurityMode.PROTECTED ? 'bg-[#C4A484] shadow-[0_0_10px_#C4A484]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`}></div>
                   ))}
                   {password.length === 0 && <span className="text-slate-300 italic text-base font-medium animate-pulse">Touch keyboard to transmit coordinate tokens...</span>}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4">
               <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">Side-Channel Entropy Level</span>
               <div className="flex gap-3">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-14 h-2 rounded-full transition-all duration-1000 ${i < (entropy.score/20) ? (mode === SecurityMode.PROTECTED ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-400') : 'bg-slate-100'}`}></div>
                 ))}
               </div>
            </div>

            <Keyboard onCoordinateClick={handleCoordinateClick} shouldShuffle={shuffleKey} mode={mode} />

            <div className="flex flex-col gap-6 pt-6">
              <button onClick={handleLogin} disabled={password.length === 0} className="w-full py-6 bg-slate-800 text-white font-black rounded-3xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95 disabled:opacity-20 text-2xl uppercase tracking-[0.4em]">
                Secure Authenticate
              </button>
              <div className="flex justify-between px-4">
                 <button onClick={() => setPassword("")} className="text-[12px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">Clear Token History</button>
                 <span className="text-[11px] font-bold text-slate-300 italic uppercase">Demo Reality: No text storage on client</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADVERSARY SIDE - INTERCEPT TERMINAL */}
      <div 
        ref={hackerPanelRef}
        className="xl:w-[600px] p-10 xl:p-14 bg-[#F8F9FA] border-l-2 border-slate-100 flex flex-col gap-12 overflow-y-auto"
      >
        <div className="pt-24 xl:pt-10">
          <SecurityLogs logs={logs} />
        </div>
        <div className="flex-1 min-h-[550px]">
          <HackerPanel entries={hackerLogs} mode={mode} reconstructed={reconstructedPass} isReconstructing={isReconstructing} onSimulate={handleAttackSimulation} isPasswordEmpty={password.length === 0} />
        </div>
        
        <div className="soft-card p-12 bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Logo size="lg" />
          </div>
          <h4 className="text-[12px] font-black uppercase text-[#C4A484] mb-6 tracking-[0.5em]">Project Security Core</h4>
          <p className="text-[13px] leading-relaxed font-medium text-slate-400">
            {mode === SecurityMode.PROTECTED 
              ? "The coordinate tokens are cryptographically decoupled from the UI symbols. Every interaction triggers a Scrambler Cycle, ensuring that capturing the same visual location twice never results in the same character token."
              : "Security Breach Confirmed: The keyboard grid is static. An observer can globally correlate mouse coordinates to specific characters, allowing for trivial geometric reconstruction of user secrets."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
