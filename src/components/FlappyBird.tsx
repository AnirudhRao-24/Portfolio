import React, { useEffect, useRef, useState } from 'react';
import { MobileGamepad } from './MobileGamepad';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.1;
const JUMP = -3;
const PIPE_WIDTH = 60;
const PIPE_SPACING = 280;
const PIPE_SPEED = 3;

export const FlappyBird = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');

  const state = useRef({
    by: CANVAS_HEIGHT / 2,
    bv: 0,
    pipes: [] as { x: number; top: number; passed: boolean }[],
    score: 0,
    frame: 0
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    const s = state.current;

    const reset = () => {
      s.by = CANVAS_HEIGHT / 2;
      s.bv = 0;
      s.pipes = [];
      s.score = 0;
      s.frame = 0;
      setScore(0);
    };

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background city (very basic parallax)
      ctx.fillStyle = '#111';
      for (let i = 0; i < 5; i++) {
        const h = 100 + Math.sin(i * 99) * 50;
        ctx.fillRect(i * 100 - (s.frame * 0.5) % 100, CANVAS_HEIGHT - h, 80, h);
      }

      if (gameState === 'start') {
        ctx.fillStyle = '#888';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE OR TAP', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }

      if (gameState === 'playing') {
        s.bv += GRAVITY;
        s.bv = Math.min(s.bv, 10); // cap terminal velocity
        s.by += s.bv;
        s.frame++;

        // Add pipes
        if (s.frame % 70 === 0) {
          const top = Math.max(50, Math.random() * (CANVAS_HEIGHT - PIPE_SPACING - 100));
          s.pipes.push({ x: CANVAS_WIDTH, top, passed: false });
        }

        // Update pipes
        for (let i = s.pipes.length - 1; i >= 0; i--) {
          const p = s.pipes[i];
          p.x -= PIPE_SPEED;

          if (p.x < -PIPE_WIDTH) s.pipes.splice(i, 1);

          // Collision
          const bx = 80; // Bird X
          const bw = 20; // Bird size

          if (bx + bw > p.x && bx < p.x + PIPE_WIDTH) {
            if (s.by < p.top || s.by + bw > p.top + PIPE_SPACING) {
              setGameState('gameover');
            }
          }

          if (!p.passed && bx > p.x + PIPE_WIDTH) {
            p.passed = true;
            s.score++;
            setScore(s.score);
          }
        }

        if (s.by > CANVAS_HEIGHT || s.by < 0) {
          setGameState('gameover');
        }
      }

      // Draw pipes
      ctx.fillStyle = '#00ff41';
      for (const p of s.pipes) {
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);
        ctx.fillRect(p.x, p.top + PIPE_SPACING, PIPE_WIDTH, CANVAS_HEIGHT - p.top - PIPE_SPACING);
      }

      // Draw bird
      ctx.save();
      ctx.translate(80 + 10, s.by + 10);
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (s.bv * 0.1))));
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-10, -10, 20, 20);
      ctx.restore();

      if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SYSTEM FAILURE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${s.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.fillStyle = '#facc15';
        ctx.font = '16px monospace';
        ctx.fillText('PRESS SPACE TO REBOOT', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const handleDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        if (gameState === 'start') {
          setGameState('playing');
          s.bv = JUMP;
        } else if (gameState === 'playing') {
          s.bv = JUMP;
        } else if (gameState === 'gameover') {
          reset();
          setGameState('playing');
          s.bv = JUMP;
        }
      }
    };

    window.addEventListener('keydown', handleDown);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleDown);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative font-mono">
      <div className="absolute top-12 left-0 right-0 flex justify-center font-bold z-10 pointer-events-none" style={{ fontSize: '100px', opacity: 0.2 }}>
        <span className="text-white">{score}</span>
      </div>
      <button onClick={onExit} className="absolute top-8 right-8 text-gray-500 hover:text-white font-mono interactive z-20 text-xl tracking-widest border border-gray-800 px-6 py-2 bg-black/50 hover:bg-white hover:text-black transition-colors">
        [EXIT GAME]
      </button>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-[#111] border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[90vw] max-h-[70vh] object-contain rounded-lg"
      />
      <MobileGamepad action />
    </div>
  );
};
