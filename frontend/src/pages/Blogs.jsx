import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowRight, RefreshCw } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blogs');
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.warn('API connection failed, loading mock blogs...');
        setBlogs([
          {
            id: 1,
            title: 'Korean Rice Water: The Ultimate Glass Skin Guide',
            slug: 'korean-rice-water-glass-skin-guide',
            excerpt: 'Uncover the ancient beauty secrets of rice ferment filtrates and learn how they fade dark spots, minimize pores, and restore a luminous glassy sheen.',
            image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
            created_at: '2026-06-01'
          },
          {
            id: 2,
            title: 'Vitamin C vs Niacinamide: Which Is Best for Glow?',
            slug: 'vitamin-c-vs-niacinamide-for-glow',
            excerpt: 'Confused between Vitamin C and Niacinamide? Our formulation experts break down the difference, explaining how to layer them for a bright complexion.',
            image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
            created_at: '2026-05-28'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2 block">SKINCARE DISCOVERIES</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Rashel Journal</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Stay informed with skincare advice, formulation deep-dives, and guides written by our botanical research scientists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((post) => (
          <div key={post.id} className="vip-card bg-white flex flex-col h-full">
            <div className="h-64 overflow-hidden bg-gray-50">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold mb-3">
                  <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-800 leading-tight mb-3 hover:text-[#D4AF37] transition-all">
                  <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>
              <Link to={`/blogs/${post.slug}`} className="btn-text">
                Read Article <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
