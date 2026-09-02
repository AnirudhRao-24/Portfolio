import React, { useEffect, useRef, useState } from 'react';
import { MobileGamepad } from './MobileGamepad';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 30;
const BULLET_W = 4;
const BULLET_H = 15;
const ENEMY_SIZE = 30;
const ENEMY_SPEED = 1.5;
const BULLET_SPEED = 8;
const PLAYER_SPEED = 7;

export const SpaceShooter = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  
  const state = useRef({
    px: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number; hp: number }[],
    score: 0,
    keys: {} as Record<string, boolean>,
    lastShot: 0
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    let rafId: number;
    const s = state.current;

    const reset = () => {
      s.px = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
      s.bullets = [];
      s.enemies = [];
      s.score = 0;
      s.keys = {};
      setScore(0);
    };

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Starfield (simple)
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 20; i++) {
        const x = (i * 37 + s.score * 5) % CANVAS_WIDTH;
        const y = (i * 73 + Date.now() * 0.05) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }

      if (gameState === 'start') {
        ctx.fillStyle = '#888';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE/TAP TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText('MOVE: ARROWS / GAMEPAD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        ctx.fillText('SHOOT: SPACE / TAP', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      }
      
      if (gameState === 'playing') {
        // Player movement
        if (s.keys['ArrowLeft'] || s.keys['a']) s.px = Math.max(0, s.px - PLAYER_SPEED);
        if (s.keys['ArrowRight'] || s.keys['d']) s.px = Math.min(CANVAS_WIDTH - PLAYER_SIZE, s.px + PLAYER_SPEED);
        
        // Shooting
        if ((s.keys[' '] || s.keys['ArrowUp'] || s.keys['w']) && Date.now() - s.lastShot > 150) {
          s.bullets.push({ x: s.px + PLAYER_SIZE / 2 - BULLET_W / 2, y: CANVAS_HEIGHT - 40 });
          s.lastShot = Date.now();
        }
        
        // Move bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          s.bullets[i].y -= BULLET_SPEED;
          if (s.bullets[i].y < -BULLET_H) s.bullets.splice(i, 1);
        }
        
        // Spawn enemies
        if (Math.random() < 0.015 + (s.score * 0.00005)) {
          s.enemies.push({ x: Math.random() * (CANVAS_WIDTH - ENEMY_SIZE), y: -ENEMY_SIZE, hp: 1 });
        }
        
        // Move enemies & Collisions
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          e.y += ENEMY_SPEED + (s.score * 0.005);
          
          if (e.y > CANVAS_HEIGHT) {
            setGameState('gameover');
          }
          
          // Player collision
          const py = CANVAS_HEIGHT - 35;
          if (
            s.px < e.x + ENEMY_SIZE && s.px + PLAYER_SIZE > e.x &&
            py < e.y + ENEMY_SIZE && py + PLAYER_SIZE > e.y
          ) {
            setGameState('gameover');
          }
          
          // Bullet collision
          for (let j = s.bullets.length - 1; j >= 0; j--) {
            const b = s.bullets[j];
            if (
              b.x < e.x + ENEMY_SIZE && b.x + BULLET_W > e.x &&
              b.y < e.y + ENEMY_SIZE && b.y + BULLET_H > e.y
            ) {
              s.bullets.splice(j, 1);
              e.hp--;
              if (e.hp <= 0) {
                s.enemies.splice(i, 1);
                s.score += 10;
                setScore(s.score);
                break;
              }
            }
          }
        }
      }
      
      // Draw Player
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.moveTo(s.px + PLAYER_SIZE/2, CANVAS_HEIGHT - 35);
      ctx.lineTo(s.px + PLAYER_SIZE, CANVAS_HEIGHT - 5);
      ctx.lineTo(s.px, CANVAS_HEIGHT - 5);
      ctx.fill();
      
      // Draw Bullets
      ctx.fillStyle = '#facc15';
      for (const b of s.bullets) {
        ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
      }
      
      // Draw Enemies
      ctx.fillStyle = '#ef4444';
      for (const e of s.enemies) {
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(e.x + ENEMY_SIZE, e.y);
        ctx.lineTo(e.x + ENEMY_SIZE/2, e.y + ENEMY_SIZE);
        ctx.fill();
      }
      
      if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HULL BREACH', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
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
      s.keys[e.key] = true;
      if (e.key === ' ' && gameState !== 'playing') {
        if (gameState === 'gameover') reset();
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
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative font-mono">
      <div className="absolute top-12 left-0 right-0 flex justify-center font-bold z-10 pointer-events-none" style={{ fontSize: '100px', opacity: 0.2 }}>
        <span className="text-cyan-400">{score}</span>
      </div>
      <button onClick={onExit} className="absolute top-8 right-8 text-gray-500 hover:text-white font-mono interactive z-20 text-xl tracking-widest border border-gray-800 px-6 py-2 bg-black/50 hover:bg-white hover:text-black transition-colors">
        [EXIT GAME]
      </button>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        className="bg-[#111] border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[90vw] max-h-[65vh] object-contain rounded-lg" 
      />
      <MobileGamepad left right action />
    </div>
  );
};
