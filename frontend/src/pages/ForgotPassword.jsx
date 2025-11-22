import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock OTP sending logic
    alert(`OTP sent to ${email}. (Mock OTP: 123456)`);
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-silk-sand flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-sm border border-silk-clay w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-silk-charcoal">Forgot Password</h2>
          <p className="text-silk-mauve">Enter your email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silk-charcoal mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Send OTP
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
