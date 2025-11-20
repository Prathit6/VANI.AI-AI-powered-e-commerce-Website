import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    email: '',
    password: ''
  });

  const inputHandle = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(admin_login(state));
  };

  const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: 'center'
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      return;
    }

    if (successMessage) {
      toast.success(successMessage);

      setTimeout(() => {
        dispatch(messageClear());
      }, 100);

      navigate('/admin/dashboard');
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] flex justify-center items-center px-4 pt-20">
      <div className="w-full max-w-md bg-[#121212] p-8 rounded-2xl shadow-[0_0_15px_rgba(0,229,255,0.15)]
        border border-[#1f1f1f] text-white select-auto">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center">
            <span className="w-[28px] h-[28px] bg-white text-[#121212] flex justify-center items-center 
              font-bold text-lg rounded mr-1">
              V
            </span>
            <span className="text-2xl font-bold tracking-wide">ANI.AI</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">Admin Login</h2>
        <p className="text-sm text-gray-400 text-center mb-4">Only authorized admin access</p>

        <form onSubmit={submit} className="flex flex-col w-full">

          {/* Email */}
          <div className="flex flex-col mb-4">
           <label
  htmlFor="email"
  className="block text-left text-gray-300 mb-1"
>
  Email
</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={state.email}
              onChange={inputHandle}
              required
              className="w-full px-3 py-2 rounded-md bg-[#1a1a1a] 
              border border-[#333] text-white outline-none
              focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col mb-4">
           <label
  htmlFor="password"
  className="block text-left text-gray-300 mb-1 mt-4"
>
  Password
</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={state.password}
              onChange={inputHandle}
              required
              className="w-full px-3 py-2 rounded-md bg-[#1a1a1a]
              border border-[#333] text-white outline-none
              focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loader}
            className="w-full bg-gradient-to-r from-[#222] to-[#444]
              hover:from-[#333] hover:to-[#555] rounded-md text-white py-2 
              transition duration-200 shadow-md hover:shadow-lg mb-4"
          >
            {loader ? (
              <PropagateLoader color="#fff" cssOverride={overrideStyle} />
            ) : (
              'Login'
            )}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center mb-4">
            <div className="flex-1 h-[1px] bg-[#333]"></div>
            <span className="px-2 text-gray-400">Or</span>
            <div className="flex-1 h-[1px] bg-[#333]"></div>
          </div>

          {/* Back to user login */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-md py-2 transition"
          >
            Back to User Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
