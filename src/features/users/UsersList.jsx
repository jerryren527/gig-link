import { Link } from "react-router-dom";
import { ROLES } from "../../config/constants";
import { useGetUsersQuery } from "./usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const UserList = () => {
	const { role } = useAuth();
	const [searchInput, setSearchInput] = useState("");

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});
	console.log("🚀 ~ file: UsersList.jsx:5 ~ UserList ~ users:", users);

	let filteredUsers;
	// Client will only see freelancers
	// Freelancers and Admin can see clients and freelancers
	if (role === ROLES.Client) {
		filteredUsers = users?.ids.filter((id) => users.entities[id].role === ROLES.Freelancer);
	} else if (role === ROLES.Freelancer) {
		filteredUsers = users?.ids.filter(
			(id) => users.entities[id].role === ROLES.Freelancer || users.entities[id].role === ROLES.Client
		);
	} else {
		filteredUsers = users?.ids;
	}

	// filter by search Input
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
		<>
			{header}
			<input
				type="search"
				placeholder="Search here"
				onChange={(e) => setSearchInput(e.target.value)}
				value={searchInput}
			/>

			<div>
				{filteredUsers &&
					filteredUsers?.map((id) => {
						const user = users.entities[id];

						return (
							user && (
								<div key={user.id}>
									{}
									<Link to={`profile/${user.id}`}>{user.username}</Link>
									<p>{user.role}</p>
									<hr />
								</div>
							)
						);
					})}
			</div>
		</>
	);
};

export default UserList;
