import heroImg from '../../assets/hero.jpg';
import { getPosts } from '../../lib/posts';

export default function Hero({ onHomeClick, onPostClick }) {
  const posts = getPosts();

  return (
    <section className="bg-retro-bg border-b-2 border-retro-border relative overflow-hidden min-h-[350px] flex">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-retro-bg via-retro-bg/90 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-10 flex flex-col justify-center">
        
        {/* Main Branding Row */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.2em] uppercase text-retro-gray">
            <span className="text-retro-blue">SYS_READY</span>
            <span className="opacity-20">//</span>
            <span className="text-retro-yellow">MASTER_CTRL_v2.6</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none cursor-pointer uppercase text-white drop-shadow-2xl" onClick={onHomeClick}>
            PEDRO <span className="text-retro-yellow">ROSA</span><span className="text-retro-blue not-italic">.</span>
          </h1>
        </div>

        {/* Maximalist Linear Post Explorer */}
        <div className="w-full md:w-10/12 lg:w-8/12 mt-4">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black tracking-widest text-retro-yellow uppercase">Linear Post Explorer</span>
              <div className="hidden sm:flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-retro-blue/30 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-retro-gray uppercase tracking-widest">Index_ID</span>
                <span className="text-[10px] font-black text-white italic">#{posts.length.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-retro-gray uppercase tracking-widest">Tape_Time</span>
                <span className="text-[10px] font-black text-white italic">{(posts.length * 7.5).toFixed(1)}m</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-14 flex items-start gap-1">
            <div className="absolute top-7 left-0 w-full h-[1px] bg-retro-border"></div>
            {posts.map((post, i) => {
              const dateParts = post.date.split(' ');
              const month = dateParts[0].substring(0, 3).toUpperCase();
              const year = dateParts[dateParts.length - 1];
              return (
                <div key={post.id} className="relative flex-grow group/post cursor-pointer" onClick={() => onPostClick(post)}>
                  <div className="absolute -top-4 left-0 flex flex-col items-start leading-none opacity-60 group-hover/post:opacity-100 transition-opacity">
                    <span className="text-[7px] font-black text-white/50 group-hover/post:text-retro-blue">{month}</span>
                    <span className="text-[8px] font-black text-retro-yellow/60 group-hover/post:text-retro-yellow">{year}</span>
                  </div>
                  <div className="w-[1px] h-2 bg-retro-border mb-0.5 mt-6"></div>
                  <div className="h-2.5 bg-retro-border/20 group-hover/post:bg-retro-blue/40 transition-all border-r border-retro-bg relative">
                    <div className="absolute inset-0 w-full h-[1px] bg-retro-green/30 mt-0.5"></div>
                    <div className="absolute -bottom-10 left-0 opacity-0 group-hover/post:opacity-100 transition-all whitespace-nowrap z-20 pointer-events-none">
                      <div className="bg-black border border-retro-blue p-2 shadow-2xl">
                        <div className="text-[7px] text-retro-blue font-black uppercase tracking-widest mb-1">DATA_STREAM_{i.toString().padStart(2, '0')}</div>
                        <div className="text-[9px] font-black text-white uppercase">{post.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Industrial Side-Label */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden lg:block origin-right rotate-90 opacity-20">
        <span className="text-[8px] font-black text-retro-border uppercase tracking-[1em]">Automated_Processing_Unit // v.0.24</span>
      </div>
    </section>
  );
}
