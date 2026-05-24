import { useState, useEffect } from 'react';

export default function CyberGame() {
  const [score, setScore] = useState(0);
  const [activeNode, setActiveNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (!isPlaying) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveNode(null);
      return;
    }

    const interval = setInterval(() => {
      setActiveNode(Math.floor(Math.random() * 9));
    }, Math.max(300, 1000 - score * 40));

    return () => clearInterval(interval);
  }, [isPlaying, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
  };

  const handleNodeClick = (index) => {
    if (!isPlaying) return;
    if (index === activeNode) {
      setScore(s => s + 1);
      setActiveNode(null);
    } else {
      setScore(s => Math.max(0, s - 1)); // Penalty for missing
    }
  };

  return (
    <div className="border border-retro-border p-4 bg-[#1a1b1e]">
      <div className="flex justify-between items-start mb-4">
        <div className="text-xs">
          <p className="text-retro-gray mb-1">SYS.OP // NODE_HACK</p>
          <p className="text-white">
            {isPlaying ? `TIME: ${timeLeft}s | SCORE: ${score}` : `LAST SCORE: ${score}`}
          </p>
        </div>
        {!isPlaying && (
          <button onClick={startGame} className="text-retro-pink hover:text-white text-xs border border-retro-pink hover:bg-retro-pink/20 px-2 py-1 transition-colors">
            {timeLeft === 0 && score > 0 ? 'RETRY' : 'START'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-1 bg-retro-border p-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <button 
            key={index} 
            onClick={() => handleNodeClick(index)}
            className={`h-12 flex items-center justify-center transition-all duration-75 
              ${activeNode === index 
                ? 'bg-retro-pink shadow-[0_0_15px_rgba(243,66,127,0.8)]' 
                : 'bg-black hover:bg-white/5'}`}
          />
        ))}
      </div>
    </div>
  );
}
