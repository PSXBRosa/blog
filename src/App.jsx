import { useState, useEffect } from 'react';
import { getPosts } from './lib/posts';
import Hero from './components/layout/Hero';
import Sidebar from './components/layout/Sidebar';
import PostCard from './components/blog/PostCard';
import PostDetail from './components/blog/PostDetail';
import Footer from './components/layout/Footer';

const postsData = getPosts();
const POSTS_PER_PAGE = 3;

export default function App() {
  const [activePost, setActivePost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Simple routing logic
  useEffect(() => {
    const handleRouting = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const page = parseInt(searchParams.get('page')) || 1;
      setCurrentPage(page);

      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path && path !== 'blog') {
        // Support both /slug and /blog/slug for backward compatibility
        const slug = path.startsWith('blog/') ? path.substring(5) : path;
        const post = postsData.find(p => p.slug === slug);
        if (post) {
          setActivePost(post);
          // Small delay to allow PostDetail to render before scrolling
          setTimeout(() => {
            const content = document.getElementById('main-content');
            if (content) {
              const yOffset = -80; // Offset to account for the back button height
              const y = content.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 0);
        } else {
          setActivePost(null);
        }
      } else {
        setActivePost(null);
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  const handlePostClick = (post) => {
    setActivePost(post);
    window.history.pushState({}, '', `/blog/${post.slug}`);
    setTimeout(() => {
      const content = document.getElementById('main-content');
      if (content) {
        const yOffset = -80; // Offset to account for the back button height
        const y = content.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  };

  const handleHomeClick = () => {
    setActivePost(null);
    setCurrentPage(1);
    window.history.pushState({}, '', '/blog/');
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/blog/?page=${page}`);
    
    // Consistent smooth scroll to the top of the content area
    setTimeout(() => {
      const content = document.getElementById('main-content');
      if (content) {
        const yOffset = -20; // Slight offset for better visual framing
        const y = content.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  };

  // Pagination Logic
  const totalPages = Math.ceil(postsData.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = postsData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen font-mono text-sm tracking-wider flex flex-col">
      {/* Hero / Master Control Section */}
      <Hero activePost={activePost} onHomeClick={handleHomeClick} onPostClick={handlePostClick} />

      {/* Main Content Grid */}
      <main id="main-content" className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Content */}
        <div className="lg:w-2/3">
          {activePost ? (
            <PostDetail post={activePost} onBack={handleHomeClick} />
          ) : (
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-retro-yellow font-black italic text-sm tracking-[0.4em] uppercase">// LATEST_POSTS</h3>
                <div className="flex-grow h-[2px] retro-stripes opacity-30"></div>
              </div>
              <div className="flex flex-col gap-16">
                {currentPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={() => handlePostClick(post)} 
                  />
                ))}

                {postsData.length === 0 && (
                  <div className="text-retro-gray border border-retro-border p-8 text-center">
                    0 FILES FOUND IN /src/posts/
                  </div>
                )}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-20 pt-8 border-t-2 border-retro-border flex justify-between items-center">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'text-retro-blue hover:text-white cursor-pointer'}`}
                  >
                    ← PREV_SIDE
                  </button>
                  
                  <div className="flex gap-4">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 text-[10px] font-black border-2 transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-retro-yellow text-black border-retro-yellow' : 'border-retro-border text-retro-gray hover:border-retro-blue hover:text-retro-blue'}`}
                      >
                        {(i + 1).toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'text-retro-blue hover:text-white cursor-pointer'}`}
                  >
                    NEXT_SIDE →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <Sidebar />

      </main>

      <Footer />
    </div>
  );
}
