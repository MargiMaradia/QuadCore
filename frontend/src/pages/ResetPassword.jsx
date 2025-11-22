import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      alert("Invalid OTP! (Hint: Use 123456)");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Mock password reset logic
    alert("Password reset successful! Please login with your new password.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-silk-sand flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-sm border border-silk-clay w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-silk-charcoal">Reset Password</h2>
          <p className="text-silk-mauve">Enter OTP sent to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">OTP Code</label>
            <input 
              type="text" required
              placeholder="Enter 6-digit OTP"
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold tracking-widest text-center font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">New Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Confirm New Password</label>
            <input 
              type="password" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Reset Password
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
