import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize, Minus, Volume2, VolumeX, ArrowRight, Github, Linkedin, Mail, ExternalLink, Code2, Menu, Instagram, Twitter, Download, Gamepad2 } from 'lucide-react';
import { useSound } from './hooks/useSound';
import { MatrixRain } from './components/MatrixRain';
import { GithubStats } from './components/GithubStats';
import { SnakeGame } from './components/SnakeGame';
import { PongGame } from './components/PongGame';
import { FlappyBird } from './components/FlappyBird';
import { SpaceShooter } from './components/SpaceShooter';
import { Scene3D } from './components/Scene3D';
import { Taskbar } from './components/Taskbar';
import { GitHubCalendar as NamedGitHubCalendar } from 'react-github-calendar';
const Calendar = NamedGitHubCalendar as any;

interface Project {
  id: string;
  name: string;
  category: string;
  tech: string;
  desc: string;
  year: string;
  status: string;
  longDesc: string;
  problem: string;
  solution: string;
  color: string;
  github?: string;
  live?: string;
  images?: string[];
}

interface HistoryEntry {
  type: string;
  text: string;
  color?: string;
}

import { portfolioConfig } from './config';

const PROJECTS = portfolioConfig.projects;
const SKILLS = portfolioConfig.skills;
const BOOT_LINES = portfolioConfig.bootLines;

const SnakeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="10" width="4" height="4" />
    <rect x="6" y="10" width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
    <rect x="10" y="6" width="4" height="4" />
    <rect x="14" y="6" width="4" height="4" />
    <rect x="18" y="6" width="4" height="4" />
  </svg>
);

const PongIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="3" height="12" />
    <rect x="19" y="6" width="3" height="12" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FlappyIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 14v6h16v-6" stroke="#00ff41"/>
    <circle cx="8" cy="10" r="3" fill="#facc15" stroke="none" />
    <rect x="11" y="9" width="4" height="2" fill="#facc15" stroke="none" />
  </svg>
);

const ShooterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3l-8 16h16z" fill="#22d3ee" />
    <circle cx="12" cy="13" r="2" fill="#050505" />
  </svg>
);

const GlobalStyles = () => (
  <style>{`
    :root {
      --bg-color: #030303;
      --text-main: #e4e4e7;
      --text-muted: #71717a;
      --accent: #10b981;
    }
    
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      overflow-x: hidden;
    }

    @media (pointer: fine) {
      body { cursor: none; }
      .interactive { cursor: none; }
    }

    ::selection {
      background: var(--accent);
      color: #000;
    }

    .crt-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 9999;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      opacity: 0.15;
    }

    .noise-bg {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .interactive {
      transition: color 0.2s ease;
    }
      
    .matrix-mode .crt-overlay {
      background: linear-gradient(rgba(0, 255, 65, 0.05) 50%, rgba(0, 0, 0, 0.25) 50%);
      background-size: 100% 2px;
      opacity: 0.3;
    }

    .ghost-mode {
      animation: glitch-anim 0.2s linear infinite;
      filter: hue-rotate(180deg) invert(100%);
    }

    @keyframes glitch-anim {
      0% { transform: translate(0) }
      20% { transform: translate(-5px, 5px) }
      40% { transform: translate(-5px, -5px) }
      60% { transform: translate(5px, 5px) }
      80% { transform: translate(5px, -5px) }
      100% { transform: translate(0) }
    }

    /* --- THEME SYSTEM OVERRIDES --- */
    :root {
      /* Base default (NEON_CYBER) */
      --bg: #000000;
      --text-main: #ffffff;
      --text-muted: #888888;
      --c-1: #00ff88; /* emerald */
      --c-2: #00e5ff; /* electric cyan */
      --c-3: #facc15; /* neon yellow */
      --c-4: #c084fc; /* purple */
      --c-success: #00ff41; 
      --border: #333333;
      --bg-panel: #0a0a0a;
      --bg-black: #000000;
      --glass-bg: rgba(0, 0, 0, 0.6);
      --glass-border: rgba(0, 255, 65, 0.2);
    }

    body[data-theme="MIDNIGHT_GOLD"] {
      --bg: #0a0a0c; --text-main: #f9f9f9; --text-muted: #a19d94;
      --c-1: #d4af37; /* metallic gold */
      --c-2: #e5c158; /* bright gold */
      --c-3: #c5a017; /* dark gold */
      --c-4: #8c7322; /* muted gold */
      --c-success: #d4af37;
      --border: #2a2822; --bg-panel: #121214; --bg-black: #0a0a0c;
      --glass-bg: rgba(18, 18, 20, 0.7);
      --glass-border: rgba(212, 175, 55, 0.15);
    }

    body[data-theme="NORDIC_FROST"] {
      --bg: #0d1117; --text-main: #e6edf3; --text-muted: #7d8590;
      --c-1: #58a6ff; /* frosty blue */
      --c-2: #79c0ff; /* light frost */
      --c-3: #a5d6ff; /* ice */
      --c-4: #3fb950; /* aurora green */
      --c-success: #58a6ff;
      --border: #30363d; --bg-panel: #161b22; --bg-black: #0d1117;
      --glass-bg: rgba(22, 27, 34, 0.65);
      --glass-border: rgba(88, 166, 255, 0.2);
    }

    body[data-theme="VAPORWAVE"] {
      --bg: #090014; --text-main: #f0d0ff; --text-muted: #8b6b99;
      --c-1: #ff2a6d; /* hot pink */
      --c-2: #05d9e8; /* laser cyan */
      --c-3: #01ffe5; /* mint */
      --c-4: #d1f7ff; /* white blue */
      --c-success: #05d9e8;
      --border: #2d1b4e; --bg-panel: #150530; --bg-black: #090014;
      --glass-bg: rgba(21, 5, 48, 0.7);
      --glass-border: rgba(255, 42, 109, 0.25);
    }

    body[data-theme="GHOST_WHITE"] {
      --bg: #fafafa; --text-main: #111111; --text-muted: #666666;
      --c-1: #000000; /* obsidian */
      --c-2: #333333; /* dark grey */
      --c-3: #1a1a1a; /* near black */
      --c-4: #444444; /* grey */
      --c-success: #000000;
      --border: #e5e5e5; --bg-panel: #ffffff; --bg-black: #fafafa;
      --glass-bg: rgba(255, 255, 255, 0.75);
      --glass-border: rgba(0, 0, 0, 0.1);
    }

    /* Force variables onto specific Tailwind classes */
    body[data-theme] { background-color: var(--bg) !important; color: var(--text-main) !important; }
    
    body[data-theme] .text-pink-500 { color: var(--c-1) !important; }
    body[data-theme] .text-cyan-400 { color: var(--c-2) !important; }
    body[data-theme] .text-yellow-400 { color: var(--c-3) !important; }
    body[data-theme] .text-purple-400, 
    body[data-theme] .text-purple-500 { color: var(--c-4) !important; }
    body[data-theme] .text-\\[\\#00ff41\\] { color: var(--c-success) !important; }
    body[data-theme] .text-blue-400 { color: var(--c-2) !important; }
    body[data-theme] .text-white { color: var(--text-main) !important; }
    
    body[data-theme] .text-gray-300, 
    body[data-theme] .text-gray-400, 
    body[data-theme] .text-gray-500, 
    body[data-theme] .text-gray-600 { color: var(--text-muted) !important; }
    body[data-theme] .text-cyan-100 { color: var(--text-main) !important; }

    body[data-theme] .bg-black { background-color: var(--bg-black) !important; }
    body[data-theme] .bg-\\[\\#050505\\], 
    body[data-theme] .bg-\\[\\#0a0a0a\\], 
    body[data-theme] .bg-\\[\\#111\\], 
    body[data-theme] .bg-\\[\\#222\\], 
    body[data-theme] .bg-\\[\\#333\\] { background-color: var(--bg-panel) !important; }
    
    body[data-theme] .bg-\\[\\#00ff41\\] { background-color: var(--c-success) !important; }
    body[data-theme] .bg-pink-500 { background-color: var(--c-1) !important; }
    body[data-theme] .bg-cyan-400 { background-color: var(--c-2) !important; }
    
    body[data-theme] .border-\\[\\#222\\], 
    body[data-theme] .border-\\[\\#333\\] { border-color: var(--border) !important; }
    
    /* Adjustments for light mode visibility */
    body[data-theme="GHOST_WHITE"] .bg-white { background-color: #000000 !important; } 
    body[data-theme="GHOST_WHITE"] .mix-blend-difference { mix-blend-mode: normal !important; }
    body[data-theme="GHOST_WHITE"] .mix-blend-screen { mix-blend-mode: multiply !important; }
    body[data-theme="GHOST_WHITE"] .mix-blend-color-dodge { mix-blend-mode: color-burn !important; }
    body[data-theme="GHOST_WHITE"] .matrix-canvas,
    body[data-theme="GHOST_WHITE"] .scene-3d-wrapper {
      filter: invert(1) hue-rotate(180deg);
      mix-blend-mode: multiply !important;
    }
    body[data-theme="GHOST_WHITE"] .noise-bg { opacity: 0.15; }
    body[data-theme="GHOST_WHITE"] .crt-overlay { opacity: 0.05; }
    body[data-theme="GHOST_WHITE"] .bg-black\\/95 { background-color: rgba(250, 250, 250, 0.95) !important; }
    body[data-theme="GHOST_WHITE"] .bg-\\[\\#111\\]\\/80 { background-color: rgba(255, 255, 255, 0.8) !important; }

    /* CRT overlay tinting per theme */
    body[data-theme="VAPORWAVE"] .crt-overlay {
      background: linear-gradient(rgba(255, 42, 109, 0.03) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 100, 0.06), rgba(5, 217, 232, 0.02), rgba(1, 255, 229, 0.06));
      background-size: 100% 2px, 3px 100%;
      opacity: 0.2;
    }
    body[data-theme="MIDNIGHT_GOLD"] .crt-overlay { opacity: 0.1; }
    body[data-theme="NORDIC_FROST"] .crt-overlay { opacity: 0.12; }

    /* Glassmorphism utility */
    .glass-panel {
      background-color: var(--glass-bg) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border) !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    
    body[data-theme="GHOST_WHITE"] .glass-panel {
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
    }
  `}</style>
);

const CustomCursor = ({ isHovering }: { isHovering: boolean }) => {
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[10000]"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 3 : 1,
        opacity: 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center opacity-50 scale-50">
          <div className="w-1 h-1 bg-black rounded-full" />
        </div>
      )}
    </motion.div>
  );
};

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onComplete();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  useEffect(() => {
    if (lines.length >= BOOT_LINES.length) {
      setDone(true);
      return;
    }

    const interval = setInterval(() => {
      setLines(prev => {
        if (prev.length < BOOT_LINES.length) {
          return [...prev, BOOT_LINES[prev.length]];
        }
        return prev;
      });
      setProgress(((lines.length + 1) / BOOT_LINES.length) * 100);
    }, 400);

    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[9000] font-mono text-xs sm:text-sm cursor-pointer"
      onClick={onComplete}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-2xl px-6">
        <div className="mb-8 min-h-[200px] flex flex-col justify-end">
          {lines.map((line, i) => {
            if (!line || typeof line !== 'string') return null;
            const isSuccess = line.includes("OK") || line.includes("READY");
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={isSuccess ? "text-[#00ff41]" : "text-gray-300"}
              >
                <span className="text-pink-500">&gt;</span> {line}
              </motion.div>
            );
          })}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-[#00ff41] mt-2"
          />
        </div>
        
        <div className="w-full h-1 bg-[#222] overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        
        <div className="mt-8 text-gray-600 text-center animate-pulse">
          {done ? '[ CLICK ANYWHERE OR PRESS ENTER TO INITIALIZE ]' : '[ PRESS ENTER TO SKIP ]'}
        </div>
      </div>
    </motion.div>
  );
};

const Terminal = ({ isOpen, onClose, playType, playSuccess, setActiveGame }: { isOpen: boolean; onClose: () => void; playType?: () => void; playSuccess?: () => void; setActiveGame?: (game: 'snake' | 'pong' | 'flappy' | 'shooter' | null) => void }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: `${portfolioConfig.name.split(' ')[0]}_OS v2.0.4` },
    { type: 'output', text: 'Type "help" for a list of available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (playType && e.key !== 'Enter') playType();
    
    if (e.key === 'Enter') {
      if (playSuccess) playSuccess();
      const cmd = input.trim().toLowerCase();
      let newHistory = [...history, { type: 'input', text: `${portfolioConfig.terminalUsername}:~$ ${cmd}`, color: 'text-gray-300' }];
      
      switch(cmd) {
        case 'help':
          newHistory.push({ type: 'output', text: 'Available commands: whoami, projects, skills, contact, clear, github stats, weather, ascii, sudo rm -rf /, play snake, play pong, play flappy, play shooter', color: 'text-cyan-400' });
          break;
        case 'whoami':
          newHistory.push({ type: 'output', text: `${portfolioConfig.name}\n${portfolioConfig.title}\n${portfolioConfig.role}`, color: 'text-purple-400' });
          break;
        case 'projects':
          newHistory.push({ type: 'output', text: 'ARCHIVE:\n' + portfolioConfig.projects.map(p => `- ${p.name} (${p.category})`).join('\n'), color: 'text-yellow-400' });
          break;
        case 'skills':
          newHistory.push({ type: 'output', text: portfolioConfig.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join('\n'), color: 'text-pink-400' });
          break;
        case 'contact':
          newHistory.push({ type: 'output', text: `EMAIL: ${portfolioConfig.email}\nGITHUB: ${portfolioConfig.github.url.replace('https://', '')}`, color: 'text-blue-400' });
          break;
        case 'github':
          window.open(portfolioConfig.github.url, '_blank');
          newHistory.push({ type: 'output', text: 'Opening GitHub profile...', color: 'text-blue-400' });
          break;
        case 'github stats':
          newHistory.push({ type: 'output', text: 'Fetching live data from GitHub API...', color: 'text-yellow-400' });
          setHistory([...newHistory]); 
          try {
            const res = await fetch(`https://api.github.com/users/${portfolioConfig.github.username}`);
            const data = await res.json();
            if (data.message && data.message.includes('API rate limit')) {
              newHistory.push({ type: 'output', text: 'GitHub API limit reached. Try again later.', color: 'text-red-500' });
            } else {
              newHistory.push({ type: 'output', text: `\n=== GITHUB PROFILE ===\nUSER: ${data.login}\nPUBLIC REPOS: ${data.public_repos}\nFOLLOWERS: ${data.followers}\nBIO: ${data.bio || 'None'}\n=====================\n`, color: 'text-cyan-400' });
            }
          } catch (err) {
            newHistory.push({ type: 'output', text: 'Failed to fetch GitHub data.', color: 'text-red-500' });
          }
          break;
        case 'weather':
          const conditions = ['100% chance of data rain', 'heavy cloud computing', 'solar flares detected', 'mild cyber storms', 'optimal for compiling'];
          const randomCond = conditions[Math.floor(Math.random() * conditions.length)];
          const randomTemp = Math.floor(Math.random() * 30) + 10;
          newHistory.push({ type: 'output', text: `Currently ${randomTemp}°C in cyberspace. Conditions: ${randomCond}.`, color: 'text-blue-400' });
          break;
        case 'ascii':
          const asciiArt = `
    ___    _   _____________  __  ______  __  __
   /   |  / | / /  _/ __ \\ / / / / __ \\/ / / /
  / /| | /  |/ // // /_/ / / / / / / / /_/ / 
 / ___ |/ /|  // // _, _/ /_/ / /_/ / __  /  
/_/  |_/_/ |_/___/_/ |_|\\____/_____/_/ /_/   
`;
          newHistory.push({ type: 'output', text: asciiArt, color: 'text-[#00ff41] whitespace-pre' });
          break;
        case 'sudo rm -rf /':
          newHistory.push({ type: 'output', text: 'CRITICAL ERROR: KERNEL PANIC. INITIATING CORE DUMP...', color: 'text-red-500 animate-pulse font-bold' });
          setHistory([...newHistory]);
          setTimeout(() => {
            onClose();
            // trigger ghost mode glitch globally by triggering click logic if possible
            // since we don't have direct access here, we just close it for now.
          }, 1500);
          return;
        case 'play snake':
          newHistory.push({ type: 'output', text: 'INITIALIZING SNAKE ENGINE...', color: 'text-[#00ff41]' });
          if (setActiveGame) { setActiveGame('snake'); onClose(); }
          break;
        case 'play pong':
          newHistory.push({ type: 'output', text: 'INITIALIZING PONG ENGINE...', color: 'text-pink-500' });
          if (setActiveGame) { setActiveGame('pong'); onClose(); }
          break;
        case 'play flappy':
          newHistory.push({ type: 'output', text: 'INITIALIZING FLAPPY BIRD ENGINE...', color: 'text-yellow-400' });
          if (setActiveGame) { setActiveGame('flappy'); onClose(); }
          break;
        case 'play shooter':
          newHistory.push({ type: 'output', text: 'INITIALIZING SPACE SHOOTER ENGINE...', color: 'text-cyan-400' });
          if (setActiveGame) { setActiveGame('shooter'); onClose(); }
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case '':
          break;
        default:
          newHistory.push({ type: 'output', text: `Command not found: ${cmd}. Type "help" for available commands.`, color: 'text-gray-500' });
      }
      
      setHistory([...newHistory]);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      drag={!isMaximized}
      dragMomentum={false}
      className={`fixed z-[8000] glass-panel font-mono text-sm flex flex-col ${
        isMaximized ? 'inset-4 md:inset-10 !transform-none' : 'bottom-4 right-4 w-[400px] h-[300px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#111]/80">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <TerminalIcon size={14} className="text-pink-500" />
          <span>terminal - {portfolioConfig.terminalUsername}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMaximized(!isMaximized)} className="text-gray-500 hover:text-white interactive">
            {isMaximized ? <Minus size={14} /> : <Maximize size={14} />}
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-red-400 interactive">
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto hide-scrollbar text-gray-300">
        {history.map((entry, i) => (
          <div key={i} className={`mb-2 ${entry.color || ''}`}>
            {entry.text.split('\n').map((line, j) => (
              <div key={j} className={line.startsWith(portfolioConfig.terminalUsername) ? 'opacity-50' : ''}>
                {line}
              </div>
            ))}
          </div>
        ))}
        
        <div className="flex items-center text-gray-300">
          <span className="mr-2 opacity-50">{portfolioConfig.terminalUsername}:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none caret-[#00ff41]"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
};

const Slideshow = ({ images, className = "", opacity = 1, objectFit = "cover" }: { images: string[], className?: string, opacity?: number, objectFit?: "cover" | "contain" }) => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || !images.length) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-${objectFit} transition-opacity duration-1000`}
          style={{ opacity: i === index ? opacity : 0 }}
          alt={`Preview ${i + 1}`}
        />
      ))}
    </div>
  );
};

const ProjectDetail = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[7000] bg-black/95 backdrop-blur-xl overflow-y-auto hide-scrollbar"
      >
        <div className="min-h-screen p-6 md:p-12 lg:p-24 max-w-6xl mx-auto">
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 md:top-12 md:right-12 z-50 flex items-center gap-2 text-gray-500 hover:text-white interactive uppercase text-xs tracking-widest font-mono"
          >
            [ Close (ESC) ]
          </button>

          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-cyan-400 text-sm mb-4">PROJECT {project.id} <span className="text-purple-500">//</span> {project.status}</div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12 uppercase text-white">{project.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-[#333] pt-12">
              <div className="col-span-1 space-y-8 font-mono text-xs text-gray-400">
                <div>
                  <div className="text-pink-500 mb-2">CATEGORY</div>
                  <div className="text-cyan-400">{project.category}</div>
                </div>
                <div>
                  <div className="text-pink-500 mb-2">TECH STACK</div>
                  <div className="text-yellow-400">{project.tech}</div>
                </div>
                <div>
                  <div className="text-pink-500 mb-2">YEAR</div>
                  <div className="text-purple-400">{project.year}</div>
                </div>
                <div className="pt-8 flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="interactive text-gray-400 hover:text-white flex items-center gap-2"><Github size={16} className="text-[#00ff41]"/> Source</a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="interactive text-gray-400 hover:text-white flex items-center gap-2"><ExternalLink size={16} className="text-[#00ff41]"/> Live Demo</a>
                  )}
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-3 space-y-12 text-gray-300 text-lg leading-relaxed">
                <section>
                  <h3 className="font-mono text-sm text-cyan-400 mb-4">01. OVERVIEW</h3>
                  <p>{project.longDesc}</p>
                </section>
                
                <section>
                  <h3 className="font-mono text-sm text-cyan-400 mb-4">02. THE PROBLEM</h3>
                  <p>{project.problem}</p>
                </section>
                
                <section>
                  <h3 className="font-mono text-sm text-cyan-400 mb-4">03. THE SOLUTION</h3>
                  <p>{project.solution}</p>
                </section>

                <div className="w-full aspect-video bg-[#0a0a0a] border border-[#333] relative overflow-hidden group">
                  {project.images && project.images.length > 0 ? (
                    <Slideshow images={project.images} className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-gray-600">
                        [ SYSTEM ARCHITECTURE DIAGRAM ]
                      </div>
                    </>
                  )}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-pink-500 rounded-full animate-pulse z-10" />
                  <div className="absolute bottom-4 right-4 font-mono text-[10px] text-gray-700 bg-black/80 px-2 py-1 rounded z-10">FIG. 1 / {project.name.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
const THEMES = ['NEON_CYBER', 'MIDNIGHT_GOLD', 'NORDIC_FROST', 'VAPORWAVE', 'GHOST_WHITE'];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const getSlideVariant = (dir: number) => ({
  hidden: { opacity: 0, y: dir > 0 ? 30 : -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
});

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('NEON_CYBER');
  const [bootState, setBootState] = useState('booting'); 
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [ghostMode, setGhostMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<'snake' | 'pong' | 'flappy' | 'shooter' | null>(null);
  
  const { playHover, playType, playSuccess } = useSound(soundEnabled);
  
  const [scrollDir, setScrollDir] = useState(1);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest - previous > 5) setScrollDir(1);
    else if (previous - latest > 5) setScrollDir(-1);
  });

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  const projectPreviewX = useSpring(0, { stiffness: 400, damping: 30 });
  const projectPreviewY = useSpring(0, { stiffness: 400, damping: 30 });
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (hoveredProject) setHoveredProject(null);
      if (hoveredElement) setHoveredElement(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hoveredProject, hoveredElement]);

  useEffect(() => {
    console.log("%c SYSTEM ACCESSED \n " + portfolioConfig.name + " \n ROOT PRIVILEGES: FALSE ", "color: #00ff41; font-size: 16px; font-weight: bold; background: #000; padding: 10px; border: 1px solid #00ff41;");
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (hoveredProject) {
      projectPreviewX.set(e.clientX);
      projectPreviewY.set(e.clientY);
    }
  }, [hoveredProject, projectPreviewX, projectPreviewY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Ambient Drone Audio Synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (ambientEnabled) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, ctx.currentTime); // Low drone
      
      // Filter for sci-fi muffle
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      
      // Slow LFO for frequency modulation (breathing effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(50, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2); // fade in
      
      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1); // fade out
        setTimeout(() => {
          oscillatorRef.current?.stop();
        }, 1000);
      }
    }
    
    return () => {
      // Cleanup handled by the else branch or unmount
    };
  }, [ambientEnabled]);

  // Konami Code Listener
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setGhostMode(true);
          if (playSuccess) playSuccess();
          setTimeout(() => setGhostMode(false), 5000);
          index = 0;
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSuccess]);

  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .interactive')) {
        setHoveredElement(true);
        playHover();
      } else {
        setHoveredElement(false);
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [playHover]);

  const handleSecretClick = () => {
    setEasterEggCount(p => p + 1);
    if (easterEggCount === 4) {
      if (playSuccess) playSuccess();
      setGhostMode(true);
      setTimeout(() => setGhostMode(false), 5000);
      setEasterEggCount(0);
    }
  };

  if (bootState === 'booting') {
    return (
      <div className="bg-black min-h-screen">
        <GlobalStyles />
        <BootSequence onComplete={() => setBootState('ready')} />
      </div>
    );
  }

  return (
    <div className={`relative ${ghostMode ? 'ghost-mode' : ''}`}>
      <GlobalStyles />
      <MatrixRain />
      <GithubStats />
      <div className="crt-overlay" />
      <div className="noise-bg" />
      <CustomCursor isHovering={hoveredElement} />

      {}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference">
        <nav className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-gray-300">
          <div 
            className="font-bold text-white interactive cursor-pointer flex items-center gap-2"
            onClick={handleSecretClick}
          >
            <div className={`w-2 h-2 rounded-full ${ghostMode ? 'bg-red-500 animate-ping' : 'bg-[#00ff41]'}`} />
            {portfolioConfig.name.split(' ')[0]}_OS
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#work" className="hover:text-cyan-400 transition-colors interactive">[PROJECTS]</a>
            <a href="#about" className="hover:text-pink-400 transition-colors interactive">[ABOUT]</a>
            <a href="#skills" className="hover:text-yellow-400 transition-colors interactive">[SKILLS]</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors interactive">[CONTACT]</a>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden interactive text-gray-300 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[5000] glass-panel flex flex-col items-center justify-center md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white interactive"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col items-center gap-10 font-mono text-lg uppercase tracking-widest">
              {[
                { href: '#work', label: 'PROJECTS', color: 'hover:text-cyan-400' },
                { href: '#about', label: 'ABOUT', color: 'hover:text-pink-400' },
                { href: '#skills', label: 'SKILLS', color: 'hover:text-yellow-400' },
                { href: '#contact', label: 'CONTACT', color: 'hover:text-purple-400' },
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`text-gray-300 ${item.color} transition-colors interactive`}
                >
                  [{item.label}]
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
          <Scene3D />
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10">
            <h1 
              className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 text-white interactive cursor-pointer select-none"
              onClick={handleSecretClick}
            >
              {portfolioConfig.name}
            </h1>
            <p className="font-mono text-cyan-400 mb-12 text-sm md:text-base max-w-2xl uppercase">
              {portfolioConfig.title}
            </p>
            
            <div className="font-mono text-xs md:text-sm text-gray-400 space-y-2 mb-12">
              <p><span className="text-pink-500">&gt;</span> I build software, AI systems and interactive experiments.</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-8 pt-4">
                <span><span className="text-purple-400">LOCATION:</span> <span className="text-yellow-400">HYDERABAD, INDIA</span></span>
                <span><span className="text-purple-400">STATUS:</span> <span className="text-[#00ff41]">BUILDING</span></span>
                <span><span className="text-purple-400">FOCUS:</span> <span className="text-blue-400">AI / ML / FULL-STACK</span></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-16 font-mono text-xs max-w-2xl">
              <button 
                onClick={() => {
                  setActiveGame('snake');
                  if (playSuccess) playSuccess();
                }}
                className="flex flex-col items-center gap-2 hover:text-[#00ff41] interactive text-gray-500 group"
              >
                <div className="w-12 h-12 border border-[#333] group-hover:border-[#00ff41] bg-[#111] flex items-center justify-center transition-colors">
                  <SnakeIcon size={20} />
                </div>
                <span>Snake.exe</span>
              </button>
              <button 
                onClick={() => {
                  setActiveGame('pong');
                  if (playSuccess) playSuccess();
                }}
                className="flex flex-col items-center gap-2 hover:text-pink-500 interactive text-gray-500 group"
              >
                <div className="w-12 h-12 border border-[#333] group-hover:border-pink-500 bg-[#111] flex items-center justify-center transition-colors">
                  <PongIcon size={20} />
                </div>
                <span>Pong.exe</span>
              </button>
              <button 
                onClick={() => {
                  setActiveGame('flappy');
                  if (playSuccess) playSuccess();
                }}
                className="flex flex-col items-center gap-2 hover:text-yellow-400 interactive text-gray-500 group"
              >
                <div className="w-12 h-12 border border-[#333] group-hover:border-yellow-400 bg-[#111] flex items-center justify-center transition-colors">
                  <FlappyIcon size={20} />
                </div>
                <span>Flappy.exe</span>
              </button>
              <button 
                onClick={() => {
                  setActiveGame('shooter');
                  if (playSuccess) playSuccess();
                }}
                className="flex flex-col items-center gap-2 hover:text-cyan-400 interactive text-gray-500 group"
              >
                <div className="w-12 h-12 border border-[#333] group-hover:border-cyan-400 bg-[#111] flex items-center justify-center transition-colors">
                  <ShooterIcon size={20} />
                </div>
                <span>Shooter.exe</span>
              </button>
              <button 
                onClick={() => {
                  setTerminalOpen(true);
                  if (playSuccess) playSuccess();
                }}
                className="flex flex-col items-center gap-2 hover:text-white interactive text-gray-500 group"
              >
                <div className="w-12 h-12 border border-[#333] group-hover:border-white bg-[#111] flex items-center justify-center transition-colors">
                  <TerminalIcon size={20} />
                </div>
                <span>Terminal.exe</span>
              </button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="font-mono text-xs text-gray-500 animate-pulse"
            >
              [ SCROLL TO EXPLORE ]
            </motion.div>
          </motion.div>
        </section>

        {}
        <section id="about" className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 py-24 border-t border-[#222]">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full max-w-4xl"
          >
            <motion.div variants={getSlideVariant(scrollDir)} className="font-mono text-xs text-blue-400 mb-8">/SYS_INFO/PROFILE.DAT</motion.div>
            <div className="bg-[#0a0a0a] border border-[#333] p-6 md:p-12 font-mono text-sm md:text-base text-gray-400 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Code2 size={100} className="text-pink-500" />
              </div>
              
              <motion.div variants={getSlideVariant(scrollDir)} className="flex gap-8 border-b border-[#222] pb-4">
                <span className="w-32 text-pink-500">USER_PROFILE</span>
                <span className="text-yellow-400">"{portfolioConfig.name}"</span>
              </motion.div>
              <motion.div variants={getSlideVariant(scrollDir)} className="flex gap-8 border-b border-[#222] pb-4">
                <span className="w-32 text-pink-500">ROLE</span>
                <span className="text-yellow-400">"DEVELOPER / CREATIVE TECHNOLOGIST"</span>
              </motion.div>
              <motion.div variants={getSlideVariant(scrollDir)} className="flex gap-8 border-b border-[#222] pb-4">
                <span className="w-32 text-pink-500">EDUCATION</span>
                <span className="text-yellow-400">"COMPUTER SCIENCE / AI & ML"</span>
              </motion.div>
              <motion.div variants={getSlideVariant(scrollDir)} className="flex flex-col md:flex-row gap-4 md:gap-8 pt-4">
                <span className="w-32 text-pink-500 shrink-0">INTERESTS</span>
                <ul className="space-y-2 text-cyan-400">
                  <li><span className="text-[#00ff41]">-</span> "ARTIFICIAL INTELLIGENCE"</li>
                  <li><span className="text-[#00ff41]">-</span> "MACHINE LEARNING"</li>
                  <li><span className="text-[#00ff41]">-</span> "WEB DEVELOPMENT"</li>
                  <li><span className="text-[#00ff41]">-</span> "EXPERIMENTAL TECHNOLOGY"</li>
                </ul>
              </motion.div>
              <motion.div variants={getSlideVariant(scrollDir)} className="pt-8 text-gray-300 leading-relaxed font-sans text-lg">
                I operate at the intersection of complex algorithms and human-centric design. My objective is not just to write code, but to engineer systems that feel alive, intuitive, and highly capable. I enjoy tackling technically demanding challenges, from real-time web infrastructure to raw neural signal processing.
              </motion.div>
              
              <motion.div variants={getSlideVariant(scrollDir)} className="pt-8 border-t border-[#222]">
                <a href={portfolioConfig.resume} download={`${portfolioConfig.name.replace(' ', '_')}_Resume.pdf`} className="inline-flex items-center gap-3 px-6 py-3 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20 transition-all font-mono text-sm interactive group w-full md:w-auto justify-center">
                  <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                  &gt; INITIATE_RESUME_DOWNLOAD
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {}
        <section id="work" className="py-24 px-6 md:px-12 lg:px-24 border-t border-[#222] relative">
          <div className="font-mono text-xs text-blue-400 mb-16">/SYS_INFO/PROJECT_ARCHIVE</div>
          
          <div className="w-full border-t border-[#333]">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={`proj-${project.id}`}
                variants={getSlideVariant(scrollDir)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className="group relative border-b border-[#333] py-8 cursor-pointer interactive"
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setActiveProject(project)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 mix-blend-difference">
                  <div className="flex items-center gap-8 md:gap-16">
                    <span className="font-mono text-sm text-pink-500">{project.id}</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase group-hover:italic transition-all duration-300 transform group-hover:translate-x-4 text-white">
                      {project.name}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-8 md:gap-16 font-mono text-xs text-gray-400">
                    <span className="hidden md:block w-48 text-cyan-400">{project.category}</span>
                    <span className="hidden lg:block w-64 truncate text-yellow-400">{project.tech}</span>
                    <span className="text-purple-400">{project.year}</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <AnimatePresence>
            {hoveredProject && !activeProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed pointer-events-none z-0 hidden md:flex items-center justify-center bg-black border border-[#333] shadow-2xl overflow-hidden"
                style={{
                  width: 350,
                  height: 250,
                  left: projectPreviewX,
                  top: projectPreviewY,
                  x: 20,
                  y: 20,
                }}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-color-dodge" style={{ background: `linear-gradient(135deg, transparent, ${hoveredProject.color})` }} />
                {hoveredProject.images && hoveredProject.images.length > 0 && (
                  <Slideshow images={hoveredProject.images} opacity={0.7} className="absolute inset-0 w-full h-full mix-blend-screen" />
                )}
                <div className="absolute inset-0 noise-bg opacity-10" />
                <div className="font-mono text-[10px] text-pink-500 absolute top-4 left-4 z-10 bg-black/50 p-1">PREVIEW_{hoveredProject.id}</div>
                <div className="text-white/20 font-bold text-4xl uppercase absolute opacity-20 transform -rotate-12 blur-sm select-none">{hoveredProject.name}</div>
                <div className="w-full h-full p-8 flex flex-col justify-end">
                  <div className="h-px w-full bg-[#333] mb-2 relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-[#00ff41]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div className="font-mono text-xs text-yellow-400 truncate">{hoveredProject.tech}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {}
        <section id="skills" className="py-24 px-6 md:px-12 lg:px-24 border-t border-[#222]">
           <div className="font-mono text-xs text-blue-400 mb-16">/SYS_INFO/SKILLS</div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SKILLS.map((skillGroup, index) => (
                <motion.div 
                  key={`skill-${skillGroup.category}`}
                  variants={getSlideVariant(scrollDir)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  className="border border-[#333] bg-[#0a0a0a] p-6 hover:bg-[#111] transition-colors interactive group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-mono text-xs text-pink-500">[{skillGroup.category}]</div>
                  </div>
                  <ul className="space-y-4">
                    {skillGroup.items.map((item, i) => (
                      <li key={i} className="font-mono text-sm text-cyan-100 group-hover:text-cyan-400 transition-colors flex items-center gap-3">
                        <span className="text-purple-500">&gt;</span> {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
           </div>
        </section>

        {/* GITHUB ACTIVITY SECTION */}
        <section id="activity" className="py-24 px-6 md:px-12 lg:px-24 border-t border-[#222]">
           <div className="font-mono text-xs text-blue-400 mb-16">/SYS_INFO/ACTIVITY</div>
           <motion.div 
             variants={getSlideVariant(scrollDir)}
             initial="hidden"
             whileInView="show"
             viewport={{ once: false }}
             className="border border-[#333] bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors overflow-x-auto interactive"
           >
             <div className="min-w-[800px] flex justify-center">
               <Calendar 
                 username={portfolioConfig.github.username} 
                 colorScheme="dark"
                 blockSize={14}
                 blockMargin={5}
                 fontSize={12}
                 theme={{
                   light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                   dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
                 }}
               />
             </div>
           </motion.div>
        </section>

        {}
        <motion.section 
          id="contact" 
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
          className="py-24 px-6 md:px-12 lg:px-24 border-t border-[#222] bg-black min-h-[50vh] flex flex-col justify-between"
        >
          <div>
            <motion.div variants={getSlideVariant(scrollDir)} className="font-mono text-xs text-blue-400 mb-12">establish_connection()</motion.div>
            <motion.h2 variants={getSlideVariant(scrollDir)} className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16">
              LET'S BUILD SOMETHING.
            </motion.h2>
            
            <motion.div variants={getSlideVariant(scrollDir)} className="flex flex-col md:flex-row flex-wrap gap-8 font-mono text-sm">
              <a href={`mailto:${portfolioConfig.email}`} className="group interactive flex items-center gap-4 text-gray-400 hover:text-white">
                <Mail size={16} className="text-pink-500" />
                <div className="overflow-hidden relative h-5">
                  <div className="transition-transform duration-300 group-hover:-translate-y-5">EMAIL</div>
                  <div className="text-[#00ff41] transition-transform duration-300 group-hover:-translate-y-5">CONNECTING...</div>
                </div>
              </a>
              <a href={portfolioConfig.github.url} target="_blank" rel="noopener noreferrer" className="group interactive flex items-center gap-4 text-gray-400 hover:text-white">
                <Github size={16} className="text-pink-500" />
                <div className="overflow-hidden relative h-5">
                  <div className="transition-transform duration-300 group-hover:-translate-y-5">GITHUB</div>
                  <div className="text-[#00ff41] transition-transform duration-300 group-hover:-translate-y-5">ESTABLISHED.</div>
                </div>
              </a>
              <a href={portfolioConfig.linkedin.url} target="_blank" rel="noopener noreferrer" className="group interactive flex items-center gap-4 text-gray-400 hover:text-white">
                <Linkedin size={16} className="text-pink-500" />
                <div className="overflow-hidden relative h-5">
                  <div className="transition-transform duration-300 group-hover:-translate-y-5">LINKEDIN</div>
                  <div className="text-[#00ff41] transition-transform duration-300 group-hover:-translate-y-5">ESTABLISHED.</div>
                </div>
              </a>
              <a href={portfolioConfig.twitter.url} target="_blank" rel="noopener noreferrer" className="group interactive flex items-center gap-4 text-gray-400 hover:text-white">
                <Twitter size={16} className="text-pink-500" />
                <div className="overflow-hidden relative h-5">
                  <div className="transition-transform duration-300 group-hover:-translate-y-5">TWITTER</div>
                  <div className="text-[#00ff41] transition-transform duration-300 group-hover:-translate-y-5">ESTABLISHED.</div>
                </div>
              </a>
              <a href={portfolioConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="group interactive flex items-center gap-4 text-gray-400 hover:text-white">
                <Instagram size={16} className="text-pink-500" />
                <div className="overflow-hidden relative h-5">
                  <div className="transition-transform duration-300 group-hover:-translate-y-5">INSTAGRAM</div>
                  <div className="text-[#00ff41] transition-transform duration-300 group-hover:-translate-y-5">ESTABLISHED.</div>
                </div>
              </a>
            </motion.div>
          </div>
          
          <motion.div variants={getSlideVariant(scrollDir)} className="mt-32 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-gray-500 border-t border-[#222] pt-8">
            <div>
              <span className="text-cyan-400">{portfolioConfig.name}</span> <span className="text-purple-500">//</span> {portfolioConfig.role}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-yellow-400">© {new Date().getFullYear()}</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                <span className="text-[#00ff41]">SYSTEM ONLINE</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

      </main>

      <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />
      <AnimatePresence>
        {terminalOpen && (
          <Terminal 
            isOpen={terminalOpen} 
            onClose={() => setTerminalOpen(false)} 
            playType={playType}
            playSuccess={playSuccess}
            setActiveGame={setActiveGame}
          />
        )}
      </AnimatePresence>

      {/* Full Screen Game Overlays */}
      <AnimatePresence>
        {activeGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center backdrop-blur-md"
          >
            {activeGame === 'snake' && <SnakeGame onExit={() => setActiveGame(null)} />}
            {activeGame === 'pong' && <PongGame onExit={() => setActiveGame(null)} />}
            {activeGame === 'flappy' && <FlappyBird onExit={() => setActiveGame(null)} />}
            {activeGame === 'shooter' && <SpaceShooter onExit={() => setActiveGame(null)} />}
          </motion.div>
        )}
      </AnimatePresence>

      <Taskbar 
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        ambientEnabled={ambientEnabled}
        setAmbientEnabled={setAmbientEnabled}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        themes={THEMES}
        onOpenTerminal={() => { setTerminalOpen(true); if (playSuccess) playSuccess(); }}
      />
    </div>
  );
}