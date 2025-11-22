import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'warehouse_staff',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        phone: formData.phone || ''
      });

      // Verify response has required fields
      if (!response.token || !response._id) {
        throw new Error('Invalid response from server');
      }

      // Save token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      console.log('User registered successfully:', response.email);
      alert(`Registration successful as ${formData.role.replace('_', ' ')}! Redirecting to dashboard...`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2 className="text-2xl font-bold text-silk-charcoal">Create Account</h2>
          <p className="text-silk-mauve">Join StockSync today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Full Name</label>
            <input 
              type="text" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Role</label>
            <select 
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="warehouse_staff">Warehouse Staff</option>
              <option value="inventory_manager">Inventory Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Confirm Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-silk-mauve">Already have an account? </span>
          <Link to="/login" className="text-silk-charcoal font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
