import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import React from "react";

const RequireAuth = ({ allowedRoles }) => {
	const location = useLocation();
	const { role } = useAuth();

	const content = allowedRoles.includes(role) ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	); // If unauthorized to view route, navigate them to login page, and do not add query to history -- instead replace it with /login.

	return content;
};

export default RequireAuth;
