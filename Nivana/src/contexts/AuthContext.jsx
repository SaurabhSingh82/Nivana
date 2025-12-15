// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load: Check LocalStorage & URL Params (OAuth)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        const tokenFromStorage = localStorage.getItem('token');

        // Priority: URL Token (Fresh Login) > Storage Token
        if (tokenFromUrl) {
          localStorage.setItem('token', tokenFromUrl);
          setToken(tokenFromUrl);

          // URL clean karo (token hatao)
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, document.title, url.pathname + url.search);
        
        } else if (tokenFromStorage) {
          setToken(tokenFromStorage);
        }
      } catch (e) {
        console.warn('Error reading token:', e);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Login Function
  const login = (newToken, newUser = null) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Optional: Agar dashboard par ho toh home par redirect bhi kar sakte ho
    // window.location.href = '/login'; 
  };

  // 4. User Fetch Effect (FIXED: Handles Expired Token)
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Token invalid or expired');
        }

        const data = await res.json();
        setUser(data.user || null);

      } catch (e) {
        console.warn('Authentication failed, auto-logging out:', e);
        
        // --- IMPORTANT FIX ---
        // Agar token invalid hai, toh turant sab clear karo
        // Varna app blank screen par atak jayega
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // ---------------------
      }
    };

    fetchUser();
  }, [token]);

  const value = {
    token,
    user,
    isAuthenticated: !!token, // Convert token existence to boolean
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;