import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdmin } from './db';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(username, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Invalid credentials');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-backdrop animate-fade-in">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-badge">
            <ShieldCheck size={14} />
            <span>SECURE GATEWAY</span>
          </div>
          <img src="/jsa-show-logo.jpg" alt="JSA Logo" className="login-logo" />
          <h2 className="font-serif login-title">JSA Admin Portal</h2>
          <p className="login-subtitle">Jaipur Silver Association Management Suite</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error animate-fade-in">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-input-group">
            <label>Admin Username</label>
            <div className="login-input-shell">
              <User size={16} className="login-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (admin)"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Security Password</label>
            <div className="login-input-shell">
              <Lock size={16} className="login-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (admin)"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={15} />
          </button>

          <div className="login-footer-actions">
            <button type="button" className="btn-back-site" onClick={onCancel}>
              ← Return to Main Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
