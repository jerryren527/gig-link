import React, { useEffect, useState } from "react";
import { useAddUserMutation } from "../../users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../config/constants";
import useTitle from "../../../hooks/useTitle";

const SignUp = () => {
	useTitle("Gig-Link | Sign Up");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [addUser, { isLoading, isSuccess, isError, error }] = useAddUserMutation();

	const navigate = useNavigate();

	// if (isLoading) {
	// 	return <p>Creating new user...</p>;
	// }

	useEffect(() => {
		if (isSuccess) {
			setUsername("");
			setPassword("");
			setRole("");
			setFirstName("");
			setLastName("");
			navigate("/login");
		}
		if (isError) {
			alert(`Error: ${error?.data?.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted");
		await addUser({ username, password, role, firstName, lastName });
	};
	return (
		<div className="auth-page">
			<h2 className="auth-page__header">Sign Up</h2>
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
				<div className="auth-form__input">
					<label htmlFor="firstName-input">FirstName: </label>
					<input
						id="firstName-input"
						name="firstName"
						value={firstName}
						type="tet"
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className="auth-form__input">
					<label htmlFor="lastName-input">LastName: </label>
					<input
						id="lastName-input"
						name="lastName"
						value={lastName}
						type="tet"
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
				</div>

				<div className="auth-form__input">
					<label htmlFor="role-input">Role: </label>
					<select id="role-input" onChange={(e) => setRole(e.target.value)} value={role}>
						<option value="">-- Select --</option>
						{Object.entries(ROLES).map(([key, value]) => (
							<option key={key} value={value}>
								{value}
							</option>
						))}
					</select>
				</div>
				<div className="auth-form__button">
					<button type="submit" className="btn">
						Sign Up &rarr;
					</button>
				</div>
			</form>
		</div>
	);
};

export default SignUp;
