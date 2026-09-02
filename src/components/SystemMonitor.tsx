import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export const SystemMonitor = () => {
  const [fps, setFps] = useState(60);
  const [mem, setMem] = useState(0);
  const [ping, setPing] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const loop = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;

        // Try getting actual JS heap size
        const perfMemory = (performance as any).memory;
        if (perfMemory) {
          setMem(perfMemory.usedJSHeapSize / (1024 * 1024)); // Convert to MB
        }

        // Try getting actual network RTT/ping
        const connection = (navigator as any).connection;
        if (connection && connection.rtt !== undefined) {
          setPing(connection.rtt);
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-[10px] hidden md:flex flex-col gap-2 bg-black/80 p-3 border border-[#333] backdrop-blur-sm text-gray-500 w-48 shadow-2xl pointer-events-none mix-blend-difference">
      <div className="flex items-center gap-2 mb-1 border-b border-[#333] pb-1 text-gray-400">
        <Activity size={10} className="text-[#00ff41]" />
        <span>SYS_MONITOR</span>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>BROWSER_FPS</span>
          <span className="text-cyan-400">{fps} Hz</span>
        </div>
        <div className="w-full bg-[#111] h-1">
          <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${Math.min(100, (fps / 60) * 100)}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>JS_HEAP</span>
          <span className="text-pink-500">{mem ? `${mem.toFixed(1)} MB` : 'N/A'}</span>
        </div>
        <div className="w-full bg-[#111] h-1">
          <div className="bg-pink-500 h-full transition-all duration-1000" style={{ width: `${mem ? Math.min(100, (mem / 100) * 100) : 0}%` }} />
        </div>
      </div>

      <div className="flex justify-between mt-1 text-[9px]">
        <span>NET_RTT</span>
        <span className="text-yellow-400">{ping ? `${ping} ms` : 'N/A'}</span>
      </div>
    </div>
  );
};
