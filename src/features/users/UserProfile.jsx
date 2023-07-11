import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "./usersApiSlice";
import { ROLES } from "../../config/constants";
import { useAddReviewMutation, useDeleteReviewMutation, useGetReviewsQuery } from "../reviews/reviewsApiSlice";
import { useAddRequestMutation, useGetRequestsQuery } from "../requests/requestsApiSlice";
import NewRequestForm from "../requests/NewRequestForm";

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

	const { data: reviews, refetch } = useGetReviewsQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const { data: requests, refetch: refetchRequests } = useGetRequestsQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const [addRequest, { isLoading: isAddRequestLoading }] = useAddRequestMutation();
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
		refetch();
	};

	const handleDeleteReview = async (reviewId) => {
		console.log("delete review clicked! ");
		console.log("🚀 ~ file: UserProfile.jsx:53 ~ handleDeleteReview ~ reviewId:", reviewId);
		await deleteReview({ reviewId });
		refetch();
	};

	// const user = users?.entities[userId];

	// // ids, entities
	const profileUser = users?.entities[userId];
	const loggedInUser = users?.entities[id];
	console.log("🚀 ~ file: UserProfile.jsx:61 ~ UserProfile ~ profileUser:", profileUser);
	console.log("🚀 ~ file: UserProfile.jsx:70 ~ UserProfile ~ loggedInUser:", loggedInUser);

	// if logged in User has not added a review for freelancer, show Add Review button
	let reviewContainer;
	let loggedInUserRequestForFreelancer;
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

			// Logged in User is a client, profile user is a freelancer. Check profileUser.recievedRequests and match with loggedInUser.postedRequests
			// clientRequestForFreelancer =
		} else {
			const review = reviews?.entities[freelancerReviewId];
			console.log("🚀 ~ file: UserProfile.jsx:120 ~ UserProfile ~ review:", review);

			reviewContainer = (
				<div>
					<p>Your Review:</p>
					<p>{review.review}</p>
					<p>{review.rating}</p>
					<button onClick={() => handleDeleteReview(freelancerReviewId)}>Delete My Review</button>
				</div>
			);
		}
		console.log("profileUser.receivedRequests", profileUser.receivedRequests);
		console.log("🚀 ~ file: UserProfile.jsx:143 ~ UserProfile ~ loggedInUser:", loggedInUser);
		loggedInUserRequestForFreelancer = profileUser?.receivedRequests.filter((requestId) =>
			loggedInUser?.postedRequests.includes(requestId)
		);
		console.log(
			"🚀 ~ file: UserProfile.jsx:145 ~ UserProfile ~ loggedInUserRequestForFreelancer:",
			loggedInUserRequestForFreelancer
		);
	}

	return (
		<>
			<h2>User Profile</h2>
			{profileUser?.role === ROLES.Freelancer && <h3>{`Rating: ${profileUser?.overallRating} out of 5`}</h3>}
			<p>userId: {userId}</p>
			<p>username: {profileUser?.username}</p>
			<p>firstName: {profileUser?.firstName}</p>
			<p>lastName: {profileUser?.lastName}</p>
			<p>role: {profileUser?.role}</p>
			<p>skills: {profileUser?.skills.length > 0 ? profileUser.skills.join(", ") : "None"}</p>
			<br />
			<hr />
			{id === userId && <Link to={`../edit/${userId}`}>Edit Profile</Link>}
			{profileUser?.freelancerReviews.map((reviewId) => {
				const review = reviews?.entities[reviewId];
				console.log("review", review);
				return (
					<div className="review">
						<p>{review?.client}</p>
						<p>{review?.freelancer}</p>
						<p>{review?.review}</p>
						<p>{review?.rating}</p>
						<hr />
					</div>
				);
			})}
			{reviewContainer && reviewContainer}
			{loggedInUserRequestForFreelancer &&
				loggedInUserRequestForFreelancer.map((requestId) => {
					const request = requests?.entities[requestId];
					console.log("request", request);
					return (
						<>
							<h3>Your Requests for this Freelancer:</h3>
							<div className="request">
								<p>{request?.client}</p>
								<p>{request?.freelancer}</p>
								<p>{request?.title}</p>
								<p>{request?.description}</p>
								<p>{request?.price}</p>
								<p>{request?.status}</p>
							</div>
						</>
					);
				})}
			{role === ROLES.Client && profileUser?.role === ROLES.Freelancer && (
				<NewRequestForm client={id} freelancer={profileUser?.id} />
			)}
		</>
	);
};

export default UserProfile;
