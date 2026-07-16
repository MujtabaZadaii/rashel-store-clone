import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentStatus, setCommentStatus] = useState('');

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blogs/${slug}`);
        if (res.data.success) {
          setBlog(res.data.blog);
          setComments(res.data.comments || []);
        }
      } catch (err) {
        console.warn('API connection failed, loading mock blog detail...');
        setBlog({
          id: 1,
          title: 'Korean Rice Water: The Ultimate Glass Skin Guide',
          content: 'Fermented Rice Water (Sake extract) has been the cornerstone of Eastern skincare for centuries. Rich in amino acids, vitamin E, and antioxidant ferulic acid, it actively promotes collagen synthesis while soothing inflammatory breakouts. Combined with Niacinamide, it creates a powerful synergy that targets skin hyperpigmentation, blocks melanin transport, and shrinks dilated pores.\n\nTo achieve the glass skin look, formulate a routine where you apply the Rice Water serum after double cleansing but before locked-in oil emollients. Regular use ensures skin thickness and a highly reflective, smooth texture.',
          image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
          created_at: '2026-06-01'
        });
        setComments([
          { id: 1, author_name: 'Mira Dutt', comment: 'Loved reading this! Niacinamide and rice water together have really smoothed my forehead texture.', created_at: '2026-06-02' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authorName || !commentText) return;
    try {
      setCommentStatus('Posting comment...');
      const res = await axios.post('/api/blogs/comments', {
        blogId: blog.id,
        authorName,
        comment: commentText
      });
      if (res.data.success) {
        setComments([...comments, {
          id: Date.now(),
          author_name: authorName,
          comment: commentText,
          created_at: new Date().toISOString()
        }]);
        setAuthorName('');
        setCommentText('');
        setCommentStatus('Comment posted successfully!');
      }
    } catch (err) {
      setCommentStatus('Failed to post comment.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Article Not Found</h2>
        <Link to="/blogs" className="btn btn-primary text-xs">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-4xl">
      <Link to="/blogs" className="btn-text text-xs mb-8 flex items-center gap-1.5">
        <ArrowLeft size={14} /> Back to Articles
      </Link>

      <article className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm mb-12">
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mb-6">
          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User size={12} /> Dr. Rashel Research Lab</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-gray-800 leading-tight">
          {blog.title}
        </h1>

        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-[400px] object-cover rounded-2xl mb-8"
        />

        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>
      </article>

      {/* Comments section */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
        <h3 className="font-serif text-lg font-bold mb-8 text-gray-800 flex items-center gap-2">
          <MessageSquare size={18} /> Discussion ({comments.length})
        </h3>

        <div className="flex flex-col gap-6 mb-12">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No comments yet. Join the conversation below!</p>
          ) : (
            comments.map((comm) => (
              <div key={comm.id} className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-bold text-xs text-gray-800">{comm.author_name}</h5>
                  <span className="text-[0.65rem] text-gray-400">{new Date(comm.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-600">"{comm.comment}"</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleCommentSubmit} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 max-w-xl">
          <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-4">Leave a Comment</h4>
          
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control text-xs"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              placeholder="Join the discussion..."
              className="form-control text-xs"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary text-xs py-2 px-5">
            Post Comment
          </button>
          {commentStatus && <p className="text-[0.7rem] text-gray-500 mt-2 font-semibold">{commentStatus}</p>}
        </form>
      </section>
    </div>
  );
};

export default BlogDetail;
