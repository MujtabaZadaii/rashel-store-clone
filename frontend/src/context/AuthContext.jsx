import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Setup base url for axios
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on app mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const res = await axios.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        }
      } catch (err) {
        console.warn('Session check failed or expired, attempting token refresh...');
        await refreshAccessToken();
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Token Rotation/Refresh
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post('/api/auth/refresh-token');
      if (res.data.success) {
        const newToken = res.data.accessToken;
        setToken(newToken);
        localStorage.setItem('accessToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        const userRes = await axios.get('/api/auth/me');
        if (userRes.data.success) {
          setUser(userRes.data.user);
        }
        return newToken;
      }
    } catch (err) {
      console.error('Refresh token expired, logging out.');
      logout();
    }
    return null;
  };

  // Interceptor to auto-refresh token if request returns 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password, rememberMe });
      if (res.data.success) {
        const loginToken = res.data.accessToken;
        setToken(loginToken);
        setUser(res.data.user);
        localStorage.setItem('accessToken', loginToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${loginToken}`;
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      return res.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout API call failed', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error requesting reset.' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post('/api/auth/reset-password', { token, newPassword });
      return res.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Reset password failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
