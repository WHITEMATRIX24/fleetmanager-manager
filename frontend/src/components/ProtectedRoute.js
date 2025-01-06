// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Replace with your authentication logic

  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default ProtectedRoute;
