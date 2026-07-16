import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle, ShieldCheck, Tag, Gift } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { 
    cartItems, coupon, giftWrap, orderNotes, 
    getSubtotal, getDiscountAmount, getTotal, clearCart 
  } = useCart();
  
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  
  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod / card
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expDate: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const { name, phone, address_line, city, state, postal_code } = shippingForm;
    if (!name || !phone || !address_line || !city || !state || !postal_code) {
      setError('Please fill in all shipping fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      const { cardNumber, expDate, cvv } = cardDetails;
      if (!cardNumber || !expDate || !cvv) {
        setError('Please fill in card details.');
        return;
      }
    }
    
    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.salePrice || item.price
        })),
        address: shippingForm,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Card',
        couponCode: coupon?.code || null,
        giftWrap,
        orderNotes
      };

      const res = await axios.post('/api/orders', payload);
      if (res.data.success) {
        const orderId = res.data.orderId;
        clearCart();
        navigate(`/order-success?id=${orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">Add items to your cart before checking out.</p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary text-xs">
          Shop Skincare
        </button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 uppercase tracking-wide text-center">VIP Checkout</h1>

      {/* Checkout Steps Header */}
      <div className="flex justify-center items-center gap-4 mb-12 text-xs font-semibold uppercase tracking-wider">
        <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
          <Truck size={16} /> 1. Shipping
        </span>
        <div className="w-16 h-[1.5px] bg-gray-200" />
        <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
          <CreditCard size={16} /> 2. Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step Forms */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl mb-6 font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div>
              <h3 className="font-serif text-lg font-bold mb-6 text-gray-800">Shipping Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Recipient Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control text-xs"
                    value={shippingForm.name}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 9876543210"
                    className="form-control text-xs"
                    value={shippingForm.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group sm:col-span-2">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="address_line"
                    placeholder="Flat/House No., Colony, Street"
                    className="form-control text-xs"
                    value={shippingForm.address_line}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control text-xs"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control text-xs"
                    value={shippingForm.state}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal / Zip Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    className="form-control text-xs"
                    value={shippingForm.postal_code}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control text-xs bg-gray-50"
                    value={shippingForm.country}
                    disabled
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateShipping()) setStep(2);
                }}
                className="btn btn-primary w-full mt-6 py-3"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div>
              <h3 className="font-serif text-lg font-bold mb-6 text-gray-800">Select Payment Method</h3>
              
              <div className="flex flex-col gap-4 mb-8">
                {/* Cash on Delivery */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-[#D4AF37] bg-gold/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#D4AF37]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Cash on Delivery (COD)</h4>
                    <p className="text-[0.65rem] text-gray-500">Pay in cash when your premium order is delivered.</p>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-[#D4AF37] bg-gold/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#D4AF37]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Credit / Debit Card</h4>
                    <p className="text-[0.65rem] text-gray-500">Pay securely online using credit/debit card.</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 flex flex-col gap-4 mb-6">
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="form-control text-xs"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        name="expDate"
                        placeholder="MM/YY"
                        className="form-control text-xs"
                        value={cardDetails.expDate}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="123"
                        maxLength="3"
                        className="form-control text-xs"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-secondary w-1/3 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn btn-primary flex-1 py-3"
                >
                  {loading ? 'Processing Order...' : 'Place Secure Order'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Order Summary */}
        <aside>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">
              Order Summary
            </h3>
            
            {/* Items List */}
            <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 leading-tight truncate w-40">{item.productName}</h4>
                    <span className="text-[0.65rem] text-gray-400 font-semibold">{item.size || item.volume} &times; {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-800">₹{(item.salePrice || item.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="flex flex-col gap-2.5 text-xs border-t border-dashed border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span className="flex items-center gap-1"><Tag size={12} /> Discount ({coupon.code})</span>
                  <span>-₹{getDiscountAmount()}</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1"><Gift size={12} /> Gift Wrap</span>
                  <span>₹50</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping Cost</span>
                <span className="text-green-600 font-bold uppercase">Free Shipping</span>
              </div>

              {orderNotes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-[0.7rem] text-gray-500 italic">
                  <strong>Notes:</strong> "{orderNotes}"
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-gray-800 pt-4 border-t border-gray-200 mt-2">
                <span>Total Amount</span>
                <span>₹{getTotal()}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[0.65rem] text-gray-400 font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-[#D4AF37]" /> SSL Secure & Encryption
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;
