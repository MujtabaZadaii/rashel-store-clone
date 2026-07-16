import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Notebook, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

const CartDrawer = () => {
  const { 
    cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity,
    coupon, couponError, applyCouponCode, removeCoupon,
    giftWrap, setGiftWrap, orderNotes, setOrderNotes,
    getSubtotal, getDiscountAmount, getTotal 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCouponCode(couponCode.trim());
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
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
                <ShoppingBag className="text-[#D4AF37]" size={20} />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-gray-800">Your Bag</h3>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <button onClick={() => toggleCart(false)} className="text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Your bag is empty.</p>
                  <button
                    onClick={() => { toggleCart(false); navigate('/shop'); }}
                    className="btn btn-primary mt-2"
                  >
                    Shop Skincare
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.variantId} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 font-serif leading-tight">{item.productName}</h4>
                        <p className="text-[0.7rem] text-gray-500 font-semibold uppercase mt-1">
                          {item.size || item.volume}
                        </p>
                      </div>
                      
                      {/* Price and Quantities */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="text-gray-500 hover:text-[#D4AF37]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="text-gray-500 hover:text-[#D4AF37]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          ₹{(item.salePrice || item.price) * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-gray-300 hover:text-red-500 self-start mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Options */}
            {cartItems.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-6 flex flex-col gap-4">
                
                {/* Accordions: Note, Wrap, Coupons */}
                <div className="flex justify-around border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">
                  <button 
                    onClick={() => setShowNotes(!showNotes)} 
                    className={`flex items-center gap-1 hover:text-[#D4AF37] ${showNotes ? 'text-[#D4AF37]' : ''}`}
                  >
                    <Notebook size={14} /> Add Note
                  </button>
                  <button 
                    onClick={() => setGiftWrap(!giftWrap)} 
                    className={`flex items-center gap-1 hover:text-[#D4AF37] ${giftWrap ? 'text-[#D4AF37]' : ''}`}
                  >
                    <Gift size={14} /> Gift Wrap (+₹50)
                  </button>
                </div>

                {/* Order Notes Field */}
                {showNotes && (
                  <textarea
                    placeholder="Enter order notes or custom gift messages here..."
                    className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:border-gold"
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                )}

                {/* Coupon Code Input */}
                {!coupon ? (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. VIPGLOW)"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-xs flex-1 outline-none focus:border-gold"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase hover:bg-gold">
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1"><Tag size={12} /> Coupon <strong>{coupon.code}</strong> Applied</span>
                    <button onClick={removeCoupon} className="text-green-800 hover:text-red-500 font-bold">Remove</button>
                  </div>
                )}
                {couponError && <p className="text-[0.7rem] text-red-500">{couponError}</p>}

                {/* Summary calculation */}
                <div className="flex flex-col gap-2 text-xs border-b border-gray-100 pb-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{getDiscountAmount()}</span>
                    </div>
                  )}
                  {giftWrap && (
                    <div className="flex justify-between text-gray-500">
                      <span>Gift Wrapping</span>
                      <span>₹50</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-gray-800 pt-2 border-t border-dashed border-gray-100">
                    <span>Total Amount</span>
                    <span>₹{getTotal()}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="w-full btn btn-primary py-3 rounded-xl font-bold uppercase tracking-wider">
                  Proceed to Checkout
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
