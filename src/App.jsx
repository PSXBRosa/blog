import { useState } from 'react';
import { getPosts } from './lib/posts';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Hero from './components/layout/Hero';
import PostCard from './components/blog/PostCard';
import PostDetail from './components/blog/PostDetail';

const postsData = getPosts();

export default function App() {
  const [activePost, setActivePost] = useState(null);

  const handleHomeClick = () => setActivePost(null);

  return (
    <div className="min-h-screen font-mono text-sm tracking-wider flex flex-col">
      <Header activePost={activePost} onHomeClick={handleHomeClick} />

      {/* Hero Section - only on home */}
      {!activePost && <Hero />}

      {/* Main Content Grid */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Content */}
        <div className="lg:w-2/3">
          {activePost ? (
            <PostDetail post={activePost} onBack={handleHomeClick} />
          ) : (
            <div className="mt-12">
              <h3 className="text-retro-gray mb-8">// LATEST POSTS</h3>
              <div className="flex flex-col gap-12">
                {postsData.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={() => setActivePost(post)} 
                  />
                ))}

                {postsData.length === 0 && (
                  <div className="text-retro-gray border border-retro-border p-8 text-center">
                    0 FILES FOUND IN /src/posts/
                  </div>
                )}
              </div>
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
