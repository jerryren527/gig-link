import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import useTitle from "../../hooks/useTitle";

const LogIn = () => {
	useTitle("Gig-Link | Login");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Submitted!");

		try {
			const { accessToken } = await login({ username, password }).unwrap();

			dispatch(setCredentials({ accessToken }));
			setUsername("");
			setPassword("");
			navigate("/dashboard");
		} catch (err) {
			if (!err.status) {
				console.log("No Server Response");
				alert("No Server Response");
			} else if (err.status === 400) {
				console.log("Missing Username or Password");
				alert("Missing Username or Password");
			} else if (err.status === 401) {
				alert("Unauthorized");
			} else {
				alert(err.data?.message);
			}
		}
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}
	return (
		<div className="auth-page">
			<h2 className="auth-page__header">Login</h2>
			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="auth-form__input">
					<label htmlFor="username-input">Username: </label>
					<input
						id="username-input"
						name="username"
						value={username}
						type="text"
						onChange={(e) => setUsername(e.target.value)}
						autoCorrect="off"
						required
					/>
				</div>
				<div className="auth-form__input">
					<label htmlFor="password-input">Password: </label>
					<input
						id="password-input"
						name="password"
						value={password}
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="auth-form__button">
					<button type="submit" className="btn">
						Log In &rarr;
					</button>
				</div>
			</form>
		</div>
	);
};

export default LogIn;
