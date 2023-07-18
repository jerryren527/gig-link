import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import Messages from "./Messages";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const Inbox = () => {
	useTitle(`Gig-Link | Inbox`);
	const { id } = useAuth();

	const { data: users } = useGetUsersQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const user = users?.entities[id];

	return (
		<>
			<h2>Inbox</h2>
			<Link to="/dashboard/inbox/new" className="link-btn">
				Compose New Message
			</Link>
			<div className="messages">
				<div>
					<h3>Sent Messages</h3>
					{user && <Messages messages={user.sentMessages} />}
				</div>

				<div>
					<h3>Received Messages</h3>
					{user && <Messages messages={user.receivedMessages} />}
				</div>
			</div>
		</>
	);
};

export default Inbox;
