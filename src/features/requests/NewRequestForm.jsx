import React, { useEffect, useState, memo } from "react";
import { useAddRequestMutation } from "./requestsApiSlice";
import useTitle from "../../hooks/useTitle";

const NewRequestForm = ({ client, freelancer, refetchRequests }) => {
	useTitle(`Gig-Link | New Request`);
	console.log("🚀 ~ file: NewRequestForm.jsx:4 ~ NewRequestForm ~ freelancer:", freelancer);
	console.log("🚀 ~ file: NewRequestForm.jsx:4 ~ NewRequestForm ~ client:", client);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");

	const [addNewRequest, { isLoading, isSuccess, isError, error }] = useAddRequestMutation();

	useEffect(() => {
		if (isSuccess) {
			alert(`Request added successfully.`);
			setTitle("");
			setDescription("");
			setPrice("");
			refetchRequests();
		}
		if (isError) {
			alert(`Error: ${error?.data?.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted!");
		await addNewRequest({ client, freelancer, title, description, price });
	};

	return (
		<>
			<h2>New Request Form</h2>
			<form className="new-request-form" onSubmit={handleSubmit}>
				<div className="new-request-form__input">
					<label htmlFor="title-input">Title: </label>
					<input id="title-input" value={title} type="text" onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div className="new-request-form__input">
					<label htmlFor="description-input">Description: </label>
					<input
						id="description-input"
						value={description}
						type="text"
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="new-request-form__input">
					<label htmlFor="price-input">Price: </label>
					<input id="price-input" value={price} type="number" onChange={(e) => setPrice(e.target.value)} required />
				</div>
				<div className="btn">
					<button type="submit">Add Request</button>
				</div>
			</form>
		</>
	);
};

const memoizedNewRequestForm = memo(NewRequestForm);
export default memoizedNewRequestForm;
