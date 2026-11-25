import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminAccessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await adminApi.get('/api/admin/auth/me');
        setUser(res.data.user);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    const res = await adminApi.post('/api/admin/auth/login', { email, senha });
    const { user: userData, accessToken } = res.data;
    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await adminApi.post('/api/admin/auth/logout');
    } catch (e) {
      // ignora se a requisição falhar
    } finally {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
