import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CircleDot } from 'lucide-react';

const triggerKey = (key: string, type: 'keydown' | 'keyup') => {
  window.dispatchEvent(new KeyboardEvent(type, { key }));
};

const GameButton = ({ icon: Icon, actionKey, label }: { icon?: any, actionKey: string, label?: string }) => (
  <button
    className="w-16 h-16 bg-white/10 active:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 select-none touch-manipulation"
    onPointerDown={(e) => { e.preventDefault(); triggerKey(actionKey, 'keydown'); }}
    onPointerUp={(e) => { e.preventDefault(); triggerKey(actionKey, 'keyup'); }}
    onPointerLeave={(e) => { e.preventDefault(); triggerKey(actionKey, 'keyup'); }}
    onPointerCancel={(e) => { e.preventDefault(); triggerKey(actionKey, 'keyup'); }}
  >
    {Icon ? <Icon className="text-white w-8 h-8" /> : <span className="text-white font-bold">{label}</span>}
  </button>
);

export const MobileGamepad = ({ 
  up, down, left, right, action 
}: { 
  up?: boolean, down?: boolean, left?: boolean, right?: boolean, action?: boolean 
}) => {
  
  // Prevent context menu and double-tap zoom on the gamepad area
  useEffect(() => {
    const disableContextMenu = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);
    return () => document.removeEventListener('contextmenu', disableContextMenu);
  }, []);

  return (
    <div className="flex md:hidden w-full max-w-sm mx-auto justify-between items-end p-2 mt-2 select-none touch-manipulation z-50">
      {/* D-PAD */}
      <div className="grid grid-cols-3 gap-2">
        <div />
        {up ? <GameButton icon={ArrowUp} actionKey="ArrowUp" /> : <div />}
        <div />
        
        {left ? <GameButton icon={ArrowLeft} actionKey="ArrowLeft" /> : <div />}
        <div className="w-16 h-16" /> {/* Center */}
        {right ? <GameButton icon={ArrowRight} actionKey="ArrowRight" /> : <div />}
        
        <div />
        {down ? <GameButton icon={ArrowDown} actionKey="ArrowDown" /> : <div />}
        <div />
      </div>

      {/* Action Buttons */}
      <div className="flex items-end pb-4 pl-4">
        {action && (
          <button
            className="w-20 h-20 bg-red-500/50 active:bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/50 select-none touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); triggerKey(' ', 'keydown'); }}
            onPointerUp={(e) => { e.preventDefault(); triggerKey(' ', 'keyup'); }}
            onPointerLeave={(e) => { e.preventDefault(); triggerKey(' ', 'keyup'); }}
            onPointerCancel={(e) => { e.preventDefault(); triggerKey(' ', 'keyup'); }}
          >
            <CircleDot className="text-white w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  );
};
