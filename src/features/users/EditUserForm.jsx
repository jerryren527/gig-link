import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../config/constants";
import { useSendLogoutMutation } from "../auth/authApiSlice";

const EditUserForm = ({ user }) => {
	const [username, setUsername] = useState(user.username);
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName);
	const [skills, setSkills] = useState(user.skills);
	const [role, setRole] = useState(user.role);

	console.log("🚀 ~ file: EditUserForm.jsx:13 ~ EditUserForm ~ skills:", skills);
	console.log("🚀 ~ file: EditUserForm.jsx:13 ~ EditUserForm ~ typeof skills:", typeof skills);
	const navigate = useNavigate();
	const { id, username: loggedInUsername } = useAuth();

	const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();

	const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delError }] = useDeleteUserMutation();

	const [sendLogout] = useSendLogoutMutation();

	useEffect(() => {
		console.log("isSuccess:", isSuccess);
		console.log("isDelSuccess:", isDelSuccess);
		if (isSuccess || isDelSuccess) {
			setUsername("");
			setPassword("");
			setFirstName("");
			setLastName("");
			setSkills("");
			setRole("");
			navigate(`/dashboard/users/profile/${id}`);
		}
	}, [isSuccess, isDelSuccess, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("submitted");
			// if password is provided
			if (password) {
				await updateUser({ id: user.id, username, firstName, lastName, skills, password, role });
			} else {
				await updateUser({ id: user.id, username, firstName, lastName, skills, role });
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleDelete = async () => {
		try {
			console.log("deleted");
			await deleteUser({ id: user.id });

			alert(`${loggedInUsername} deleted permanently`);
			await sendLogout();
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<h2>EditUserForm</h2>
			<div>
				<button onClick={handleDelete}>Delete User</button>
			</div>
			<form className="edit-user-form" onSubmit={handleSubmit}>
				<div className="edit-user-form__input">
					<label htmlFor="username-input">Username: </label>
					<input id="username-input" value={username} type="text" onChange={(e) => setUsername(e.target.value)} />
				</div>

				<div className="edit-user-form__input">
					<label htmlFor="password-input">Password: </label>
					<input id="password-input" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
				</div>

				<div className="edit-user-form__input">
					<label htmlFor="firstName-input">First Name: </label>
					<input id="firstName-input" value={firstName} type="text" onChange={(e) => setFirstName(e.target.value)} />
				</div>

				<div className="edit-user-form__input">
					<label htmlFor="lastName-input">Last Name: </label>
					<input id="lastName-input" value={lastName} type="text" onChange={(e) => setLastName(e.target.value)} />
				</div>

				<div className="edit-user-form__input" hidden={role !== ROLES.Freelancer}>
					<label htmlFor="skills-input">Skills: </label>
					<input id="skills-input" value={skills} type="text" onChange={(e) => setSkills(e.target.value)} />
				</div>

				<div className="edit-user-form__input" hidden={role !== ROLES.Admin}>
					<label htmlFor="role-input">Role: </label>
					<select id="role-input" value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="">-- Select --</option>
						<option value="Client">Client</option>
						<option value="Freelancer">Freelancer</option>
						<option value="Admin">Admin</option>
					</select>
				</div>

				<div className="btn">
					<button type="submit">Save</button>
				</div>
			</form>
		</>
	);
};

const memoizedEditUserForm = memo(EditUserForm);
export default memoizedEditUserForm;
