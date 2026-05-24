import ReactMarkdown from 'react-markdown';

export default function PostDetail({ post, onBack }) {
  return (
    <div className="bg-retro-bg text-white">
      <button onClick={onBack} className="text-retro-gray hover:text-retro-pink mb-8 text-xs flex items-center gap-2 transition-colors cursor-pointer">
        ← BACK TO HOME
      </button>
      
      <img src={post.image} alt="Header" className="w-full h-64 object-cover border border-retro-border mb-8" />
      
      <div className="flex gap-4 items-center mb-6 text-xs">
        <span className={`border px-2 py-1 ${post.tagColor}`}>{post.tag}</span>
        <span className="text-retro-gray">{post.date}</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-8 text-white">{post.title}</h2>
      
      <div className="prose prose-invert prose-p:text-retro-gray prose-h1:text-white prose-h2:text-white prose-a:text-retro-pink max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
