import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Mode state: 'login' / 'register' / 'forgot'
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    if (mode === 'login') {
      const res = await login(form.email, form.password, form.rememberMe);
      if (res.success) {
        navigate('/');
      } else {
        setStatus(res.message);
        setSuccess(false);
      }
    } else if (mode === 'register') {
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        setStatus('Registration successful! Please log in.');
        setSuccess(true);
        setMode('login');
      } else {
        setStatus(res.message);
        setSuccess(false);
      }
    } else if (mode === 'forgot') {
      const res = await forgotPassword(form.email);
      if (res.success) {
        setStatus('Reset instructions have been sent to your email.');
        setSuccess(true);
      } else {
        setStatus(res.message);
        setSuccess(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container py-20 flex justify-center items-center">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full">
        {/* Toggle Mode headers */}
        <div className="flex justify-around border-b border-gray-100 pb-4 mb-8 text-xs font-bold uppercase tracking-wider text-gray-400">
          <button
            onClick={() => { setMode('login'); setStatus(''); }}
            className={`${mode === 'login' ? 'text-black border-b-2 border-[#D4AF37] pb-4 -mb-5' : 'hover:text-black'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setStatus(''); }}
            className={`${mode === 'register' ? 'text-black border-b-2 border-[#D4AF37] pb-4 -mb-5' : 'hover:text-black'}`}
          >
            Create Account
          </button>
        </div>

        {status && (
          <div className={`text-xs p-4 rounded-xl mb-6 font-semibold border ${
            success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {status}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5"><User size={14} /> Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control text-xs"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center gap-1.5"><Mail size={14} /> Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. skin@rashel.in"
              className="form-control text-xs"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5"><KeyRound size={14} /> Password</label>
              <input
                type="password"
                name="password"
                className="form-control text-xs"
                value={form.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-between items-center text-xs font-semibold mb-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-500">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleInputChange}
                  className="accent-[#D4AF37]"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-[#D4AF37] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary py-3 rounded-xl font-bold text-xs uppercase"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
          </button>
        </form>

        {mode === 'forgot' && (
          <button
            onClick={() => setMode('login')}
            className="text-center text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider mt-6 block mx-auto hover:underline"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
