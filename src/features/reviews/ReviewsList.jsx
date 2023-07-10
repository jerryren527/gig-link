import React from "react";
import { useGetReviewsQuery } from "./reviewsApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../config/constants";

const ReviewsList = () => {
	const { id, username, role } = useAuth();

	const {
		data: reviews,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	} = useGetReviewsQuery(undefined, {
		pollingInterval: 15000, // 30 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const allReviews = reviews?.ids.map((id) => reviews.entities[id]);
	console.log("🚀 ~ file: ReviewsList.jsx:26 ~ ReviewsList ~ allReviews:", allReviews);

	return (
		<>
			{role === ROLES.Client && <h2>My Posted Reviews</h2>}
			{role === ROLES.Freelancer && <h2>My Received Reviews</h2>}
		</>
	);
};

export default ReviewsList;
