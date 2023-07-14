import React, { memo } from "react";

const NewReviewForm = ({ handleAddReview, review, setReview, rating, setRating }) => {
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ setRating:", setRating);
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ rating:", rating);
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ setReview:", setReview);
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ handleAddReview, review:", handleAddReview, review);
	return (
		<form onSubmit={handleAddReview} className="review-form">
			<div className="review-form__input">
				<label htmlFor="review-input">Review: </label>
				<textarea id="review-input" value={review} type="text" onChange={(e) => setReview(e.target.value)} required />
			</div>

			<div className="review-form__input">
				<label htmlFor="rating-input">Rating: </label>
				<input id="rating-input" type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
			</div>

			<button onClick={handleAddReview} className="btn">
				Add a Review
			</button>
		</form>
	);
};

const memoizedNewReviewForm = memo(NewReviewForm);
export default memoizedNewReviewForm;
