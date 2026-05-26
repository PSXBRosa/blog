import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import InteractiveComment from './InteractiveComment';

export default function PostDetail({ post, onBack }) {
  const components = {
    a: (props) => {
      const { href, children } = props;
      if (href?.startsWith('#comment:')) {
        const comment = decodeURIComponent(href.slice(9));
        return <InteractiveComment comment={comment}>{children}</InteractiveComment>;
      }
      // eslint-disable-next-line no-unused-vars
      const { node, ...rest } = props;
      return <a {...rest} />;
    }
  };

  return (
    <div className="bg-retro-bg text-white max-w-4xl">
      <button onClick={onBack} className="text-retro-blue hover:text-white mb-10 text-xs font-black tracking-widest flex items-center gap-2 transition-colors cursor-pointer uppercase">
        ← BACK TO ARCHIVE
      </button>

      <img src={post.image} alt="Header" className="w-full h-80 object-cover border-b-8 border-retro-green mb-12 shadow-2xl" />
      
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-retro-yellow text-black text-[10px] font-black uppercase tracking-widest">{post.tag}</span>
          <span className="text-retro-gray text-[10px] font-bold uppercase tracking-widest">{post.date}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black italic mb-8 text-white leading-tight tracking-tighter uppercase">{post.title}</h2>
        <div className="w-full h-[2px] retro-stripes opacity-20"></div>
      </div>
      
      <div className="prose prose-invert prose-p:text-retro-gray prose-p:leading-relaxed prose-p:text-base prose-h2:text-white prose-h2:text-2xl prose-h2:font-black prose-h2:italic prose-a:text-retro-blue prose-strong:text-retro-yellow max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={components}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-20 pt-8 border-t border-retro-border flex flex-col gap-12 opacity-40">
        <div className="flex justify-between items-center w-full">
          <div className="w-12 h-2 retro-stripes"></div>
          <span className="text-[10px] font-black tracking-widest uppercase italic">End of Record</span>
        </div>
        
        <button 
          onClick={onBack} 
          className="self-center text-retro-blue hover:text-white text-xs font-black tracking-widest flex items-center gap-2 transition-colors cursor-pointer uppercase py-4 px-8 border-2 border-retro-blue hover:border-white"
        >
          ← RETURN TO ARCHIVE
        </button>
      </footer>
    </div>
  );
}
