import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'warehouse_staff',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Mock registration logic
    alert(`Registration successful as ${formData.role.replace('_', ' ')}! Please sign in.`);
    navigate('/login');
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
            className="w-full bg-silk-charcoal text-silk-gold py-3 font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Register
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
