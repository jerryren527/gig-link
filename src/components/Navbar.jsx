import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { username, id, role } = useAuth();
	console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ role:", role);
	console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ id:", id);
	console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ username:", username);
	// If at /inbox, do not show Inbox link
	const atHome = pathname === `/`;
	const atInbox = pathname === `/inbox`;
	const atLogIn = pathname === `/login`;
	const atSignUp = pathname === `/signup`;

	const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate("/");
		}
	}, [isSuccess, navigate]);

	if (isLoading) {
		return <p>Logging Out...</p>;
	}

	if (isError) {
		return <p>Error: {error.data?.message}</p>;
	}

	console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ atInbox:", atInbox);
	return (
		<>
			<div className="navbar">
				<div className="navbar__links">
					<Link className="navbar__link" to="/">
						<b>gig</b> link.
					</Link>
				</div>

				<div className="navbar__links">
					{username && (
						<Link className="navbar__link" to="/dashboard">
							Dashboard
						</Link>
					)}
					{!atInbox && username && (
						<Link className="navbar__link" to="/dashboard/inbox">
							Inbox
						</Link>
					)}
					{!atLogIn && !username && (
						<Link className="navbar__link" to="/login">
							Login
						</Link>
					)}
					{!atSignUp && !username && (
						<Link className="navbar__link" to="/signup">
							Sign Up
						</Link>
					)}
					{username && (
						<Link className="navbar__link" onClick={sendLogout}>
							Logout
						</Link>
					)}
				</div>
			</div>
		</>
	);
};

export default Navbar;
