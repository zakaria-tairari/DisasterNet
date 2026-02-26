import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const GuestMiddleware = () => {
  const {user, loading} = useContext(AuthContext);

  if (loading) return null;

  if (user) return <Navigate to={`/${user.role}`} replace />;

  return <Outlet />;
}

export default GuestMiddleware