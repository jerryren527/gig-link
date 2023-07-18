import React from "react";
import { useGetReviewsQuery } from "./reviewsApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../config/constants";

const ReviewsList = () => {
	const { role } = useAuth();

	const { data: reviews } = useGetReviewsQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const allReviews = reviews?.ids.map((id) => reviews.entities[id]);

	return (
		<>
			{role === ROLES.Client && <h2>My Posted Reviews</h2>}
			{role === ROLES.Freelancer && <h2>My Received Reviews</h2>}
		</>
	);
};

export default ReviewsList;
