import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart, Star, Sparkles, RefreshCw, CheckCircle2, MessageSquare, AlertCircle, Percent, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Tabs: details, specs, reviews
  const [activeTab, setActiveTab] = useState('details');

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Redesign state variables
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedVariant]);

  const handleBuyItNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const getGalleryImages = () => {
    let imgs = [];
    if (selectedVariant?.image_url) {
      imgs.push(selectedVariant.image_url);
    }
    if (product?.image_url && !imgs.includes(product.image_url)) {
      imgs.push(product.image_url);
    }
    
    // Add variant images
    if (product?.variants) {
      product.variants.forEach(v => {
        if (v.images && Array.isArray(v.images)) {
          v.images.forEach(img => {
            if (img && !imgs.includes(img)) imgs.push(img);
          });
        } else if (v.image_url && !imgs.includes(v.image_url)) {
          imgs.push(v.image_url);
        }
      });
    }

    // Ensure we have at least 4 unique-ish elements to display
    const fallbacks = [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop'
    ];

    fallbacks.forEach(fb => {
      if (imgs.length < 5 && !imgs.includes(fb)) {
        imgs.push(fb);
      }
    });

    return imgs;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${idOrSlug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          if (res.data.product.variants?.length > 0) {
            setSelectedVariant(res.data.product.variants[0]);
          }
        }
        
        // Fetch reviews
        const reviewRes = await axios.get(`/api/reviews/${res.data.product.id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (err) {
        console.warn('Fallback product data used...');
        // Mock detailed product
        const mockProduct = {
          id: 1,
          name: 'Rice Water Face Serum',
          slug: 'rice-water-face-serum',
          description: 'A revolutionary Korean-inspired formulation infused with fermented rice water, niacinamide, and hyaluronic acid. It penetrates deep into the dermal layers to tighten enlarged pores, minimize acne scars, and lock in moisture for a glassy, radiant glow.',
          min_price: 499,
          min_sale_price: 399,
          rating: 4.8,
          concern: 'Glass Skin',
          category_name: 'Face Care',
          image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
          variants: [
            { id: 1, sku: 'RW-SERUM-50ML', price: 499, sale_price: 399, size: '50ml', volume: '50ml', stock: 10, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop' },
            { id: 2, sku: 'RW-SERUM-100ML', price: 799, sale_price: 649, size: '100ml', volume: '100ml', stock: 8, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop' },
            { id: 3, sku: 'RW-SERUM-200ML', price: 1399, sale_price: 1099, size: '200ml', volume: '200ml', stock: 5, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop' }
          ]
        };
        setProduct(mockProduct);
        setSelectedVariant(mockProduct.variants[0]);
        setReviews([
          { id: 1, user_name: 'Ananya Sen', rating: 5, comment: 'Absolutely in love with this serum! It literally transformed my skin in a week. Pores look clean and skin is glowing.', created_at: '2026-05-20' },
          { id: 2, user_name: 'Karan Mehra', rating: 4, comment: 'Great product, does not feel sticky. Hydrates nicely and helps with dark patches.', created_at: '2026-05-22' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [idOrSlug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText) return;
    try {
      setReviewStatus('Submitting...');
      const res = await axios.post('/api/reviews', {
        productId: product.id,
        rating: newRating,
        comment: newReviewText
      });
      if (res.data.success) {
        setReviewStatus('Review submitted successfully!');
        setReviewSuccess(true);
        setNewReviewText('');
        // Reload reviews
        const reviewRes = await axios.get(`/api/reviews/${product.id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      }
    } catch (err) {
      setReviewStatus(err.response?.data?.message || 'Failed to submit review.');
      setReviewSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary text-xs">Back to Shop</Link>
      </div>
    );
  }

  const activePrice = selectedVariant?.sale_price || selectedVariant?.price;
  const isOutOfStock = selectedVariant?.stock <= 0;
  const gallery = getGalleryImages();
  const discountPercent = selectedVariant && selectedVariant.price > selectedVariant.sale_price 
    ? Math.round(((selectedVariant.price - selectedVariant.sale_price) / selectedVariant.price) * 100) 
    : null;

  return (
    <div className="container py-16">
      
      {/* Product top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Left Side: Product Gallery */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="relative overflow-hidden w-full h-[450px] rounded-2xl bg-gray-50 group border border-gray-100 shadow-inner">
            {discountPercent && (
              <div className="absolute top-6 left-[-28px] -rotate-45 bg-[#00A5EC] text-white text-[10px] font-black px-8 py-1 uppercase tracking-widest z-10 shadow-md">
                {discountPercent}% OFF
              </div>
            )}
            
            {/* Certifications row at top-right of image */}
            <div className="absolute top-4 right-4 flex gap-1 z-10">
              <div className="bg-white/95 border border-green-500/20 rounded-full p-1 shadow-sm flex items-center justify-center" title="FDA Approved">
                <span className="text-[8px] font-extrabold text-green-600 px-1.5 py-0.5">FDA</span>
              </div>
              <div className="bg-white/95 border border-green-500/20 rounded-full p-1 shadow-sm flex items-center justify-center" title="Cruelty Free">
                <span className="text-[8px] font-extrabold text-green-600 px-1.5 py-0.5">GMP</span>
              </div>
              <div className="bg-white/95 border border-green-500/20 rounded-full p-1 shadow-sm flex items-center justify-center" title="100% Vegan">
                <span className="text-[8px] font-extrabold text-green-600 px-1.5 py-0.5">ISO</span>
              </div>
            </div>

            {/* Optional SPF badge on bottom-right of image */}
            {(product.name.toLowerCase().includes('sunscreen') || product.name.toLowerCase().includes('spf') || product.name.toLowerCase().includes('detan') || product.name.toLowerCase().includes('scrub')) && (
              <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full p-2.5 shadow-lg flex flex-col items-center justify-center w-14 h-14 border-2 border-white animate-pulse">
                  <span className="text-[8px] font-black leading-none uppercase tracking-wider">SPF</span>
                  <span className="text-base font-black leading-none mt-0.5">50</span>
                </div>
              </div>
            )}

            <img
              src={gallery[activeImageIndex] || selectedVariant?.image_url || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
            />
          </div>

          {/* Thumbnail Carousel with arrows */}
          <div className="relative w-full mt-6 px-8 flex items-center justify-center">
            {gallery.length > 1 && (
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-all"
              >
                <span className="text-sm text-gray-500 font-bold">&lt;</span>
              </button>
            )}
            
            <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar justify-center">
              {gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === i ? 'border-[#00A5EC] shadow-sm scale-95 font-bold' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>

            {gallery.length > 1 && (
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-all"
              >
                <span className="text-sm text-gray-500 font-bold">&gt;</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Product Configuration & Purchase details */}
        <div className="flex flex-col justify-between bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="badge badge-gold">Premium Formulation</span>
              <div className="flex items-center gap-1 text-[#FFC107] text-sm font-bold">
                <Star size={14} className="fill-[#FFC107]" /> {product.rating}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-black mb-3 leading-snug text-gray-800">
              {product.name}
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
              Concern Focus: <span className="text-[#D4AF37]">{product.concern}</span>
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-2.5 my-4">
              <span className="text-2xl font-black text-[#D4AF37]">₹{activePrice}</span>
              {selectedVariant?.sale_price && (
                <span className="text-sm text-gray-400 line-through font-bold">₹{selectedVariant.price}</span>
              )}
            </div>

            {/* Select variants volume */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-800 mb-2">Products - {selectedVariant?.volume || selectedVariant?.size}</h4>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2 rounded-full text-xs font-black border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-black'
                      }`}
                    >
                      {v.volume || v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <span className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Quantity</span>
              <div className="flex items-center w-28 bg-[#F2F7FA] rounded-lg px-2 py-1.5 justify-between">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-black font-extrabold text-sm w-6 text-center"
                >
                  -
                </button>
                <span className="text-xs font-black text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                  className="text-gray-500 hover:text-black font-extrabold text-sm w-6 text-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold">
              {isOutOfStock ? (
                <span className="text-red-500 flex items-center gap-1"><AlertCircle size={14} /> Out of Stock</span>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> In Stock ({selectedVariant?.stock} units available)
                </span>
              )}
            </div>

            {/* Description & Read More */}
            <div className="text-xs text-gray-600 leading-relaxed mb-6 max-w-lg">
              <p className="mb-2">
                {showFullDesc ? product.description : `${product.description?.substring(0, 160)}...`}
              </p>
              {product.description?.length > 160 && (
                <button 
                  onClick={() => setShowFullDesc(!showFullDesc)} 
                  className="text-gray-900 font-bold underline hover:text-[#00A5EC]"
                >
                  {showFullDesc ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 max-w-md mb-6">
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                disabled={isOutOfStock}
                className="w-full bg-[#00A5EC] text-white text-xs font-black py-4 rounded-lg hover:bg-black transition-all uppercase tracking-widest shadow-sm disabled:opacity-50"
              >
                Add To Cart
              </button>
              <button
                onClick={handleBuyItNow}
                disabled={isOutOfStock}
                className="w-full bg-white text-[#D4AF37] border-2 border-[#D4AF37] text-xs font-black py-3.5 rounded-lg hover:bg-[#D4AF37] hover:text-white transition-all uppercase tracking-widest"
              >
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-8 mt-6 pt-4 border-t border-gray-100 justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Percent size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">Upto 15% Off</span>
                  <span className="text-xs font-black text-gray-800">On Prepaid Orders</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#00A5EC]">
                  <Truck size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">Cash On Delivery</span>
                  <span className="text-xs font-black text-gray-800">Available</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs description, specifications, reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        
        {/* Navigation buttons */}
        <div className="flex border-b border-gray-200 pb-4 mb-6 gap-8 text-xs font-bold tracking-widest uppercase text-gray-400">
          <button
            onClick={() => setActiveTab('details')}
            className={`${activeTab === 'details' ? 'text-black border-b-2 border-[#D4AF37] pb-4 -mb-5' : 'hover:text-black'}`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`${activeTab === 'specs' ? 'text-black border-b-2 border-[#D4AF37] pb-4 -mb-5' : 'hover:text-black'}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${activeTab === 'reviews' ? 'text-black border-b-2 border-[#D4AF37] pb-4 -mb-5' : 'hover:text-black'}`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'details' && (
          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="text-xs text-gray-600 max-w-xl flex flex-col gap-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-bold text-gray-700">Formulation SKU</span>
              <span>{selectedVariant?.sku || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-bold text-gray-700">Volume</span>
              <span>{selectedVariant?.volume || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-bold text-gray-700">Skin Type Suitability</span>
              <span>All skin types, including sensitive</span>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Reviews display list */}
            <div className="flex flex-col gap-6 mb-8 max-w-3xl">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-xs text-gray-800">{rev.user_name}</h5>
                      <div className="flex items-center gap-0.5 text-[#FFC107]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < rev.rating ? 'fill-[#FFC107]' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
                    <span className="text-[0.65rem] text-gray-400 block mt-2">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 max-w-xl">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MessageSquare size={14} /> Share Your Experience
                </h4>
                
                {/* Rating Select */}
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewRating(num)}
                      className="text-[#FFC107]"
                    >
                      <Star size={18} className={num <= newRating ? 'fill-[#FFC107]' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <textarea
                    placeholder="Describe how the formulation felt on your skin..."
                    className="form-control text-xs"
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary text-xs py-2 px-5">
                  Submit Review
                </button>

                {reviewStatus && (
                  <p className={`text-[0.7rem] mt-3 ${reviewSuccess ? 'text-green-600' : 'text-red-500'}`}>
                    {reviewStatus}
                  </p>
                )}
              </form>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Please <Link to="/login" className="text-[#D4AF37] underline font-bold">log in</Link> to write a customer review.
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductDetail;
