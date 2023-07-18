import React from "react";

const Rating = ({ rating, maxRating }) => {
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
