import React from "react";
import { useSelector } from "react-redux";
import { selectMessageById, useGetMessagesQuery } from "../messages/messagesApiSlice";
import { selectUserById, useDeleteMessageMutation } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { memo } from "react";

const Messages = ({ messages }) => {
	// use RTK Query generated hooks instead of generated selectors. selectors are selecting nothing sometimes.
	const { data, isLoading, isSuccess, isError, error, refetch } = useGetMessagesQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted);
	});

	let content;
	if (messages) {
		if (messages.length === 0) {
			content = <p>Nothing available here...</p>;
		} else {
			content = messages.map((id) => {
				// const message = useSelector(state => selectMessageById(state, id))
				const message = data?.entities[id];
				return (
					<div className="message-container">
						<p>{message?.title}</p>
						<p>{message?.body}</p>
						<p>{message?.senderUsername}</p>
						<p>{message?.recipientUsername}</p>
						<p>{message?.createdAt}</p>
						<hr />
					</div>
				);
			});
		}
	}

	return <div>{content}</div>;
};

// Create a memoized Note. This Note component will only re-render if there are any changes to the data -- if the prop passed into it changes.
const memoizedMessages = memo(Messages);
export default memoizedMessages;
