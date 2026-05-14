import React, { useState } from 'react';
import { api, tokenService, userService } from '../services/api';

export default function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!username || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }

      const response = await api.register(username, password);

      if (response.status) {
        setSuccess('Account created successfully! Logging you in...');
        
        // Automatically sign in after registration
        setTimeout(async () => {
          const signinResponse = await api.signin(username, password);
          if (signinResponse.status) {
            tokenService.setToken(signinResponse.token);
            userService.setUser(signinResponse.user);
            onSignupSuccess();
          }
        }, 500);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Signup error:', err);
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
          <h2 className="glass-card-subtitle">Join the Beat</h2>
          <p className="glass-card-description">Create your account and start exploring music</p>
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
                placeholder="Choose a username"
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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="form-group-input-wrapper">
              <span className="form-group-icon">🔐</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            {!loading && '→'}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="auth-link">
          <p>
            Already have an account?
            <a href="#login" onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
