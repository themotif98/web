import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Clock, ArrowLeft, Heart, Sparkles, Send } from 'lucide-react';
import { BlogPost } from '../types';
import { blogPosts } from '../data/blog';

export default function BlogView() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsEmail('');
    }
  };

  return (
    <div id="blog-view-container" className="font-sans bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold flex items-center justify-center gap-1.5">
            <BookOpen size={14} />
            <span>Botanical Chronicles</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-forest">The Editorial Magazine</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-xs md:text-sm text-charcoal/60 max-w-xl mx-auto leading-relaxed">
            Delve into multi-generational tales of Ceylon’s spice routes, healing bio-chemical studies, and original culinary notes directly from origin gardens.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedPost ? (
            // LIST STATE
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="group bg-white rounded-none overflow-hidden border border-gold/15 shadow-md hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-charcoal/40 font-mono">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-forest group-hover:text-gold transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-xs text-charcoal/60 leading-relaxed font-light line-clamp-3">{post.excerpt}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-2">
                        <span className="text-[10px] text-gold uppercase tracking-luxury font-bold group-hover:underline">Read Dispatch →</span>
                        <button
                          id={`btn-blog-like-${post.id}`}
                          onClick={(e) => handleLike(post.id, e)}
                          className="flex items-center gap-1 text-[10px] text-gold font-bold hover:text-forest"
                        >
                          <Heart size={12} className={likes[post.id] ? 'fill-gold' : ''} />
                          <span>{(post.likes || 120) + (likes[post.id] || 0)}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* In-Grid Magazine Newsletter Callout */}
              <div className="bg-forest text-ivory p-8 rounded-none border border-gold/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,164,75,0.1),transparent)] pointer-events-none" />
                <div className="space-y-2 max-w-xl text-center lg:text-left">
                  <span className="text-xs uppercase tracking-luxury text-gold font-bold">STAY INSPIRED</span>
                  <h4 className="font-serif font-bold text-xl md:text-2xl text-white">Join the Botanical Dispatch</h4>
                  <p className="text-xs text-ivory/70 leading-relaxed font-light">
                    Get premium articles, health studies, rare harvest notifications, and curated recipes delivered twice a month. Zero spam, ever.
                  </p>
                </div>

                <div className="w-full lg:w-96">
                  {newsletterSubscribed ? (
                    <div className="p-4 bg-white/5 border border-gold/40 text-gold rounded-none text-center text-xs animate-fade-in font-bold">
                      ✔ Welcome to the Circle. Check your inbox for secret recipes.
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex border-b border-white/20 pb-2 gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Enter your private email"
                        value={newsEmail}
                        onChange={(e) => setNewsEmail(e.target.value)}
                        className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-white/30"
                      />
                      <button type="submit" className="text-gold hover:text-white transition-colors p-1" aria-label="Subscribe">
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            // DETAIL READER STATE
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Back button */}
              <button
                id="btn-close-blog-reader"
                onClick={() => setSelectedPost(null)}
                className="group flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:text-forest font-bold"
              >
                <span>← Back to Chronicles</span>
              </button>

              <article className="bg-white rounded-none border border-gold/15 shadow-lg p-6 md:p-12 space-y-6">
                {/* Visual */}
                <div className="aspect-[21/9] rounded-none overflow-hidden border border-gold/15 relative">
                  <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                </div>

                {/* Meta */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-charcoal/40 font-mono uppercase">
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime} Read</span>
                  </div>
                  <h2 className="font-serif font-bold text-2xl md:text-4xl text-forest leading-snug">{selectedPost.title}</h2>
                  <div className="flex items-center gap-2 pt-2 border-t border-b border-gold/10 py-3 text-xs">
                    <span className="font-bold text-forest">Written by Ceyvana Culinary Board</span>
                    <span className="text-charcoal/30">•</span>
                    <span className="text-gold">Verified Sourcing Dispatch</span>
                  </div>
                </div>

                {/* Elegant content reader */}
                <div className="text-xs md:text-sm text-charcoal/80 leading-relaxed font-light space-y-6 pt-4">
                  {selectedPost.content.split('\n\n').map((para, i) => (
                    <p key={i} className="first-letter:text-2xl first-letter:font-serif first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:font-bold first-letter:leading-none">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Bottom liking and sharing section */}
                <div className="flex justify-between items-center border-t border-gold/10 pt-6 mt-8">
                  <button
                    id="btn-blog-reader-like"
                    onClick={(e) => handleLike(selectedPost.id, e)}
                    className="flex items-center gap-2 text-xs text-gold font-bold bg-ivory border border-gold/15 px-4 py-2 rounded-none hover:bg-gold/10 transition-colors"
                  >
                    <Heart size={14} className={likes[selectedPost.id] ? 'fill-gold' : ''} />
                    <span>Applaud dispatch ({(selectedPost.likes || 120) + (likes[selectedPost.id] || 0)})</span>
                  </button>
                  <span className="text-[10px] text-charcoal/40 uppercase tracking-luxury font-mono">ID: {selectedPost.id}</span>
                </div>

              </article>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
