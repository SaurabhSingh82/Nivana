import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check localStorage and also capture token query param from OAuth flows
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      const tokenFromStorage = localStorage.getItem('token');

      // priority: use token from URL (fresh OAuth), otherwise storage
      if (tokenFromUrl && tokenFromUrl !== tokenFromStorage) {
        localStorage.setItem('token', tokenFromUrl);
        setToken(tokenFromUrl);

        // remove token from URL for neatness
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, document.title, url.pathname + url.search);
        } catch (e) {
          // ignore
        }
      } else {
        setToken(tokenFromStorage);
      }
    } catch (e) {
      console.warn('Could not read token from localStorage or parse URL', e);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken, newUser = null) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      if (newUser) setUser(newUser);

      // also ensure token isn't left in URL (if login returned via redirect)
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('token')) {
          url.searchParams.delete('token');
          window.history.replaceState({}, document.title, url.pathname + url.search);
        }
      } catch (e) {}
    } catch (e) {
      console.warn('Failed to store token', e);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('Failed to clear token', e);
    }
    setToken(null);
    setUser(null);
  };

  // keep user fresh after token is set
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return setUser(null);
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Could not fetch user');
        const data = await res.json();
        setUser(data.user || null);
      } catch (e) {
        console.warn('Failed to fetch user for token', e);
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
