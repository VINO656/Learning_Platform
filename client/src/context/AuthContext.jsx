import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // We'll also store user info in local storage on login for simplicity,
        // or we could fetch the full profile here.
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (decoded.exp * 1000 > Date.now()) {
          setUser(storedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password, role });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const toggleModule = async (moduleId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/modules/${moduleId}/complete`);
      const updatedUser = { ...user, completedModules: res.data.completedModules };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to toggle module completion', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, toggleModule }}>
      {children}
    </AuthContext.Provider>
  );
};
