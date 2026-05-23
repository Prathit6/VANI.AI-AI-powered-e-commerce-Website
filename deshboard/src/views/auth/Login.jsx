import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { user_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import '../auth/auth.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);
  const [state, setState] = useState({ email: '', password: '' });

  const inputHandle = (e) => setState({ ...state, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    dispatch(user_login(state));
  };

  const overrideStyle = {
    display: 'flex', margin: '0 auto',
    height: '24px', justifyContent: 'center', alignItems: 'center',
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      return;
    }
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => dispatch(messageClear()), 100);
      navigate('/');
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="auth-logo-badge">V</span>
          <span className="auth-logo-text">ANI.AI</span>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue shopping</p>

        <form className="auth-form" onSubmit={submit}>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email" name="email"
              placeholder="you@example.com"
              value={state.email}
              onChange={inputHandle}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password" name="password"
              placeholder="Enter your password"
              value={state.password}
              onChange={inputHandle}
              required
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loader}>
            {loader
              ? <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              : 'Sign In'}
          </button>

          <p className="auth-redirect">
            No account yet?{' '}
            <Link to="/register">Create one</Link>
          </p>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Or continue with</span>
            <div className="auth-divider-line" />
          </div>

          <div className="auth-social">
            <button type="button" className="auth-social-btn">
              <GoogleIcon />
            </button>
            <button type="button" className="auth-social-btn">
              <FacebookIcon />
            </button>
          </div>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Other portals</span>
            <div className="auth-divider-line" />
          </div>

          <div className="auth-portal-row">
            <button
              type="button"
              className="auth-btn-primary amber"
              onClick={() => navigate('/seller-login')}
            >
              Seller Portal
            </button>
            <button
              type="button"
              className="auth-btn-primary purple"
              onClick={() => navigate('/admin-login')}
            >
              Admin Portal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
