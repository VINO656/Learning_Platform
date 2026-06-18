import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  if (user && user.role !== 'admin') {
     return <Navigate to="/dashboard" replace />; 
  }

  return <Navigate to="/login" replace />;
};

export default AdminRoute;
