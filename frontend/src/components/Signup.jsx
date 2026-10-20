import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';


const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-shell">
      <section className="auth-card wide">
        <div className="brand-mark auth-brand" aria-hidden="true">C</div>
        <p className="eyebrow">Get started</p>
        <h1>Create your Chatly account</h1>
        <p className="auth-subtitle">A simple space for direct, real-time conversations.</p>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name" required autoComplete="name"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              type="text"
              placeholder='Full Name' />
          </div>
          <div>
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username" required minLength="3" autoComplete="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              placeholder='your_username' />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email" required autoComplete="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="email"
              placeholder='Email' />
          </div>
          <div>
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password" required minLength="6" autoComplete="new-password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder='Password' />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password" required minLength="6" autoComplete="new-password"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              type="password"
              placeholder='Confirm Password' />
          </div>
          <fieldset className="gender-fieldset">
            <legend>Avatar style</legend>
            <label className={`avatar-choice ${user.gender === "male" ? 'chosen' : ''}`}>
              <input
                type="radio" name="gender"
                checked={user.gender === "male"}
                onChange={() => handleCheckbox("male")}
                required />
              <img src="/avatars/male.svg" alt="Male avatar preview" />
              <span>Male</span>
            </label>
            <label className={`avatar-choice ${user.gender === "female" ? 'chosen' : ''}`}>
              <input
                type="radio" name="gender"
                checked={user.gender === "female"}
                onChange={() => handleCheckbox("female")}
                required />
              <img src="/avatars/female.svg" alt="Female avatar preview" />
              <span>Female</span>
            </label>
          </fieldset>
          <button type="submit" className="primary-button" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  )
}

export default Signup
