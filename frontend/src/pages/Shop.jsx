import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Star, SlidersHorizontal, Grid, List, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [concern, setConcern] = useState(searchParams.get('concern') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  
  // Layout View Style
  const [viewMode, setViewMode] = useState('grid'); // grid / list

  useEffect(() => {
    // Sync search params triggers
    const categoryParam = searchParams.get('category');
    setSelectedCategory(categoryParam || '');
    
    const concernParam = searchParams.get('concern');
    setConcern(concernParam || '');

    const tagParam = searchParams.get('tag');
    setSelectedTag(tagParam || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const catRes = await axios.get('/api/products/categories');
        if (catRes.data.success) setCategories(catRes.data.categories);
        const brandRes = await axios.get('/api/products/brands');
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (err) {
        console.error('Error fetching filters', err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `/api/products?sort=${sortBy}&maxPrice=${priceRange}`;
        if (selectedCategory) query += `&category=${selectedCategory}`;
        if (selectedBrand) query += `&brand=${selectedBrand}`;
        if (concern) query += `&concern=${encodeURIComponent(concern)}`;
        if (selectedTag) query += `&tag=${encodeURIComponent(selectedTag)}`;
        
        const searchParam = searchParams.get('search');
        if (searchParam) query += `&search=${encodeURIComponent(searchParam)}`;

        const res = await axios.get(query);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('API error, using mock products list...');
        // Fallback mock lists
        setProducts([
          { id: 1, name: 'Rice Water Face Serum', slug: 'rice-water-face-serum', rating: 4.8, min_price: 499, min_sale_price: 399, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop', concern: 'Glass Skin', category_name: 'Face Care', variants: [{ id: 1, sku: 'RW-SERUM-50ML', price: 499, sale_price: 399, size: 'Standard', volume: '50ml', stock: 10 }] },
          { id: 2, name: 'Vitamin C Face Wash', slug: 'vitamin-c-face-wash', rating: 4.6, min_price: 250, min_sale_price: 199, image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop', concern: 'Glow', category_name: 'Face Care', variants: [{ id: 4, sku: 'VC-WASH-100ML', price: 250, sale_price: 199, size: 'Standard', volume: '100ml', stock: 20 }] },
          { id: 3, name: 'De-Tan Face & Body Scrub', slug: 'de-tan-face-body-scrub', rating: 4.9, min_price: 380, min_sale_price: 299, image_url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop', concern: 'D-Tan', category_name: 'Body & Bath', variants: [{ id: 6, sku: 'DT-SCRUB-200G', price: 380, sale_price: 299, size: 'Standard', volume: '200g', stock: 15 }] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, concern, selectedTag, priceRange, sortBy, searchParams]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setConcern('');
    setSelectedTag('');
    setPriceRange(1000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="container py-12">
      {/* Title / Layout Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-wide">Skincare Shop</h1>
          {searchParams.get('search') && (
            <p className="text-xs text-gray-500 mt-2 font-semibold uppercase">
              Search results for: "{searchParams.get('search')}"
            </p>
          )}
          {selectedTag && (
            <p className="text-xs text-[#D4AF37] mt-2 font-semibold uppercase tracking-wider">
              Collection: {selectedTag}
            </p>
          )}
        </div>

        {/* View mode toggle & Sort */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#D4AF37] text-white' : 'text-gray-500'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#D4AF37] text-white' : 'text-gray-500'}`}
            >
              <List size={18} />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-700 bg-white"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Shop Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 self-start">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filter Products
            </h3>
            <button onClick={handleResetFilters} className="text-[0.65rem] text-[#D4AF37] font-bold uppercase tracking-wider hover:underline">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Categories</h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="accent-[#D4AF37]"
                />
                All Categories
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.slug}
                    onChange={() => setSelectedCategory(cat.slug)}
                    className="accent-[#D4AF37]"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Concern Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Skin Concern</h4>
            <div className="flex flex-col gap-2">
              {['', 'Glass Skin', 'D-Tan', 'Hydrating', 'Hair Fall'].map((c) => (
                <label key={c || 'all'} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="concern"
                    checked={concern === c}
                    onChange={() => setConcern(c)}
                    className="accent-[#D4AF37]"
                  />
                  {c || 'All Concerns'}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
              <span>Max Price</span>
              <span>₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[0.65rem] text-gray-400 font-bold mt-1">
              <span>₹100</span>
              <span>₹2000</span>
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Brand</h4>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === ''}
                    onChange={() => setSelectedBrand('')}
                    className="accent-[#D4AF37]"
                  />
                  All Brands
                </label>
                {brands.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b.slug}
                      onChange={() => setSelectedBrand(b.slug)}
                      className="accent-[#D4AF37]"
                    />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Side: Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="font-serif text-lg font-bold mb-2">No Products Found</h3>
              <p className="text-xs text-gray-500 mb-6">We couldn't find any products matching your filters.</p>
              <button onClick={handleResetFilters} className="btn btn-primary text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'flex flex-col gap-6'}>
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className={`vip-card bg-white flex cursor-pointer ${
                    viewMode === 'grid' ? 'flex-col h-full' : 'flex-col md:flex-row gap-6 p-4 items-center'
                  }`}
                  onClick={() => navigate(`/product/${prod.slug}`)}
                >
                  {/* Product Thumbnail */}
                  <div className={`relative overflow-hidden group ${
                    viewMode === 'grid' ? 'w-full h-72' : 'w-48 h-48 rounded-xl'
                  } bg-gray-50 flex-shrink-0`}>
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between h-full w-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[0.65rem] text-[#D4AF37] font-bold uppercase tracking-wider">{prod.category_name}</span>
                        <div className="flex items-center gap-1 text-[#FFC107] text-xs font-bold">
                          <Star size={12} className="fill-[#FFC107]" /> {prod.rating}
                        </div>
                      </div>
                      <h3 className="font-serif text-base font-bold text-gray-800 leading-tight mb-2 hover:text-[#D4AF37]">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Concern: {prod.concern || 'General'}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-gray-800">₹{prod.min_sale_price || prod.min_price}</span>
                        {prod.min_sale_price && (
                          <span className="text-xs text-gray-400 line-through">₹{prod.min_price}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod, prod.variants[0], 1);
                        }}
                        className="btn btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
                      >
                        <ShoppingBag size={12} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Shop;
