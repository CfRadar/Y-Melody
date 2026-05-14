import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PlaylistView from './components/PlaylistView';
import Discover from './components/Discover';
import Layout from './components/Layout';
import { tokenService, userService, api } from './services/api';
import './styles/auth.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = tokenService.getToken();
        
        if (token) {
          const response = await api.getProfile(token);
          if (response.status) {
            setIsLoggedIn(true);
          } else {
            tokenService.removeToken();
            userService.removeUser();
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#131313',
        color: '#e5e2e1'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>🎵</div>
          <p style={{ fontSize: '18px' }}>Loading Y-Melodies...</p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => window.location.href = '/'} onSwitchToSignup={() => window.location.href = '/signup'} />} />
        <Route path="/signup" element={<Signup onSignupSuccess={() => window.location.href = '/'} onSwitchToLogin={() => window.location.href = '/login'} />} />
        
        {/* Protected routes wrapped in the Layout component */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="discover" element={<Discover />} />
          <Route path="playlist/:id" element={<PlaylistView />} />
        </Route>
      </Routes>
    </Router>
  );
}
