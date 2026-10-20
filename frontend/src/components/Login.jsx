import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      dispatch(setAuthUser(res.data));
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't sign in. Is the server running?");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark auth-brand" aria-hidden="true">C</div>
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to Chatly</h1>
        <p className="auth-subtitle">Pick up your conversations where you left off.</p>
        <form onSubmit={onSubmitHandler}>

          <div>
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              autoComplete="username"
              required
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              placeholder='your_username' />
          </div>
          <div>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              autoComplete="current-password"
              required
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder='Enter your password' />
          </div>
          <button type="submit" className="primary-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
        </form>
      </section>
    </main>
  )
}

export default Login
