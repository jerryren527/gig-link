import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"; // createEntityAdapter simplifies working with normalized data in the Redux store.
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({}); // empty object arg means provide no customization for RTK when it generates pre-defined reducer functions and selectors.

const initialState = reviewsAdapter.getInitialState();

export const reviewsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getReviews: builder.query({
			query: () => ({
				url: "/reviews", // define the url endpoint
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				// transforms raw api response before updating the store state.
				const loadedReviews = responseData.map((review) => {
					review.id = review._id;
					return review;
				});
				return reviewsAdapter.setAll(initialState, loadedReviews); // update the state with loaded reviews
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "Review", id: "LIST" }, ...result.ids.map((id) => ({ type: "Review", id }))];
				} else return [{ type: "Review", id: "LIST" }];
			},
		}),
		addReview: builder.mutation({
			query: (initialReviewData) => ({
				url: "/reviews",
				method: "POST",
				body: {
					...initialReviewData,
				},
			}),
			invalidatesTags: [{ type: "Review", id: "LIST" }],
		}),
		updateReview: builder.mutation({
			query: (initialReviewData) => ({
				url: "/reviews",
				method: "PUT",
				body: {
					...initialReviewData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Review", id: arg.id }],
		}),
		deleteReview: builder.mutation({
			query: ({ reviewId }) => ({
				url: `/reviews`,
				method: "DELETE",
				body: { reviewId },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Review", id: arg.id }],
		}),
	}),
});

// RTK Query generated these reducer functions that will make queries/mutations to the API and set state.
export const { useGetReviewsQuery, useAddReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } =
	reviewsApiSlice;

export const selectReviewResult = reviewsApiSlice.endpoints.getReviews.select(); // get query result

// create memoized selector by calling .createSelector() function
const selectReviewsData = createSelector(
	selectReviewResult,
	(reviewsResult) => reviewsResult.data // .data refers to the normalized data that was fetched from the endpoint
);

// RTK Query generates these selectors when .getSelectors() is called
export const {
	selectAll: selectAllReviews,
	selectById: selectReviewById,
	selectIds: selectReviewIds,
} = reviewsAdapter.getSelectors((state) => selectReviewsData(state) ?? initialState);
