import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"; // createEntityAdapter simplifies working with normalized data in the Redux store.
import { apiSlice } from "../../app/api/apiSlice";

const proposalsAdapter = createEntityAdapter({});

const initialState = proposalsAdapter.getInitialState();

export const proposalsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProposals: builder.query({
			query: () => "/proposals",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				const loadedProposals = responseData.map((proposal) => {
					proposal.id = proposal._id;
					return proposal;
				});
				return proposalsAdapter.setAll(initialState, loadedProposals);
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "Proposal", id: "LIST" }, ...result.ids.map((id) => ({ type: "Proposal", id }))];
				} else {
					return [{ type: "Proposal", id: "LIST" }];
				}
			},
		}),
		addProposal: builder.mutation({
			query: (initialProposalData) => ({
				url: "/proposals",
				method: "POST",
				body: {
					...initialProposalData,
				},
			}),
			invalidatesTags: [{ type: "Proposal", id: "LIST" }],
		}),
		deleteProposal: builder.mutation({
			query: ({ jobId, freelancerUsername }) => ({
				url: `/proposals`,
				method: "DELETE",
				body: { jobId, freelancerUsername },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Proposal", id: arg.id }],
		}),
	}),
});

export const { useGetProposalsQuery, useAddProposalMutation, useDeleteProposalMutation } = proposalsApiSlice;

export const selectProposalResult = proposalsApiSlice.endpoints.getProposals.select();

const selectProposalsData = createSelector(selectProposalResult, (proposalsResult) => proposalsResult.data);

export const {
	selectAll: selectAllProposals,
	selectById: selectProposalById,
	selectIds: selectProposalIds,
} = proposalsAdapter.getSelectors((state) => selectProposalsData(state) ?? initialState);
