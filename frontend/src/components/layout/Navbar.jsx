import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, LogOut, Menu, X, ArrowRight, ShieldCheck, Truck, Sparkles, Instagram, Facebook, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, wishlist, toggleCart, toggleWishlist } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const navigate = useNavigate();

  // Announcement Banner rotations
  const announcements = [
    { text: "VIP ACCESS: EXTRA 20% OFF BEST SELLERS — CODE: VIPGLOW", icon: <Sparkles size={12} className="text-[#D4AF37]" /> },
    { text: "COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹999", icon: <Truck size={12} className="text-[#D4AF37]" /> },
    { text: "100% CLINICALLY PROVEN VEGAN & BOTANICAL FORMULATIONS", icon: <ShieldCheck size={12} className="text-[#D4AF37]" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleQuickSearch = (query) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      
      {/* 1. Dynamic Luxury Announcement Bar (letter-spacing adjusted for mobile to prevent overflow) */}
      <div className="bg-black text-[0.55rem] md:text-[0.65rem] tracking-[0.02em] md:tracking-[0.2em] font-bold text-center text-white py-2.5 uppercase border-b border-[#D4AF37]/10 flex items-center justify-center gap-2 px-4 transition-all duration-500">
        {announcements[announcementIndex].icon}
        <span className="transition-all duration-500 ease-in-out">
          {announcements[announcementIndex].text}
        </span>
      </div>

      {/* 2. Main Luxury Golden-Yellow Navbar */}
      <div className="bg-[#FFD200] border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300 py-3 md:py-4">
        <div className="container flex items-center justify-between gap-4">
          
          {/* Left: Menu & Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 rounded-xl bg-black/5 border border-black/10 text-black hover:bg-black/10 transition-all" 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={18} />
            </button>

            <Link to="/" className="flex flex-col items-start group">
              <span className="text-lg md:text-2xl font-black tracking-[0.12em] text-black font-serif leading-none transition-opacity group-hover:opacity-80">
                DR.RASHEL<span className="text-black">®</span>
              </span>
              <span className="text-[0.5rem] md:text-[0.55rem] tracking-[0.35em] font-bold uppercase text-black/60 mt-1">
                Botanical Elixirs
              </span>
            </Link>
          </div>

          {/* Center: Desktop Luxury Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-[0.68rem] tracking-[0.2em] uppercase text-black">
            <Link to="/shop?category=face-care" className="relative py-1.5 transition-colors hover:text-black/70 group">
              Face Care
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-8"></span>
            </Link>
            <Link to="/shop?category=body-bath" className="relative py-1.5 transition-colors hover:text-black/70 group">
              Body & Bath
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-8"></span>
            </Link>
            <Link to="/shop?category=hair-care" className="relative py-1.5 transition-colors hover:text-black/70 group">
              Hair Care
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-8"></span>
            </Link>
            <Link to="/shop?category=offers" className="relative py-1.5 transition-colors hover:text-black/70 group text-black">
              Offers
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-8"></span>
            </Link>
            <Link to="/blogs" className="relative py-1.5 transition-colors hover:text-black/70 group">
              Journal
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-8"></span>
            </Link>
          </nav>

          {/* Right: Controls & Badges */}
          <div className="flex items-center gap-1.5 md:gap-3 text-black">
            
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-black/5 text-black hover:text-black/70 transition-all"
              title="Search"
            >
              <Search size={18} />
            </button>

            <span className="hidden sm:inline w-[1px] h-4 bg-black/10"></span>

            {/* Auth Link / Account */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link 
                  to={user.role !== 'user' ? '/admin' : '/dashboard'} 
                  className="flex items-center gap-1.5 p-2 rounded-full hover:bg-black/5 text-black hover:text-black/70 transition-all"
                  title="My Account"
                >
                  <User size={18} />
                  <span className="hidden lg:inline text-[0.65rem] font-bold uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2 rounded-full hover:bg-black/5 text-black/60 hover:text-black transition-all" 
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:inline-flex p-2 rounded-full hover:bg-black/5 text-black hover:text-black/70 transition-all" 
                title="Login / Register"
              >
                <User size={18} />
              </Link>
            )}

            {/* Wishlist Indicator */}
            <button 
              className="hidden sm:inline-flex relative p-2 rounded-full hover:bg-black/5 text-black hover:text-black/70 transition-all" 
              onClick={() => toggleWishlist(true)}
              title="Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[0.5rem] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Premium Black Cart Button */}
            <button 
              className="relative p-2.5 rounded-full bg-black text-white hover:bg-black/90 transition-all duration-300 flex items-center justify-center" 
              onClick={() => toggleCart(true)}
              title="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[0.55rem] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border border-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Ultra-Modern Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-start pt-24 px-6 md:px-24">
          <button 
            className="absolute top-8 right-8 text-white/60 hover:text-white p-3 rounded-full border border-white/10 hover:border-white/30 transition-all duration-300"
            onClick={() => setIsSearchOpen(false)}
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-[#D4AF37] text-[0.7rem] font-bold tracking-[0.3em] uppercase mb-4">DR.RASHEL BOTANICALS</p>
            <form onSubmit={handleSearchSubmit} className="relative border-b border-white/20 pb-4 mb-8 focus-within:border-[#D4AF37] transition-all duration-300">
              <input 
                type="text"
                autoFocus
                placeholder="WHAT SKINCARE SECRETS ARE YOU SEEKING?"
                className="w-full bg-transparent text-white font-serif text-2xl md:text-4xl outline-none placeholder-white/20 uppercase tracking-wide"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#D4AF37] transition-all">
                <ArrowRight size={28} />
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/80">
              <div>
                <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#D4AF37]">VIP TRENDING SEARCHES</h4>
                <div className="flex flex-wrap gap-2.5">
                  {['Rice Water Serum', 'Vitamin C Wash', 'De-Tan Scrub', 'Glass Skin', 'Sunscreen', 'Anti-Aging'].map((tag) => (
                    <button 
                      key={tag}
                      onClick={() => handleQuickSearch(tag)}
                      className="text-[0.65rem] font-bold tracking-wider uppercase bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white px-4 py-2 rounded-full transition-all duration-300"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#D4AF37]">VIP SPECIAL OFFERS</h4>
                <ul className="space-y-3.5 text-xs text-white/60">
                  <li className="flex items-center gap-2 hover:text-white cursor-pointer" onClick={() => handleQuickSearch('offers')}>
                    <Sparkles size={12} className="text-[#D4AF37]" /> GET 40% OFF ON BUYING 5 PRODUCTS
                  </li>
                  <li className="flex items-center gap-2 hover:text-white cursor-pointer" onClick={() => handleQuickSearch('Face Care')}>
                    <Sparkles size={12} className="text-[#D4AF37]" /> D-TAN AND GLOW COMBOS FROM ₹399
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Luxury Mobile Sidebar Drawer (Slide-in from Left) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] flex">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[280px] bg-white h-full flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-out z-10">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-widest text-gray-900 font-serif">DR.RASHEL</span>
                  <span className="text-[0.5rem] tracking-[0.3em] font-bold uppercase text-gray-400">Botanical Elixirs</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links inside drawer */}
              <nav className="flex flex-col gap-4.5 mt-6 text-[0.75rem] tracking-[0.2em] font-bold uppercase text-gray-800">
                <Link to="/shop?category=face-care" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center hover:text-[#D4AF37]">
                  Face Care <ArrowRight size={12} className="text-gray-400" />
                </Link>
                <Link to="/shop?category=body-bath" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center hover:text-[#D4AF37]">
                  Body & Bath <ArrowRight size={12} className="text-gray-400" />
                </Link>
                <Link to="/shop?category=hair-care" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center hover:text-[#D4AF37]">
                  Hair Care <ArrowRight size={12} className="text-gray-400" />
                </Link>
                <Link to="/shop?category=offers" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center text-[#D4AF37]">
                  Offers <ArrowRight size={12} />
                </Link>
                <Link to="/blogs" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center hover:text-[#D4AF37]">
                  Journal <ArrowRight size={12} className="text-gray-400" />
                </Link>

                {/* Mobile Extra Actions: Wishlist and Account */}
                <button 
                  onClick={() => { toggleWishlist(true); setIsMenuOpen(false); }} 
                  className="py-2 border-b border-gray-50 flex justify-between items-center text-left hover:text-[#D4AF37]"
                >
                  <span className="flex items-center gap-2"><Heart size={14} /> My Wishlist ({wishlist.length})</span>
                  <ArrowRight size={12} className="text-gray-400" />
                </button>

                {user ? (
                  <>
                    <Link to={user.role !== 'user' ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between items-center hover:text-[#D4AF37]">
                      <span className="flex items-center gap-2"><User size={14} /> Account ({user.name.split(' ')[0]})</span>
                      <ArrowRight size={12} className="text-gray-400" />
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="py-2 text-left text-red-500 flex items-center gap-2">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-2 flex justify-between items-center hover:text-[#D4AF37]">
                    <span className="flex items-center gap-2"><User size={14} /> Login / Register</span>
                    <ArrowRight size={12} className="text-gray-400" />
                  </Link>
                )}
              </nav>
            </div>

            {/* Footer / Socials inside drawer */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between text-gray-500">
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-all">
                    <Instagram size={16} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-all">
                    <Facebook size={16} />
                  </a>
                </div>
                <a href="tel:+12345678" className="hover:text-[#D4AF37] transition-all flex items-center gap-1 text-[0.65rem] font-bold">
                  <Phone size={12} /> HELP & SUPPORT
                </a>
              </div>
              <p className="text-[0.55rem] tracking-widest text-gray-400 uppercase font-semibold text-center">© {new Date().getFullYear()} DR. RASHEL VIP</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
