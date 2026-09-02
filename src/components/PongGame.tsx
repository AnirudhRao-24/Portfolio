import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const BALL_SPEED = 7;

export const PongGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  
  const state = useRef({
    p1y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    p2y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    bx: CANVAS_WIDTH / 2,
    by: CANVAS_HEIGHT / 2,
    bvx: BALL_SPEED,
    bvy: BALL_SPEED,
    keys: {} as Record<string, boolean>
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    let rafId: number;
    const s = state.current;
    
    const resetBall = (dir: number) => {
      s.bx = CANVAS_WIDTH / 2;
      s.by = CANVAS_HEIGHT / 2;
      s.bvx = BALL_SPEED * dir;
      s.bvy = (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED - 2);
    };

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.strokeStyle = '#333';
      ctx.stroke();

      if (gameState === 'start') {
        ctx.fillStyle = '#888';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        ctx.fillText('PLAYER 1: W/S OR ARROWS', CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 100);
        ctx.fillText('PLAYER 2: AI', (CANVAS_WIDTH / 4) * 3, CANVAS_HEIGHT / 2 + 100);
      }
      
      ctx.fillStyle = '#00ff41'; 
      ctx.fillRect(30, s.p1y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = '#facc15'; 
      ctx.fillRect(CANVAS_WIDTH - 30 - PADDLE_WIDTH, s.p2y, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(s.bx - BALL_SIZE/2, s.by - BALL_SIZE/2, BALL_SIZE, BALL_SIZE);
      
      if (gameState === 'playing') {
        if (s.keys['w'] || s.keys['ArrowUp']) s.p1y = Math.max(0, s.p1y - PADDLE_SPEED);
        if (s.keys['s'] || s.keys['ArrowDown']) s.p1y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, s.p1y + PADDLE_SPEED);
        
        // AI for Player 2
        const aiCenter = s.p2y + PADDLE_HEIGHT / 2;
        if (aiCenter < s.by - 15) {
          s.p2y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, s.p2y + PADDLE_SPEED * 0.75);
        } else if (aiCenter > s.by + 15) {
          s.p2y = Math.max(0, s.p2y - PADDLE_SPEED * 0.75);
        }
        
        s.bx += s.bvx;
        s.by += s.bvy;
        
        if (s.by <= BALL_SIZE/2 || s.by >= CANVAS_HEIGHT - BALL_SIZE/2) {
          s.bvy *= -1;
        }
        
        if (s.bx - BALL_SIZE/2 <= 30 + PADDLE_WIDTH && s.bx > 30 && s.by >= s.p1y && s.by <= s.p1y + PADDLE_HEIGHT) {
          s.bvx = Math.abs(s.bvx) * 1.05;
          s.bx = 30 + PADDLE_WIDTH + BALL_SIZE/2;
          s.bvy = ((s.by - (s.p1y + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2)) * BALL_SPEED; 
        }
        if (s.bx + BALL_SIZE/2 >= CANVAS_WIDTH - 30 - PADDLE_WIDTH && s.bx < CANVAS_WIDTH - 30 && s.by >= s.p2y && s.by <= s.p2y + PADDLE_HEIGHT) {
          s.bvx = -Math.abs(s.bvx) * 1.05;
          s.bx = CANVAS_WIDTH - 30 - PADDLE_WIDTH - BALL_SIZE/2;
          s.bvy = ((s.by - (s.p2y + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2)) * BALL_SPEED;
        }
        
        if (s.bx < 0) {
          setGameState('gameover');
        } else if (s.bx > CANVAS_WIDTH) {
          setScore(sc => ({ ...sc, p1: sc.p1 + 1 }));
          resetBall(-1);
        }
      }
      
      if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SYSTEM FAILURE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${score.p1}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
        ctx.fillStyle = '#facc15';
        ctx.font = '16px monospace';
        ctx.fillText('PRESS SPACE TO REBOOT', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
      }
      
      rafId = requestAnimationFrame(render);
    };
    
    rafId = requestAnimationFrame(render);
    
    const handleDown = (e: KeyboardEvent) => { 
      s.keys[e.key] = true; 
      if (e.key === ' ' && gameState !== 'playing') {
        if (gameState === 'gameover') {
          setScore({ p1: 0, p2: 0 });
          resetBall(1);
          s.p1y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
          s.p2y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        }
        setGameState('playing');
      }
    };
    const handleUp = (e: KeyboardEvent) => { s.keys[e.key] = false; };
    
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [gameState, score]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative font-mono">
      <div className="absolute top-12 left-0 right-0 flex justify-between px-32 font-bold z-10 pointer-events-none" style={{ fontSize: '100px', opacity: 0.2 }}>
        <span className="text-[#00ff41]">{score.p1}</span>
        <span className="text-[#facc15]">{score.p2}</span>
      </div>
      <button onClick={onExit} className="absolute top-8 right-8 text-gray-500 hover:text-white font-mono interactive z-20 text-xl tracking-widest border border-gray-800 px-6 py-2 bg-black/50 hover:bg-white hover:text-black transition-colors">
        [EXIT GAME]
      </button>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        className="bg-[#111] border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[90vw] max-h-[80vh] object-contain rounded-lg" 
      />
    </div>
  );
};
