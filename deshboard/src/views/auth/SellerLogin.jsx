import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { seller_login, seller_register, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import '../auth/auth.css';

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SellerLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [state, setState] = useState({ name: '', email: '', password: '' });

  const inputHandle = (e) => setState({ ...state, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(seller_register(state));
    } else {
      dispatch(seller_login({ email: state.email, password: state.password }));
    }
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
      navigate('/seller/dashboard');
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-seller-header">
          <div className="auth-seller-badge">
            <StoreIcon />
          </div>
          <div className="auth-seller-header-text">
            <span className="auth-seller-header-title">Seller Portal</span>
            <span className="auth-seller-header-sub">VANI.AI Commerce</span>
          </div>
        </div>

        <h2 className="auth-title">
          {isRegister ? 'Become a seller' : 'Seller sign in'}
        </h2>
        <p className="auth-subtitle">
          {isRegister
            ? 'Create your seller account — pending admin approval'
            : 'Access your seller dashboard'}
        </p>

        <form className="auth-form" onSubmit={submit}>

          {isRegister && (
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                className="auth-input"
                type="text" name="name"
                placeholder="Your full name"
                value={state.name}
                onChange={inputHandle}
                required
              />
            </div>
          )}

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

          {isRegister && (
            <p className="auth-notice">
              Your account will be reviewed by admin before activation
            </p>
          )}

          <button
            type="submit"
            className="auth-btn-primary amber"
            disabled={loader}
          >
            {loader
              ? <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              : isRegister ? 'Create Seller Account' : 'Sign In to Dashboard'}
          </button>

          <p className="auth-redirect">
            {isRegister ? 'Already a seller? ' : "Don't have a seller account? "}
            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setState({ name: '', email: '', password: '' });
              }}
              style={{ cursor: 'pointer' }}
            >
              {isRegister ? 'Sign In' : 'Register here'}
            </span>
          </p>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Other portals</span>
            <div className="auth-divider-line" />
          </div>

          <div className="auth-portal-row">
            <button
              type="button"
              className="auth-btn-primary ghost"
              onClick={() => navigate('/login')}
            >
              User Login
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

export default SellerLogin;
