import { ROLES } from "../../config/constants";
import { useGetUsersQuery } from "./usersApiSlice";

const UserList = () => {
	const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery(undefined, {
		pollingInterval: 60000,	// 60 seconds requery the data.
		refetchOnFocus: true,	// if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true	// refetch the data when component is re-mounted
	});
	console.log("🚀 ~ file: UsersList.jsx:5 ~ UserList ~ users:", users)

	return (
		<>
			<h2>All Frelancers</h2>
			<div>
				{users && users.ids.map(id => {
					const user = users.entities[id].role === ROLES.Freelancer ? users.entities[id] : null

					return (
						user && (
							<div key={user.id}>
								<p>{user.username}</p>
								<p>{user.role}</p>
								<hr />
							</div>
						)
					)

				})}
			</div>
		</>
	);

}


export default UserList;
