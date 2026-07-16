import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, toggleWishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product) => {
    // Select first variant as default active
    const defaultVariant = {
      id: product.id * 100 + 1, // Mock variant id mapping if variants don't exist
      sku: `WL-${product.slug}`,
      size: 'Standard',
      volume: '100ml',
      price: product.min_price || 399.00,
      sale_price: product.min_sale_price || null,
      stock: 10,
      image_url: product.image_url
    };
    
    addToCart(product, defaultVariant, 1);
    removeFromWishlist(product.id);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleWishlist(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF8F5] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={20} />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-gray-800">Your Wishlist</h3>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              </div>
              <button onClick={() => toggleWishlist(false)} className="text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {wishlist.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
                  <Heart size={48} className="text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Your wishlist is empty.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 font-serif leading-tight">{item.name}</h4>
                        <span className="text-xs font-bold text-gray-800 mt-2 block">
                          ₹{item.min_sale_price || item.min_price}
                        </span>
                      </div>
                      
                      {/* Action buttons inside card */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white bg-[#D4AF37] px-3 py-1.5 rounded-full hover:bg-gold transition-all"
                        >
                          <ShoppingCart size={10} /> Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="flex items-center gap-1 text-[0.65rem] font-semibold text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
