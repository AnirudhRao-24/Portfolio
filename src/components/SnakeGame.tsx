import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;
const SPEED = 100;

export const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  
  const state = useRef({
    snake: [[10, 10]] as [number, number][],
    food: [15, 15] as [number, number],
    dir: [1, 0] as [number, number],
    nextDir: [1, 0] as [number, number],
    score: 0,
    lastTick: 0
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    let rafId: number;
    const s = state.current;

    const spawnFood = () => {
      let f: [number, number];
      while (true) {
        f = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
        if (!s.snake.some(seg => seg[0] === f[0] && seg[1] === f[1])) break;
      }
      s.food = f;
    };

    const reset = () => {
      s.snake = [[10, 10]];
      s.dir = [1, 0];
      s.nextDir = [1, 0];
      s.score = 0;
      spawnFood();
      setScore(0);
    };

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Grid
      ctx.strokeStyle = '#111';
      ctx.beginPath();
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      }
      ctx.stroke();

      if (gameState === 'start') {
        ctx.fillStyle = '#888';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText('USE ARROWS / WASD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      }
      
      if (gameState === 'playing') {
        const now = Date.now();
        if (now - s.lastTick > Math.max(40, SPEED - s.score * 2)) { // gets faster
          s.dir = s.nextDir;
          const head = s.snake[0];
          const nextHead: [number, number] = [head[0] + s.dir[0], head[1] + s.dir[1]];
          
          // Collision
          if (
            nextHead[0] < 0 || nextHead[0] >= GRID_SIZE ||
            nextHead[1] < 0 || nextHead[1] >= GRID_SIZE ||
            s.snake.some(seg => seg[0] === nextHead[0] && seg[1] === nextHead[1])
          ) {
            setGameState('gameover');
          } else {
            s.snake.unshift(nextHead);
            
            // Eat food
            if (nextHead[0] === s.food[0] && nextHead[1] === s.food[1]) {
              s.score += 10;
              setScore(s.score);
              spawnFood();
            } else {
              s.snake.pop();
            }
          }
          
          s.lastTick = now;
        }
      }
      
      // Draw Food
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(s.food[0] * CELL_SIZE + 2, s.food[1] * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      
      // Draw Snake
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#00ff41' : '#00cc33';
        ctx.fillRect(seg[0] * CELL_SIZE + 1, seg[1] * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      
      if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${s.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.fillStyle = '#facc15';
        ctx.font = '16px monospace';
        ctx.fillText('PRESS SPACE TO RESTART', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      }
      
      rafId = requestAnimationFrame(render);
    };
    
    rafId = requestAnimationFrame(render);
    
    const handleDown = (e: KeyboardEvent) => { 
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ' && gameState !== 'playing') {
        if (gameState === 'gameover') reset();
        setGameState('playing');
        return;
      }
      
      if (gameState !== 'playing') return;
      
      if ((e.key === 'ArrowUp' || e.key === 'w') && s.dir[1] !== 1) s.nextDir = [0, -1];
      if ((e.key === 'ArrowDown' || e.key === 's') && s.dir[1] !== -1) s.nextDir = [0, 1];
      if ((e.key === 'ArrowLeft' || e.key === 'a') && s.dir[0] !== 1) s.nextDir = [-1, 0];
      if ((e.key === 'ArrowRight' || e.key === 'd') && s.dir[0] !== -1) s.nextDir = [1, 0];
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
        <span className="text-[#00ff41]">{score}</span>
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
