import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const messagesAdapter = createEntityAdapter({});

const initialState = messagesAdapter.getInitialState();

export const messagesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: () => ({
				url: "/messages",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedMessagess = responseData.map((message) => {
					message.id = message._id;
					return message;
				});
				return messagesAdapter.setAll(initialState, loadedMessagess);
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "Message", id: "LIST" }, ...result.ids.map((id) => ({ type: "Message", id }))];
				} else return [{ type: "Message", id: "LIST" }];
			},
		}),
		addMessage: builder.mutation({
			query: (initialMessageData) => ({
				url: "/messages",
				method: "POST",
				body: {
					...initialMessageData,
				},
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
	}),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApiSlice;

export const selectMessageResult = messagesApiSlice.endpoints.getMessages.select();

const selectMessagesData = createSelector(selectMessageResult, (messagesResult) => messagesResult.data);

export const {
	selectAll: selectAllMesssages,
	selectById: selectMessageById,
	selectIds: selectMessageIds,
} = messagesAdapter.getSelectors((state) => selectMessagesData(state) ?? initialState);
