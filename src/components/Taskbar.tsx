import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal as TerminalIcon, Monitor, Cpu, Radio, Moon, Sun, MonitorPlay } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const Taskbar = ({ 
  soundEnabled, 
  setSoundEnabled,
  ambientEnabled,
  setAmbientEnabled,
  currentTheme,
  setCurrentTheme,
  themes,
  onOpenTerminal
}: {
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  ambientEnabled: boolean;
  setAmbientEnabled: (v: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (t: string) => void;
  themes: string[];
  onOpenTerminal: () => void;
}) => {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(45);
  const { playHover } = useSound(soundEnabled);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuate CPU/RAM
  useEffect(() => {
    const sysTimer = setInterval(() => {
      setCpu(prev => Math.max(5, Math.min(95, prev + (Math.random() * 20 - 10))));
      setRam(prev => Math.max(20, Math.min(85, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(sysTimer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-4 pointer-events-none">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 glass-panel pointer-events-auto bg-[#0a0a0a]/80 border-[#333]/50 shadow-2xl px-6 py-3 rounded-xl backdrop-blur-xl">
        
        {/* Left Side: System Metrics */}
        <div className="flex items-center gap-6 font-mono text-xs text-gray-400">
          <div className="flex items-center gap-2 group cursor-help">
            <Cpu size={14} className="text-pink-500 group-hover:text-pink-400 transition-colors" />
            <div className="w-16 bg-[#222] h-1.5 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full transition-all duration-1000" style={{ width: `${cpu}%` }} />
            </div>
            <span className="w-8 text-right">{cpu.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2 group cursor-help">
            <Monitor size={14} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="w-16 bg-[#222] h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-1000" style={{ width: `${ram}%` }} />
            </div>
            <span className="w-8 text-right">{ram.toFixed(0)}%</span>
          </div>
        </div>

        {/* Center spacing */}
        <div className="flex items-center gap-4 flex-1">
        </div>

        {/* Right Side: Toggles & Clock */}
        <div className="flex items-center gap-6 font-mono text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled && playHover) setTimeout(() => playHover(), 50);
              }}
              className="interactive hover:text-white flex items-center gap-1"
              title="Toggle SFX"
            >
              {soundEnabled ? <Volume2 size={14} className="text-[#00ff41]" /> : <VolumeX size={14} className="text-red-400" />} 
            </button>

            <button 
              onClick={() => {
                setAmbientEnabled(!ambientEnabled);
                if (playHover) playHover();
              }}
              className="interactive hover:text-white flex items-center gap-1"
              title="Toggle Ambient Audio"
            >
              <Radio size={14} className={ambientEnabled ? "text-purple-500 animate-pulse" : "text-gray-500"} />
            </button>

            <button 
              onClick={() => {
                const next = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
                setCurrentTheme(next);
                if (playHover) playHover();
              }}
              className="interactive hover:text-white flex items-center gap-1"
              title="Cycle Theme"
            >
              {currentTheme === 'GHOST_WHITE' ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-blue-400" />}
              <span className="hidden sm:inline ml-1 w-24 text-left truncate">{currentTheme}</span>
            </button>
          </div>
          
          <div className="text-white border-l border-[#333] pl-6 py-1">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

      </div>
    </div>
  );
};
