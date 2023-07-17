import React from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectAllUsers, useGetUsersQuery } from "../users/usersApiSlice";
import { selectMessageById, selectMessageIds, useGetMessagesQuery } from "../messages/messagesApiSlice";
import Messages from "./Messages";
import NewMessageForm from "./NewMessageForm";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const Inbox = () => {
	useTitle(`Gig-Link | Inbox`);
	const { id, username, role } = useAuth();

	// It is a matter of preference whether you want to use the memoized selectors or the RTK Query generated hooks. Apparently the hooks are optimized to use cache results on repeating queries.

	// const usersFromSelector = useSelector(selectAllUsers)
	// const userFromsSelector = usersFromSelector.find(user => user.username === username)

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	console.log("🚀 ~ file: Inbox.jsx:15 ~ Inbox ~ users:", users);
	const user = users?.entities[id];
	console.log("🚀 ~ file: Inbox.jsx:24 ~ Inbox ~ user:", user);
	console.log("user.sentMessages", user?.sentMessages);
	console.log("user.receivedMessages", user?.receivedMessages);

	// console.log(messages)
	// const sentMessages = []
	// const receivedMessages = []

	// user?.sentMessages.forEach(messageId => {
	//   // find message
	//   const message = useSelector(state => selectMessageById(state, messageId))
	//   sentMessages.push(message)
	// })

	// user?.receivedMessages.forEach(messageId => {
	//   // find message
	//   const message = useSelector(state => selectMessageById(state, messageId))
	//   receivedMessages.push(message)
	// })

	// console.log('sentMessages', sentMessages)
	// console.log('receivedMessages', receivedMessages)

	console.log(username);
	console.log(role);
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
