import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('rashel_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  
  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState(null);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('rashel_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch Wishlist from DB if user is logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/general/wishlist');
          if (res.data.success) {
            setWishlist(res.data.wishlist);
          }
        } catch (err) {
          console.error('Error fetching wishlist', err);
        }
      } else {
        setWishlist([]); // Clear if logged out
      }
    };
    fetchWishlist();
  }, [user]);

  const addToCart = (product, variant, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.variantId === variant.id);
      if (existing) {
        return prevItems.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: Math.min(variant.stock, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          variantId: variant.id,
          size: variant.size,
          volume: variant.volume,
          sku: variant.sku,
          price: parseFloat(variant.price),
          salePrice: variant.sale_price ? parseFloat(variant.sale_price) : null,
          image: variant.image_url || 'https://via.placeholder.com/150',
          quantity: qty,
          stock: variant.stock
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setOrderNotes('');
    setGiftWrap(false);
  };

  const applyCouponCode = async (code) => {
    try {
      setCouponError('');
      const subtotal = getSubtotal();
      const res = await axios.post('/api/orders/validate-coupon', { code, amount: subtotal });
      if (res.data.success) {
        setCoupon(res.data.coupon);
        return { success: true, coupon: res.data.coupon };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      setCouponError(msg);
      setCoupon(null);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const activePrice = item.salePrice || item.price;
      return acc + activePrice * item.quantity;
    }, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    if (coupon.discount_type === 'percentage') {
      let discount = (subtotal * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount && discount > parseFloat(coupon.max_discount)) {
        discount = parseFloat(coupon.max_discount);
      }
      return discount;
    }
    return parseFloat(coupon.discount_value);
  };

  const getTotal = () => {
    const sub = getSubtotal();
    const disc = getDiscountAmount();
    const wrap = giftWrap ? 50 : 0; // ₹50 for gift wrap
    return Math.max(0, sub - disc + wrap);
  };

  const toggleCart = (open) => {
    setIsCartOpen(open !== undefined ? open : !isCartOpen);
  };

  const toggleWishlist = (open) => {
    setIsWishlistOpen(open !== undefined ? open : !isWishlistOpen);
  };

  // Wishlist actions
  const addToWishlist = async (product) => {
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }
    try {
      const res = await axios.post('/api/general/wishlist', { productId: product.id });
      if (res.data.success) {
        // Fetch fresh wishlist
        const wishlistRes = await axios.get('/api/general/wishlist');
        setWishlist(wishlistRes.data.wishlist);
        setIsWishlistOpen(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to wishlist.');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`/api/general/wishlist/${productId}`);
      if (res.data.success) {
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        isCartOpen,
        isWishlistOpen,
        coupon,
        couponError,
        giftWrap,
        orderNotes,
        shippingEstimate,
        setGiftWrap,
        setOrderNotes,
        setShippingEstimate,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon,
        getSubtotal,
        getDiscountAmount,
        getTotal,
        toggleCart,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
