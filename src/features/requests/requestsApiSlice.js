import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"; // createEntityAdapter simplifies working with normalized data in the Redux store.
import { apiSlice } from "../../app/api/apiSlice";

const requestsAdapter = createEntityAdapter({});

const initialState = requestsAdapter.getInitialState();

export const requestsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getRequests: builder.query({
			query: () => "/requests",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				const loadedRequests = responseData.map((request) => {
					request.id = request._id;
					return request;
				});
				return requestsAdapter.setAll(initialState, loadedRequests);
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "Request", id: "LIST" }, ...result.ids.map((id) => ({ type: "Request", id }))];
				} else {
					return [{ type: "Request", id: "LIST" }];
				}
			},
		}),
		addRequest: builder.mutation({
			query: (initialRequestData) => ({
				url: "/requests",
				method: "POST",
				body: {
					...initialRequestData,
				},
			}),
			invalidatesTags: [{ type: "Request", id: "LIST" }],
		}),
		updateRequest: builder.mutation({
			query: (initialRequestData) => ({
				url: "/requests",
				method: "PUT",
				body: {
					...initialRequestData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Request", id: arg.id }],
		}),
		deleteRequest: builder.mutation({
			query: ({ requestId }) => ({
				url: `/requests`,
				method: "DELETE",
				body: { requestId },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Request", id: arg.id }],
		}),
		updateRequestStatus: builder.mutation({
			query: ({ requestId, status }) => ({
				url: `/requests/status`,
				method: "PATCH",
				body: { requestId, status },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Request", id: arg.id }],
		}),
	}),
});

export const {
	useGetRequestsQuery,
	useAddRequestMutation,
	useUpdateRequestMutation,
	useDeleteRequestMutation,
	useUpdateRequestStatusMutation,
} = requestsApiSlice;

export const selectRequestResult = requestsApiSlice.endpoints.getRequests.select();

const selectRequestsData = createSelector(selectRequestResult, (requestsResult) => requestsResult.data);

export const {
	selectAll: selectAllRequests,
	selectById: selectRequestById,
	selectIds: selectRequestIds,
} = requestsAdapter.getSelectors((state) => selectRequestsData(state) ?? initialState);
