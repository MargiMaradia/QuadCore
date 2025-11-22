import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(response.message || 'OTP has been sent to your email address.');
      
      // In development, show OTP if provided
      if (response.otp) {
        setTimeout(() => {
          alert(`Development Mode: Your OTP is ${response.otp}`);
        }, 500);
      }

      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silk-sand flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-sm border border-silk-clay w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-silk-charcoal">Forgot Password</h2>
          <p className="text-silk-mauve">Enter your email to receive an OTP</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-silk-charcoal font-bold hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
