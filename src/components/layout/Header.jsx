export default function Header({ onHomeClick, activePost }) {
  return (
    <>
      {/* Top Thin Bar */}
      <div className="bg-retro-bg text-retro-gray border-b border-retro-border flex flex-col sm:flex-row justify-between items-center px-4 py-2 text-xs">
        <div className="flex gap-4 text-retro-teal">
          BLOG STATUS: ONLINE
        </div>
        <div className="hidden md:block">PERSONAL BLOG // THOUGHTS, NOTES & OBSERVATIONS</div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <input type="text" placeholder="Search posts..." className="bg-transparent border-b border-retro-gray focus:outline-none focus:border-retro-pink text-white w-32 transition-colors" />
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-retro-header text-black grid grid-cols-1 md:grid-cols-4 items-center border-b border-retro-border">
        <div className="p-3 md:col-span-1 border-b md:border-b-0 md:border-r border-black/20">
          <h1 className="text-2xl font-black tracking-tighter">
            PEDRO <span className="text-retro-pink">ROSA</span>
          </h1>
        </div>
        <nav className="p-3 md:col-span-2 flex flex-wrap gap-6 justify-center md:justify-start text-xs font-bold border-b md:border-b-0 md:border-r border-black/20">
          <button 
            onClick={onHomeClick} 
            className={`pb-1 ${!activePost ? 'border-b-2 border-retro-pink' : 'hover:text-retro-pink transition-colors cursor-pointer'}`}
          >
            HOME
          </button>
        </nav>
        <div className="p-3 md:col-span-1 flex items-center justify-center md:justify-end gap-4 text-xs font-bold">
          <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[10px]">🌐</div>
          <div className="leading-tight text-[10px]">EST.<br/>2024</div>
        </div>
      </header>
    </>
  );
}
