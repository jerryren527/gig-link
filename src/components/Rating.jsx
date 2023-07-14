import React from "react";

const Rating = ({ rating, maxRating }) => {
	console.log("🚀 ~ file: Rating.jsx:4 ~ Rating ~ maxRating:", maxRating);
	console.log("🚀 ~ file: Rating.jsx:4 ~ Rating ~ rating:", rating);

	return (
		<>
			{Array.from({ length: maxRating }).map((_, index) => (
				<>
					{index < rating ? (
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
		</>
	);
};

export default Rating;
