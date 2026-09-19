import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check credentials strictly
    if (username.trim() === 'Admin' && password === 'Hello@12345') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Persist session
        sessionStorage.setItem('rituraj_study_authenticated', 'true');
        onLoginSuccess();
      }, 400);
    } else {
      setError('Invalid Access Credentials. Please verify ID and Password.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="c-login-modal" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="c-login-modal__box">
        {/* Close Button */}
        <button
          className="c-login-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="c-login-modal__header">
          <div className="c-login-modal__logo-wrap">
            <img src="/images/iitp-logo.png" alt="IIT Patna Logo" className="c-login-modal__logo-img" />
          </div>
          <div className="c-login-modal__badge">
            <ShieldCheck size={14} />
            <span>SECURE SYSTEM GATEWAY // IIT PATNA</span>
          </div>
          <h2 className="c-login-modal__title">STUDY TOOLS PORTAL</h2>
          <p className="c-login-modal__subtitle">
            Private workspace for M.Tech CSE coursework, research notes, and academic trackers.
          </p>
        </div>

        {/* Form */}
        <form className="c-login-modal__form" onSubmit={handleSubmit}>
          {error && (
            <div className="c-login-modal__error" role="alert">
              <span>✕</span> {error}
            </div>
          )}

          <div className="c-login-modal__field">
            <label htmlFor="login-username" className="c-login-modal__label">
              OPERATOR ID / USERNAME
            </label>
            <div className="c-login-modal__input-wrap">
              <User size={16} className="c-login-modal__icon" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter ID (Admin)"
                autoComplete="username"
                required
                className="c-login-modal__input"
                autoFocus
              />
            </div>
          </div>

          <div className="c-login-modal__field">
            <label htmlFor="login-password" className="c-login-modal__label">
              PASSWORD KEY
            </label>
            <div className="c-login-modal__input-wrap">
              <Lock size={16} className="c-login-modal__icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="c-login-modal__input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="c-login-modal__eye-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`c-login-modal__submit-btn ${isLoading ? 'is-loading' : ''}`}
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'ENTER WORKSPACE'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="c-login-modal__footer">
          <span className="c-login-modal__hint-badge">CONFIDENTIAL</span>
          <span>Authorized session only // IIT Patna Scholar Environment</span>
        </div>
      </div>
    </div>
  );
};
