import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDeleteUserMutation, useGetUsersQuery } from "./usersApiSlice";
import { ROLES } from "../../config/constants";
import { useAddReviewMutation, useDeleteReviewMutation, useGetReviewsQuery } from "../reviews/reviewsApiSlice";
import { useGetRequestsQuery } from "../requests/requestsApiSlice";
import useTitle from "../../hooks/useTitle";
import Rating from "../../components/Rating";
import NewReviewForm from "../../components/NewReviewForm";
import { formatDecimal } from "../../config/utils";

const UserProfile = () => {
	const { userId } = useParams();
	const { id, username, role } = useAuth();

	useTitle(`Profile | ${username}`);

	const { data: users, refetch: refetchUsers } = useGetUsersQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { data: reviews, refetch } = useGetReviewsQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { data: requests, refetch: refetchRequests } = useGetRequestsQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const [addReview] = useAddReviewMutation();
	const [deleteReview] = useDeleteReviewMutation();
	const [deleteUser] = useDeleteUserMutation();

	const [client, setClient] = useState(id);
	const [freelancer, setFreelancer] = useState(userId);
	const [review, setReview] = useState("");
	const [rating, setRating] = useState(0);
	const navigate = useNavigate();

	const handleAddReview = async (e) => {
		e.preventDefault();
		console.log("add review clicked! ");
		await addReview({ client, freelancer, review, rating });
		refetch();
		refetchUsers();
	};

	const handleDeleteReview = async (reviewId) => {
		await deleteReview({ reviewId });
		refetch();
		refetchUsers();
	};

	const handleDeleteUser = async (profileUser) => {
		try {
			console.log("deleted user");
			await deleteUser({ id: profileUser?.id });

			alert(`${profileUser?.username} deleted permanently`);
			navigate("/dashboard/users");
		} catch (err) {
			console.log(err);
		}
	};

	const profileUser = users?.entities[userId];
	const loggedInUser = users?.entities[id];

	let reviewContainer;
	let loggedInUserRequestForFreelancer;
	if (role === ROLES.Client && profileUser?.role === ROLES.Freelancer) {
		const freelancerReviewId = reviews?.ids.find((reviewId) => {
			const review = reviews?.entities[reviewId];

			return review.client === id && review.freelancer === userId;
		});

		if (!freelancerReviewId) {
			reviewContainer = (
				<>
					<h3>New Review Form</h3>
					<NewReviewForm
						handleAddReview={handleAddReview}
						review={review}
						setReview={setReview}
						rating={rating}
						setRating={setRating}
					/>
				</>
			);
		} else {
			const review = reviews?.entities[freelancerReviewId];

			reviewContainer = (
				<>
					<button onClick={() => handleDeleteReview(freelancerReviewId)} className="btn btn--delete">
						Delete My Review
					</button>
				</>
			);
		}

		loggedInUserRequestForFreelancer = profileUser?.receivedRequests.filter((requestId) =>
			loggedInUser?.postedRequests.includes(requestId)
		);
	}

	return (
		<div className="user-profile-container">
			<h2>{profileUser?.username}'s Profile</h2>
			<div hidden={role !== ROLES.Admin}>
				<button className="btn btn--delete" onClick={() => handleDeleteUser(profileUser)}>
					Delete User
				</button>
			</div>

			{(profileUser?.role === ROLES.Freelancer && profileUser?.freelancerReviews?.length) > 0 ? (
				<h3>{`${profileUser?.freelancerReviews?.length} reviews`}</h3>
			) : profileUser?.role === ROLES.Freelancer ? (
				<h3>{`Be the first to review ${profileUser?.username}`}</h3>
			) : (
				<p>&nbsp;</p>
			)}

			{profileUser?.role === ROLES.Freelancer && profileUser?.overallRating ? (
				<>
					<Rating rating={profileUser?.overallRating} maxRating={5} /> {`${formatDecimal(profileUser?.overallRating)}`}
				</>
			) : (
				<h3>&nbsp;</h3>
			)}
			<div className="user-profile__info">
				<p>
					<b>User Id:</b> {userId}
				</p>
				<p>
					<b>Username:</b> {profileUser?.username}
				</p>
				<p>
					<b>First Name:</b> {profileUser?.firstName}
				</p>
				<p>
					<b>Last Name:</b> {profileUser?.lastName}
				</p>
				<p>
					<b>Role:</b> {profileUser?.role}
				</p>
				<p hidden={role !== ROLES.Freelancer}>
					<b>Skills:</b> {profileUser?.skills.length > 0 ? profileUser.skills.join(", ") : "None"}
				</p>
				<br />
				{id === userId && (
					<Link to={`../edit/${userId}`} className="link-btn">
						Edit Profile
					</Link>
				)}
			</div>

			{/* Freelancer Reviews */}
			{profileUser?.role === ROLES.Freelancer && <h3 id="freelancer-review-header">Freelancer Reviews:</h3>}
			<div className="freelancer-review-container">
				{profileUser?.role === ROLES.Freelancer && profileUser?.freelancerReviews?.length > 0 ? (
					profileUser?.freelancerReviews.map((reviewId) => {
						const review = reviews?.entities[reviewId];
						console.log("review", review);
						const clientUsername = users?.entities[review?.client]?.username;
						return (
							<div className="freelancer-review" key={reviewId}>
								{Array.from({ length: 5 }).map((_, index) => (
									<>
										{index < review?.rating ? (
											<span className="star star--filled" key={index}>
												&#9733;
											</span>
										) : (
											<span className="star" key={index}>
												&#9734;
											</span>
										)}
									</>
								))}
								<b> {clientUsername ? clientUsername : "N/A"}</b>
								<p className="freelancer-review--review">{review?.review}</p>
							</div>
						);
					})
				) : profileUser?.role === ROLES.Freelancer ? (
					<p>Nothing to see here...</p>
				) : (
					<p>&nbsp;</p>
				)}
			</div>

			{/* New Review Form or Your Reviews for freelancer */}
			{reviewContainer && <div className="review-form-container">{reviewContainer}</div>}

			{/* Your Requests and New Request Form */}
			{role === ROLES.Client &&
			profileUser?.role === ROLES.Freelancer &&
			loggedInUserRequestForFreelancer?.length > 0 ? (
				<div className="requests-list__table-container">
					<h3>Your Requests for this Freelancer:</h3>
					<table className="table requests-table">
						<thead>
							<tr>
								<th>Title</th>
								<th>Description</th>
								<th>Price (per hour)</th>
								<th>Request Status</th>
							</tr>
						</thead>
						<tbody>
							{loggedInUserRequestForFreelancer &&
								loggedInUserRequestForFreelancer.map((requestId) => {
									const request = requests?.entities[requestId];
									console.log("request", request);
									return (
										<tr key={request?.id}>
											<td>{request?.title}</td>
											<td>{request?.description}</td>
											<td>{request?.price}</td>
											<td>{request?.status}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			) : (
				<p>&nbsp;</p>
			)}
			{role === ROLES.Client && profileUser?.role === ROLES.Freelancer && (
				<Link className="link-btn" to={`../../requests/new/${profileUser.id}`}>
					Make a New Request
				</Link>
			)}
		</div>
	);
};

export default UserProfile;
