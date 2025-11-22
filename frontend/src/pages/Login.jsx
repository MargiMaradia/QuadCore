import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockUsers } from '../data/mockData';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('alice@stockmaster.com'); // Default to manager
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock login
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
      navigate('/dashboard');
    } else {
      alert('User not found');
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Email Address</label>
            <select 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
            >
              {mockUsers.map(u => (
                <option key={u._id} value={u.email}>
                  {u.fullName} ({u.role})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <Link to="/forgot-password" class="text-sm text-silk-mauve hover:text-silk-charcoal">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Sign In
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
