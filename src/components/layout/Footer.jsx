export default function Footer() {
  return (
    <footer className="border-t-4 border-retro-border bg-retro-bg text-[10px] font-bold text-retro-gray p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 mt-24">
      <div className="flex items-center gap-6">
        <div className="w-10 h-10 retro-stripes flex items-center justify-center p-1">
          <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs italic">PR</div>
        </div>
        <div className="tracking-widest italic uppercase">PEDRO ROSA // 2026</div>
      </div>
    </footer>
  );
}
