import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth && auth.role && auth.role.find(role => allowedRoles.includes(role))
            ? <Outlet />
            : auth && auth.token
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;