import React, { useEffect, useState } from 'react';
import { Github } from 'lucide-react';
import { portfolioConfig } from '../config';

export const GithubStats = () => {
  const [stats, setStats] = useState<{ followers: number; public_repos: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${portfolioConfig.github.username}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        setStats({
          followers: data.followers,
          public_repos: data.public_repos
        });
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div 
      onClick={() => window.open(portfolioConfig.github.url, '_blank')}
      className="fixed bottom-4 right-4 z-50 font-mono text-[10px] hidden md:flex flex-col gap-2 p-3 text-gray-500 w-48 mix-blend-difference pointer-events-auto interactive cursor-pointer hover:border-blue-500 transition-colors group glass-panel"
    >
      <div className="flex items-center gap-2 mb-1 border-b border-[#333] pb-1 text-gray-400 group-hover:text-blue-400 transition-colors">
        <Github size={10} className="text-blue-500" />
        <span>GITHUB_STATS</span>
      </div>
      
      {loading ? (
        <div className="text-yellow-400 animate-pulse">FETCHING_DATA...</div>
      ) : error || !stats ? (
        <div className="text-red-500">API_RATE_LIMIT_EXCEEDED</div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>REPOSITORIES</span>
              <span className="text-cyan-400">{stats.public_repos}</span>
            </div>
            <div className="w-full bg-[#111] h-1">
              <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(100, (stats.public_repos / 50) * 100)}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between">
              <span>FOLLOWERS</span>
              <span className="text-pink-500">{stats.followers}</span>
            </div>
            <div className="w-full bg-[#111] h-1">
              <div className="bg-pink-500 h-full" style={{ width: `${Math.min(100, (stats.followers / 20) * 100)}%` }} />
            </div>
          </div>
          
          <div className="text-[9px] mt-2 text-gray-600 text-center uppercase tracking-widest group-hover:text-blue-400 transition-colors">
            @{portfolioConfig.github.username}
          </div>
        </>
      )}
    </div>
  );
};
