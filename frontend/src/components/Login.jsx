import React, { useState } from 'react';
import { api, tokenService, userService } from '../services/api';

export default function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!username || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await api.signin(username, password);

      if (response.status) {
        setSuccess('Login successful!');
        tokenService.setToken(response.token);
        userService.setUser(response.user);
        
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-background-overlay"></div>

      <div className="glass-card">
        {/* Header */}
        <div className="glass-card-header">
          <h1 className="glass-card-title">Y-Melodies</h1>
          <h2 className="glass-card-subtitle">Welcome Back</h2>
          <p className="glass-card-description">Enter your details to access your music collection</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="success-message show">
            ✓ {success}
          </div>
        )}
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 180, 171, 0.1)',
            border: '1px solid #ffb4ab',
            color: '#ffb4ab',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ✗ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <div className="form-group-input-wrapper">
              <span className="form-group-icon">👤</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="form-group-input-wrapper">
              <span className="form-group-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && '→'}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="auth-link">
          <p>
            Don't have an account?
            <a href="#signup" onClick={(e) => {
              e.preventDefault();
              onSwitchToSignup();
            }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
