import React, { useEffect, useState, memo } from "react";
import { useAddRequestMutation } from "./requestsApiSlice";
import useTitle from "../../hooks/useTitle";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NewRequestForm = () => {
	useTitle(`Gig-Link | New Request`);

	const { freelancerId } = useParams();
	const { id, username } = useAuth();
	const navigate = useNavigate();

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

			navigate(`/dashboard/users/profile/${freelancerId}`);
		}
		if (isError) {
			alert(`Error: ${error?.data?.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await addNewRequest({ client: id, freelancer: freelancerId, title, description, price });
	};

	return (
		<div className="new-request-form__container">
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
				<div className="new-request-form__button">
					<button type="submit" className="btn">
						Add Request
					</button>
				</div>
			</form>
		</div>
	);
};

// const memoizedNewRequestForm = memo(NewRequestForm);
// export default memoizedNewRequestForm;
export default NewRequestForm;
