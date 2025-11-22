import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      // Verify response has required fields
      if (!response.token || !response._id) {
        throw new Error('Invalid response from server');
      }

      // Save token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      console.log('User logged in successfully:', response.email);

      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(response);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silk-sand flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-sm border border-silk-clay w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 select-none mb-4">
            <div className="bg-silk-charcoal text-silk-gold px-2 py-1 font-bold text-xl tracking-wider">
              STOCK
            </div>
            <div className="border-2 border-silk-charcoal text-silk-charcoal px-2 py-1 font-bold text-xl tracking-wider">
              SYNC
            </div>
          </div>
          <h2 className="text-2xl font-bold text-silk-charcoal">Welcome Back</h2>
          <p className="text-silk-mauve">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-silk-mauve hover:text-silk-charcoal">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-silk-mauve">Don't have an account? </span>
          <Link to="/register" className="text-silk-charcoal font-bold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
