export default function PostCard({ post, onClick }) {
  return (
    <article className="flex flex-col md:flex-row gap-8 group cursor-pointer" onClick={onClick}>
      <div className="w-full md:w-1/2 h-64 bg-cover bg-center border-2 border-retro-border relative group-hover:border-retro-blue transition-all shadow-lg" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="absolute inset-0 bg-retro-green/10 group-hover:bg-transparent transition-all duration-300"></div>
        <div className="absolute bottom-4 right-4 w-12 h-2 retro-stripes opacity-70"></div>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-4 text-[10px] font-black tracking-[0.2em] uppercase">
          <span className="text-retro-yellow">{post.tag}</span>
          <span className="text-retro-gray opacity-60">{post.date}</span>
        </div>
        
        <h4 className="text-2xl font-black italic mb-4 text-white group-hover:text-retro-yellow transition-colors leading-tight uppercase tracking-tight">
          {post.title}
        </h4>
        
        <p className="text-retro-gray mb-6 leading-relaxed text-xs opacity-80 line-clamp-3 font-medium">
          {post.excerpt}
        </p>
        
        <div className="mt-auto flex items-center gap-4">
          <span className="text-retro-blue font-black text-[10px] tracking-widest group-hover:underline decoration-2 underline-offset-4 transition-all">READ MORE →</span>
          <div className="flex-grow h-[1px] bg-retro-border"></div>
        </div>
      </div>
    </article>
  );
}
