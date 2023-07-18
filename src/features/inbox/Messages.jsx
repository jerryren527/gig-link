import React from "react";
import { useGetMessagesQuery } from "../messages/messagesApiSlice";
import { memo } from "react";
import { formatDateTime } from "../../config/utils";

const Messages = ({ messages }) => {
	const { data } = useGetMessagesQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;
	if (messages) {
		if (messages.length === 0) {
			content = <p>Nothing available here...</p>;
		} else {
			content = messages.map((id) => {
				const message = data?.entities[id];
				return (
					<div className="message" key={id}>
						<p>
							<b>{message?.title}</b>
						</p>
						<p>
							<span>{message?.body}</span>
						</p>
						<p>
							From: <span className="message-body">{message?.senderUsername}</span>
						</p>
						<p>
							To: <span className="message-body">{message?.recipientUsername}</span>
						</p>
						<p>{formatDateTime(message?.createdAt)}</p>
					</div>
				);
			});
		}
	}

	return <div>{content}</div>;
};

const memoizedMessages = memo(Messages);
export default memoizedMessages;
