import React, { useEffect, useState } from "react";
import { useAddUserMutation } from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";

const NewUserForm = () => {
	useTitle(`Gig-Link | New User`);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [role, setRole] = useState("");

	const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddUserMutation();

	useEffect(() => {
		if (isSuccess) {
			alert(`User ${username} added successfully.`);
			setUsername("");
			setPassword("");
			setFirstName("");
			setLastName("");
			setRole("");
		}
		if (isError) {
			alert(`Error: ${error?.data?.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted!");
		if (role) {
			await addNewUser({ username, password, firstName, lastName, role });
		} else {
			alert("Role is missing");
		}
	};

	return (
		<div className="new-user-form-page">
			<h2 className="new-user-form-page--header">New User Form</h2>
			<form className="new-user-form" onSubmit={handleSubmit}>
				<div className="new-user-form__input">
					<label htmlFor="username-input">Username: </label>
					<input
						id="username-input"
						value={username}
						type="text"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>

				<div className="new-user-form__input">
					<label htmlFor="password-input">Password: </label>
					<input
						id="password-input"
						value={password}
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div className="new-user-form__input">
					<label htmlFor="firstName-input">First Name: </label>
					<input
						id="firstName-input"
						value={firstName}
						type="text"
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className="new-user-form__input">
					<label htmlFor="lastName-input">Last Name: </label>
					<input
						id="lastName-input"
						value={lastName}
						type="text"
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
				</div>
				<div className="new-user-form__input">
					<label htmlFor="role-input">Role: </label>
					<select id="role-input" value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="">-- Select --</option>
						<option value="Client">Client</option>
						<option value="Freelancer">Freelancer</option>
						<option value="Admin">Admin</option>
					</select>
				</div>
				<div>
					<button type="submit" className="btn">
						Add User
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewUserForm;
