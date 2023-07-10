import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "./usersApiSlice";
import { ROLES } from "../../config/constants";
import { useAddReviewMutation, useDeleteReviewMutation, useGetReviewsQuery } from "../reviews/reviewsApiSlice";

const UserProfile = () => {
	const { userId } = useParams(); // profile user id
	// const { userId } = useParams();
	const { id, username, role } = useAuth(); // logged in user

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

	const { data: reviews } = useGetReviewsQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const [addReview, { isLoading: isAddReviewLoading }] = useAddReviewMutation();
	const [deleteReview, { isLoading: isDeleteReviewLoading }] = useDeleteReviewMutation();

	const [client, setClient] = useState(id);
	const [freelancer, setFreelancer] = useState(userId);
	const [review, setReview] = useState("");
	const [rating, setRating] = useState("");

	if (reviews) {
		console.log("reviews", reviews);
	}

	const handleAddReview = async (e) => {
		e.preventDefault();
		console.log("add review clicked! ");
		await addReview({ client, freelancer, review, rating });
	};

	const handleDeleteReview = async (reviewId) => {
		console.log("delete review clicked! ");
		console.log("🚀 ~ file: UserProfile.jsx:53 ~ handleDeleteReview ~ reviewId:", reviewId);
		await deleteReview({ reviewId });
	};

	// const user = users?.entities[userId];

	// // ids, entities
	const profileUser = users?.entities[userId];

	// if logged in User has not added a review for freelancer, show Add Review button
	let reviewContainer;
	if (role === ROLES.Client && profileUser?.role === ROLES.Freelancer) {
		// if logged in User has already added a review for freelancer, show Remove Review button
		const freelancerReviewId = reviews?.ids.find((reviewId) => {
			const review = reviews?.entities[reviewId];
			console.log("🚀 ~ file: UserProfile.jsx:52 ~ freelancerReview ~ review:", review);
			return review.client === id;
		});
		if (!freelancerReviewId) {
			reviewContainer = (
				<form onSubmit={handleAddReview}>
					<div className="review-form__input">
						<label htmlFor="client-input">Client Id: </label>
						<input
							id="client-input"
							value={client}
							type="text"
							onChange={(e) => setClient(e.target.value)}
							required
							disabled
						/>
					</div>

					<div className="review-form__input">
						<label htmlFor="freelancer-input">Freelancer Id: </label>
						<input
							id="freelancer-input"
							value={freelancer}
							type="text"
							onChange={(e) => setFreelancer(e.target.value)}
							required
							disabled
						/>
					</div>

					<div className="review-form__input">
						<label htmlFor="review-input">Review: </label>
						<textarea
							id="review-input"
							value={review}
							type="text"
							onChange={(e) => setReview(e.target.value)}
							required
						/>
					</div>

					<div className="review-form__input">
						<label htmlFor="rating-input">Rating: </label>
						<input
							id="rating-input"
							type="number"
							value={rating}
							onChange={(e) => setRating(e.target.value)}
							required
						/>
					</div>

					<button onClick={handleAddReview}>Add a Review</button>
				</form>
			);
		} else {
			const review = reviews?.entities[freelancerReviewId];
			console.log("🚀 ~ file: UserProfile.jsx:120 ~ UserProfile ~ review:", review);

			reviewContainer = (
				<div>
					<p>{review.review}</p>
					<p>{review.rating}</p>
					<button onClick={() => handleDeleteReview(freelancerReviewId)}>Delete My Review</button>
				</div>
			);
		}
	}

	return (
		<>
			<h2>User Profile</h2>
			<p>userId: {userId}</p>
			<p>username: {profileUser?.username}</p>
			<p>firstName: {profileUser?.firstName}</p>
			<p>lastName: {profileUser?.lastName}</p>
			<p>role: {profileUser?.role}</p>
			<p>skills: {profileUser?.skills.length > 0 ? profileUser.skills.join(", ") : "None"}</p>
			<br />
			<hr />
			{id === userId && <Link to={`../edit/${userId}`}>Edit Profile</Link>}
			{reviewContainer && reviewContainer}
		</>
	);
};

export default UserProfile;
