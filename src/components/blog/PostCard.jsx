export default function PostCard({ post, onClick }) {
  return (
    <article className="flex flex-col md:flex-row gap-6 group cursor-pointer" onClick={onClick}>
      <div className="w-full md:w-1/2 h-48 md:h-auto bg-cover bg-center border border-retro-border relative" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="absolute inset-0 bg-retro-pink/10 group-hover:bg-transparent transition-all duration-300"></div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center py-2">
        <div className="flex justify-between items-center mb-4 text-xs">
          <span className={`border px-2 py-1 ${post.tagColor}`}>{post.tag}</span>
          <span className="text-retro-gray">{post.date}</span>
        </div>
        <h4 className="text-xl font-bold mb-4 text-white group-hover:text-retro-pink transition-colors">{post.title}</h4>
        <p className="text-retro-gray mb-6 leading-relaxed text-xs">{post.excerpt}</p>
        <div className="mt-auto">
          <span className="text-retro-pink group-hover:text-white transition-colors">READ MORE →</span>
        </div>
      </div>
    </article>
  );
}
