import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (!email) {
      setError("Email not found. Please start over from forgot password.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email, otp, newPassword);
      alert("Password reset successful! Please login with your new password.");
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silk-sand flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-sm border border-silk-clay w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-silk-charcoal">Reset Password</h2>
          <p className="text-silk-mauve">Enter OTP sent to {email}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">OTP Code</label>
            <input 
              type="text" required
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold tracking-widest text-center font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">New Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Confirm New Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-silk-charcoal font-bold hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
