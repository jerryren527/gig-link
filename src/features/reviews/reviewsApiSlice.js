import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({});

const initialState = reviewsAdapter.getInitialState();

export const reviewsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getReviews: builder.query({
			query: () => ({
				url: "/reviews",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedReviews = responseData.map((review) => {
					review.id = review._id;
					return review;
				});
				return reviewsAdapter.setAll(initialState, loadedReviews);
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

export const { useGetReviewsQuery, useAddReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } =
	reviewsApiSlice;

export const selectReviewResult = reviewsApiSlice.endpoints.getReviews.select();

const selectReviewsData = createSelector(selectReviewResult, (reviewsResult) => reviewsResult.data);

export const {
	selectAll: selectAllReviews,
	selectById: selectReviewById,
	selectIds: selectReviewIds,
} = reviewsAdapter.getSelectors((state) => selectReviewsData(state) ?? initialState);
