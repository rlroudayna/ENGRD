// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Configure axios to include token in requests
  useEffect(() => {
    console.log('Setting axios defaults with token:', token ? 'Token present' : 'No token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('adminToken');
      console.log('Checking auth on app load, token:', savedToken ? 'Present' : 'Not found');
      
      if (savedToken) {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/admin/verify', {
            token: savedToken
          });
          
          console.log('Token verification response:', response.data);
          
          if (response.data.success) {
            setToken(savedToken);
            setUser(response.data.user);
            setIsAuthenticated(true);
            console.log('Authentication successful');
          } else {
            // Token is invalid, remove it
            console.log('Token verification failed, removing token');
            localStorage.removeItem('adminToken');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No token found in localStorage');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username, password: '***' });
      const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
        username,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        
        console.log('Login successful, saving token:', newToken ? 'Token received' : 'No token');
        
        // Save token to localStorage
        localStorage.setItem('adminToken', newToken);
        
        // Update state
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('Auth state updated successfully');
        
        return { success: true, message: response.data.message };
      } else {
        console.log('Login failed:', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (optional, mainly for logging purposes)
      await axios.post('http://localhost:5000/api/auth/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('adminToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};