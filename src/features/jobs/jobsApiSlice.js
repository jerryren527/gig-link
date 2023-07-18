import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const jobsAdapter = createEntityAdapter({});

const initialState = jobsAdapter.getInitialState();

export const jobsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getJobs: builder.query({
			query: () => ({
				url: "/jobs",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedJobs = responseData.map((job) => {
					job.id = job._id;
					return job;
				});
				return jobsAdapter.setAll(initialState, loadedJobs);
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "Job", id: "LIST" }, ...result.ids.map((id) => ({ type: "Job", id }))];
				} else {
					return [{ type: "Job", id: "LIST" }];
				}
			},
		}),
		addJob: builder.mutation({
			query: (initialJobData) => ({
				url: "/jobs",
				method: "POST",
				body: {
					...initialJobData,
				},
			}),
			invalidatesTags: [{ type: "Job", id: "LIST" }],
		}),
		updateJob: builder.mutation({
			query: (initialJobData) => ({
				url: "/jobs",
				method: "PUT",
				body: {
					...initialJobData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Job", id: arg.id }],
		}),
		deleteJob: builder.mutation({
			query: ({ jobId }) => ({
				url: `/jobs`,
				method: "DELETE",
				body: { jobId },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Job", id: arg.id }],
		}),
		updateJobStatus: builder.mutation({
			query: ({ jobId, status }) => ({
				url: "/jobs/status",
				method: "PATCH",
				body: { jobId, status },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Job", id: arg.id }],
		}),
	}),
});

export const {
	useGetJobsQuery,
	useAddJobMutation,
	useUpdateJobMutation,
	useDeleteJobMutation,
	useUpdateJobStatusMutation,
} = jobsApiSlice;

export const selectJobResult = jobsApiSlice.endpoints.getJobs.select();

const selectJobsData = createSelector(selectJobResult, (jobsResult) => jobsResult.data);

export const {
	selectAll: selectAllJobs,
	selectById: selectJobById,
	selectIds: selectJobIds,
} = jobsAdapter.getSelectors((state) => selectJobsData(state) ?? initialState);
