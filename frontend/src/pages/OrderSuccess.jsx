import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');

  return (
    <div className="container py-20 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>

        <h1 className="font-serif text-2xl font-bold mb-3 text-gray-800">Order Placed Successfully!</h1>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Thank you for choosing Dr. Rashel. Your transaction has been processed securely. A confirmation email with order details has been dispatched.
        </p>

        {orderId && (
          <div className="bg-[#FAF8F5] px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 mb-8 w-full">
            Order ID: <span className="text-[#D4AF37] font-bold">#{orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => navigate('/shop')} 
            className="btn btn-primary text-xs flex-1 py-3"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-secondary text-xs flex-1 py-3"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
