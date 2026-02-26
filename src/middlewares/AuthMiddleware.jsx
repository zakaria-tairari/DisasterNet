import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const AuthMiddleware = ({ role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return <Outlet />;
};

export default AuthMiddleware;