import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(state);
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] flex justify-center items-center px-4 
      pt-20">

      <div className="w-full max-w-md bg-[#121212] p-8 rounded-2xl shadow-[0_0_15px_rgba(0,229,255,0.15)] 
          border border-[#1f1f1f] text-white">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2 text-center text-white tracking-wide">
          Welcome Back
        </h2>
        <p className="text-sm mb-6 text-center text-gray-300">
          Sign in to continue your shopping
        </p>

        <form onSubmit={submit} className="flex flex-col w-full">

          {/* Email */}
          <div className="flex flex-col w-full mb-4">
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
          <div className="flex flex-col w-full mb-6">
            <label
  htmlFor="email"
  className="block text-left text-gray-300 mb-1"
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

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#222] to-[#444] 
              hover:from-[#333] hover:to-[#555] text-white rounded-md px-4 py-2 mb-4
              transition duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>

          {/* Signup redirect */}
          <p className="text-gray-300 text-center w-full mb-4">
            Don’t have an account?{" "}
            <Link className="font-bold underline text-cyan-400" to="/register">
              Sign Up
            </Link>
          </p>

          {/* OR Line */}
          <div className="w-full flex items-center mb-4">
            <div className="flex-1 h-[1px] bg-[#333]"></div>
            <span className="px-2 text-gray-400 text-sm">Or</span>
            <div className="flex-1 h-[1px] bg-[#333]"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center items-center gap-3 w-full mb-4">
            <div className="w-[135px] h-[38px] flex rounded-md bg-[#db4437] 
              shadow-md hover:shadow-[#db4437]/40 justify-center cursor-pointer 
              items-center transition-all">
              <FaGoogle className="text-white text-lg" />
            </div>

            <div className="w-[135px] h-[38px] flex rounded-md bg-[#1877f2] 
              shadow-md hover:shadow-[#1877f2]/40 justify-center cursor-pointer 
              items-center transition-all">
              <FaFacebook className="text-white text-lg" />
            </div>
          </div>

          {/* Admin Login */}
          <button
            type="button"
            onClick={() => navigate("/admin-login")}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-md 
              px-4 py-2 transition duration-200 shadow-md hover:shadow-lg text-sm"
          >
            Admin Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
