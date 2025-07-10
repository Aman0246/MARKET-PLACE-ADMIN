import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import LocationManagement from '../Pages/User/LocationManagement';

export default function PrivateRoute() {
  const user = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" />;
}
