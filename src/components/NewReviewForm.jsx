import React, { memo } from "react";

const NewReviewForm = ({ handleAddReview, review, setReview, rating, setRating }) => {
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ setRating:", setRating);
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ rating:", rating);
	console.log("🚀 ~ file: NewReviewForm.jsx:4 ~ NewReviewForm ~ typeof rating:", typeof rating);
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
				<select id="rating-input" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} required>
					<option value="">-- Select Rating --</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>

			<button onClick={handleAddReview} className="btn">
				Add a Review
			</button>
		</form>
	);
};

const memoizedNewReviewForm = memo(NewReviewForm);
export default memoizedNewReviewForm;
