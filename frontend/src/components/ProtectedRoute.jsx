import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // Check if user exists (from localStorage or state)
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (!user && !savedUser && !token) {
    return <Navigate to="/login" replace />;
  }

  // If user is provided, use it; otherwise try to parse from localStorage
  const currentUser = user || (savedUser ? JSON.parse(savedUser) : null);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
