import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import useTitle from "../../../hooks/useTitle";

const LogIn = () => {
	useTitle("Gig-Link | Login");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// 'login' is the mutation function, 'isLoading' is a destructured property from the hook's result.
	const [login, { isLoading }] = useLoginMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Submitted!");

		try {
			const { accessToken } = await login({ username, password }).unwrap(); // use .unwrap() because RTK query comes with its own error handling methods. If you do not want to use them and instead use try-catch blocks, use .unwrap()

			console.log("accessToken", accessToken);
			dispatch(setCredentials({ accessToken })); // set state.accessToken = accessToken
			setUsername("");
			setPassword("");
			navigate("/dashboard"); // navigating to another page invokes api/mutations/removeMutationResults action, which clears auth.state.token
		} catch (err) {
			if (!err.status) {
				// the only time 'err' will have no status is if there was no server response.
				console.log("No Server Response");
			} else if (err.status === 400) {
				console.log("Missing Username or Password");
			} else if (err.status === 401) {
				console.log("Unauthorized");
			} else {
				console.log(err.data?.message);
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
