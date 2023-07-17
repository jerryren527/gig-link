import React, { useEffect, useState } from "react";
import { useAddMessageMutation } from "../messages/messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const NewMessageForm = () => {
	useTitle(`Gig-Link | New Message`);
	const { username } = useAuth();

	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [sender, setSender] = useState("");
	const [senderUsername, setSenderUsername] = useState(username);
	const [recipient, setRecipient] = useState("");
	const [recipientUsername, setRecipientUsername] = useState("");
	const [date, setDate] = useState("");

	const navigate = useNavigate();

	const [addNewMessage, { isLoading, isSuccess, isError, error }] = useAddMessageMutation();

	useEffect(() => {
		if (isSuccess) {
			alert("Message added successfully.");
			setTitle("");
			setBody("");
			setSenderUsername("");
			setRecipientUsername("");
			setDate("");
			navigate("/dashboard/inbox");
		}
		if (isError) {
			alert(`Error: ${error?.data.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted");
		await addNewMessage({ title, body, senderUsername, recipientUsername, date });
	};

	return (
		<div className="new-message-form-page">
			<h2 className="new-message-form-page__header">New Message Form</h2>
			<form className="new-message-form" onSubmit={handleSubmit}>
				<div className="new-message-form__input">
					<label htmlFor="title-input">Title: </label>
					<input id="title-input" value={title} type="text" onChange={(e) => setTitle(e.target.value)} required />
				</div>

				<div className="new-message-form__input">
					<label htmlFor="body-input">Body: </label>
					<input id="body-input" value={body} type="text" onChange={(e) => setBody(e.target.value)} required />
				</div>

				<div className="new-message-form__input">
					<label htmlFor="senderUsername-input">From: </label>
					<input
						id="senderUsername-input"
						value={senderUsername}
						type="text"
						onChange={(e) => setSenderUsername(e.target.value)}
						required
						disabled
					/>
				</div>

				<div className="new-message-form__input">
					<label htmlFor="recipientUsername-input">To: </label>
					<input
						id="recipientUsername-input"
						value={recipientUsername}
						type="text"
						onChange={(e) => setRecipientUsername(e.target.value)}
						required
					/>
				</div>

				<div>
					<button type="submit" className="btn">
						Send Message
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewMessageForm;
