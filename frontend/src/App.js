import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Deliveries from './pages/Deliveries';
import Documents from './pages/Documents';
import StockLedger from './pages/StockLedger';
import './App.css';

// Axios defaults
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Protected Route wrapper component
const ProtectedRouteWrapper = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle logout with navigation
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <Layout user={user} onLogout={handleLogout}>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRouteWrapper>
                <Dashboard />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRouteWrapper>
                <Inventory />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/warehouses"
            element={
              <ProtectedRouteWrapper>
                <Warehouses />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRouteWrapper>
                <Profile />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRouteWrapper>
                <Settings />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/deliveries"
            element={
              <ProtectedRouteWrapper>
                <Deliveries />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRouteWrapper>
                <Documents />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/ledger"
            element={
              <ProtectedRouteWrapper>
                <StockLedger />
              </ProtectedRouteWrapper>
            }
          />

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;