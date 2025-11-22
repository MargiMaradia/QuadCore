import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout & Protected Route
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Deliveries from "./pages/Deliveries";
import Documents from "./pages/Documents";
import MoveHistory from "./pages/MoveHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StockLedger from "./pages/StockLedger";
import Warehouses from "./pages/Warehouses";

const App = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage and verify with backend
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Verify user with backend
          try {
            const { authAPI } = require('./services/api');
            const currentUser = await authAPI.getMe();
            // Update user data from database
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            console.error('Failed to verify user:', error);
            // Token might be expired, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (e) {
          console.error('Error parsing saved user:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    };
    
    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes Wrapped in Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="inventory" element={<Inventory user={user} />} />
          <Route path="deliveries" element={<Deliveries user={user} />} />
          <Route path="documents" element={<Documents user={user} />} />
          <Route path="move-history" element={<MoveHistory user={user} />} />
          <Route path="stock-ledger" element={<StockLedger user={user} />} />
          <Route path="ledger" element={<StockLedger user={user} />} />
          <Route path="warehouses" element={<Warehouses user={user} />} />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="settings" element={<Settings user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
