import { Link } from "react-router-dom";
import { ROLES } from "../../config/constants";
import { useGetUsersQuery } from "./usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import useTitle from "../../hooks/useTitle";

const UserList = () => {
	useTitle(`Gig-Link | Users`);
	const { role } = useAuth();
	const [searchInput, setSearchInput] = useState("");

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let filteredUsers;

	if (role === ROLES.Client) {
		filteredUsers = users?.ids.filter((id) => users.entities[id].role === ROLES.Freelancer);
	} else if (role === ROLES.Freelancer) {
		filteredUsers = users?.ids.filter(
			(id) => users.entities[id].role === ROLES.Freelancer || users.entities[id].role === ROLES.Client
		);
	} else {
		filteredUsers = users?.ids;
	}

	if (searchInput.length > 0) {
		filteredUsers = filteredUsers?.filter((userId) => users?.entities[userId].username.match(searchInput));
	}

	let header;
	if (role === ROLES.Client) {
		header = <h2>All Freelancers</h2>;
	} else if (role === ROLES.Freelancer) {
		header = <h2>All Clients and Freelancers</h2>;
	} else {
		header = <h2>All Users</h2>;
	}

	return (
		<div className="users-list-page">
			{header}
			{role === ROLES.Admin && (
				<div className="users-list-page__add-user-link">
					<Link to={`/dashboard/users/new`} className="link">
						Add User &gt;
					</Link>
				</div>
			)}
			<div className="search-bar">
				<input
					type="search"
					placeholder="Search here"
					onChange={(e) => setSearchInput(e.target.value)}
					value={searchInput}
				/>
			</div>

			<div className="users-list-page__table-container">
				<table className="table users-table">
					<thead>
						<tr>
							<th>Username</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers &&
							filteredUsers?.map((id) => {
								const user = users?.entities[id];

								return (
									user && (
										<tr key={user.id}>
											<td>
												<Link to={`profile/${user.id}`} className={"profile-link"}>
													{user.username}
												</Link>
											</td>
											<td>{user.role}</td>
										</tr>
									)
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UserList;
