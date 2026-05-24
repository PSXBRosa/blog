export default function Footer() {
  return (
    <footer className="border-t border-retro-border text-xs text-retro-gray p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full border border-retro-gray flex items-center justify-center text-white">🌐</div>
        <div>PEDRO ROSA // BLOG</div>
      </div>
      <div className="text-center">
        © 2026 PEDRO <span className="text-retro-pink">ROSA</span><br/>ALL RIGHTS RESERVED.
      </div>
      <div className="flex items-center gap-8">
        <span>KEEP EXPLORING</span>
        <span className="text-retro-pink flex items-center gap-2 font-bold"><span className="w-2 h-2 bg-retro-pink rounded-full animate-pulse"></span> LIVE</span>
      </div>
    </footer>
  );
}
