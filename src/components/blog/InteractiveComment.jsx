import { useState, useEffect, useRef } from 'react';

export default function InteractiveComment({ children, comment }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef(null);

  const showComment = isHovered || isClicked;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <span 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        onClick={() => setIsClicked(!isClicked)}
        className={'inline-block font-bold cursor-help transition-colors ' + (showComment ? 'text-retro-yellow' : 'text-retro-blue underline decoration-dotted')}
      >
        {children}
      </span>
      
      {showComment && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-retro-bg border-2 border-retro-yellow shadow-2xl z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[11px] text-retro-yellow font-mono italic leading-snug">
            {comment}
          </p>
          <div className="absolute top-[calc(100%-7px)] left-1/2 -translate-x-1/2 w-3 h-3 bg-retro-bg border-r-2 border-b-2 border-retro-yellow rotate-45"></div>
        </div>
      )}
    </span>
  );
}
