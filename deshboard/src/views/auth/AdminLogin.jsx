import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../auth/auth.css';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);
  const [state, setState] = useState({ email: '', password: '' });

  const inputHandle = (e) => setState({ ...state, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    dispatch(admin_login(state));
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
      navigate('/admin/dashboard');
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="auth-logo-badge violet">
            <ShieldIcon />
          </span>
          <span className="auth-logo-text">Admin Portal</span>
        </div>

        <h2 className="auth-title">Admin sign in</h2>
        <p className="auth-subtitle">Restricted access — authorised personnel only</p>

        <form className="auth-form" onSubmit={submit}>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email" name="email"
              placeholder="admin@vani.ai"
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

          <button
            type="submit"
            className="auth-btn-primary purple"
            disabled={loader}
          >
            {loader
              ? <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              : 'Sign In as Admin'}
          </button>

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
              className="auth-btn-primary amber"
              onClick={() => navigate('/seller-login')}
            >
              Seller Portal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
