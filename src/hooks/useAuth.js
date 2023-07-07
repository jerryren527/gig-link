import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
	const token = useSelector(selectCurrentToken);

	if (token) {
		const decoded = jwtDecode(token);
		const { id, username, role } = decoded.UserInfo;

		return { id, username, role };
	}

	return { id: "", username: "", role: "" };
};

export default useAuth;
