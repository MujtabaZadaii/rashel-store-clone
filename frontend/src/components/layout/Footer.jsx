import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Award, Smile } from 'lucide-react';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus('Subscribing...');
      const res = await axios.post('/api/general/newsletter', { email });
      if (res.data.success) {
        setStatus(res.data.message);
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Subscription failed.');
      setSuccess(false);
    }
  };

  return (
    <footer className="vip-footer">
      <div className="container">
        
        {/* Brand Certifications Bar */}
        <div className="border-b border-gray-800 pb-10 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-[#D4AF37]" size={36} />
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">100% Dermatologist Approved</h4>
            <p className="text-xs">Safe, non-toxic, and tested for all sensitive skin types.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="text-[#D4AF37]" size={36} />
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Cruelty Free Certified</h4>
            <p className="text-xs">Zero animal testing. Organic and natural extracts only.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Smile className="text-[#D4AF37]" size={36} />
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Satisfied Customers</h4>
            <p className="text-xs">Over 1M+ glowing skins across the country.</p>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          
          {/* Col 1: Brand Info */}
          <div>
            <h3 className="text-xl font-bold font-serif text-[#D4AF37] tracking-widest mb-4">DR.RASHEL</h3>
            <p className="text-gray-400 text-xs mb-6 max-w-sm leading-relaxed">
              Experience the pinnacle of luxury skincare. Our beauty elixirs are crafted with premium botanical actives to deliver a glass skin glow, restore elasticity, and heal your skin from deep within.
            </p>
            <div className="flex flex-col gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-2"><Phone size={14} className="text-[#D4AF37]" /> +91 1800-123-4567</span>
              <span className="flex items-center gap-2"><Mail size={14} className="text-[#D4AF37]" /> support@rashel.in</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]" /> Connaught Place, New Delhi, India</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Shop Collections</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-400">
              <li><Link to="/shop?category=face-care" className="hover:text-[#D4AF37]">Face Serums</Link></li>
              <li><Link to="/shop?subcategory=face-wash-cleansers" className="hover:text-[#D4AF37]">Cleansers</Link></li>
              <li><Link to="/shop?subcategory=face-scrubs" className="hover:text-[#D4AF37]">Exfoliating Scrubs</Link></li>
              <li><Link to="/shop?subcategory=sunscreens" className="hover:text-[#D4AF37]">Sunscreens</Link></li>
              <li><Link to="/shop?category=hair-care" className="hover:text-[#D4AF37]">Hair Growth Oils</Link></li>
            </ul>
          </div>

          {/* Col 3: Skin Concern */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Skin Concerns</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-400">
              <li><Link to="/shop?concern=Glass+Skin" className="hover:text-[#D4AF37]">Glass Skin Glow</Link></li>
              <li><Link to="/shop?concern=D-Tan" className="hover:text-[#D4AF37]">Tan Removal</Link></li>
              <li><Link to="/shop?concern=Hydrating" className="hover:text-[#D4AF37]">Dry & Dehydrated Skin</Link></li>
              <li><Link to="/shop?concern=Hair+Fall" className="hover:text-[#D4AF37]">Hair Fall Control</Link></li>
              <li><Link to="/faqs" className="hover:text-[#D4AF37]">Skincare FAQ</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Join the VIP Circle</h4>
            <p className="text-gray-400 text-xs mb-4">
              Subscribe to receive updates on exclusive private sales, premium formulation launches, and skincare advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex border border-gray-700 rounded-full overflow-hidden bg-white/5">
                <input
                  type="email"
                  placeholder="Your VIP email address..."
                  className="bg-transparent text-xs py-3 px-4 w-full text-white placeholder-gray-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#FFC107] text-white px-5 text-xs font-bold uppercase hover:opacity-90 transition-all"
                >
                  Join
                </button>
              </div>
              {status && (
                <span className={`text-[0.7rem] ${success ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                  {status}
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright and legal routes */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-[0.7rem] gap-4">
          <span>&copy; {new Date().getFullYear()} DR.RASHEL. All Rights Reserved. Crafted for premium skincare.</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37]">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
