import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, MapPin, Heart, Plus, Trash2, Key, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist } = useCart();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address fields state
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: ''
  });
  const [addressStatus, setAddressStatus] = useState('');

  // Active section tracker
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orderRes = await axios.get('/api/orders');
        if (orderRes.data.success) setOrders(orderRes.data.orders);

        const addrRes = await axios.get('/api/general/addresses');
        if (addrRes.data.success) setAddresses(addrRes.data.addresses);
      } catch (err) {
        console.warn('Backend connection unavailable, using mock orders and addresses...');
        setOrders([
          { id: 4501, created_at: '2026-06-01', total_amount: 599, status: 'Shipped', payment_status: 'Paid', payment_method: 'Card' }
        ]);
        setAddresses([
          { id: 1, name: 'Aditi Sharma', phone: '+91 9999888877', address_line: 'G-14, Green Park Extension', city: 'New Delhi', state: 'Delhi', postal_code: '110016' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setAddressStatus('Adding address...');
      const res = await axios.post('/api/general/addresses', newAddress);
      if (res.data.success) {
        setAddresses([...addresses, { ...newAddress, id: res.data.addressId }]);
        setNewAddress({ name: '', phone: '', address_line: '', city: '', state: '', postal_code: '' });
        setAddressStatus('Address added successfully!');
      }
    } catch (err) {
      setAddressStatus('Failed to add address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await axios.delete(`/api/general/addresses/${id}`);
      if (res.data.success) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Sidebar Navigation */}
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm self-start">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFC107] flex items-center justify-center text-white font-serif font-bold text-lg">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800 leading-tight">{user?.name || 'VIP Client'}</h3>
              <span className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{user?.role} Account</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-semibold text-xs text-gray-600 uppercase tracking-widest">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'orders' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'hover:bg-gray-50'
              }`}
            >
              <ShoppingBag size={14} /> My Orders
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'addresses' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'hover:bg-gray-50'
              }`}
            >
              <MapPin size={14} /> Addresses
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === 'wishlist' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'hover:bg-gray-50'
              }`}
            >
              <Heart size={14} /> Wishlist
            </button>
          </div>
        </aside>

        {/* Right Side: Tab Contents */}
        <main className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-6 text-gray-800">Your Order History</h2>
              
              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 italic">You have not placed any orders yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-5 border border-gray-100 rounded-2xl bg-[#FAF8F5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">Order ID: #{ord.id}</h4>
                        <p className="text-[0.65rem] text-gray-400 mt-1 font-semibold uppercase">
                          Placed: {new Date(ord.created_at).toLocaleDateString()} &mdash; Payment: {ord.payment_method}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-800 block">₹{ord.total_amount}</span>
                          <span className="text-[0.65rem] text-green-600 font-semibold">{ord.payment_status}</span>
                        </div>
                        <span className={`badge text-[0.65rem] font-bold ${
                          ord.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-6 text-gray-800">Manage Shipping Addresses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-5 border border-gray-200 rounded-2xl relative flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-gray-800 mb-2">{addr.name}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {addr.address_line}, {addr.city}, {addr.state} &mdash; {addr.postal_code}
                      </p>
                      <span className="text-[0.65rem] text-gray-400 font-semibold mt-2 block">Phone: {addr.phone}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Address Form */}
              <form onSubmit={handleAddAddress} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 max-w-xl">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Plus size={14} /> Add New Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Recipient Name</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control text-xs"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group sm:col-span-2">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={newAddress.address_line}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary text-xs py-2.5 px-6 mt-2">
                  Save Address
                </button>
                {addressStatus && <p className="text-[0.7rem] text-gray-500 mt-2 font-semibold">{addressStatus}</p>}
              </form>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-6 text-gray-800">Your Skincare Wishlist</h2>

              {wishlist.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-100 rounded-2xl bg-[#FAF8F5] flex gap-4 items-center relative">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-800 leading-tight">{item.name}</h4>
                        <span className="text-xs font-bold text-gray-800 mt-1 block">₹{item.min_sale_price || item.min_price}</span>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default Dashboard;
