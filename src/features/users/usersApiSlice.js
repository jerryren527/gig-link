import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"; // createEntityAdapter simplifies working with normalized data in the Redux store.
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({}); // empty object arg means provide no customization for RTK when it generates pre-defined reducer functions and selectors.

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => "/users", // define the url endpoint
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			transformResponse: (responseData) => {
				// transforms raw api response before updating the store state.
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers); // update the state with loaded users
			},
			providerTags: (result, error, arg) => {
				if (result?.ids) {
					return [{ type: "User", id: "LIST" }, ...result.ids.map((id) => ({ type: "User", id }))];
				} else return [{ type: "User", id: "LIST" }];
			},
		}),
		addUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "POST",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "PATCH",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => ({
				url: `/users`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
	}),
});

// RTK Query generated these reducer functions that will make queries/mutations to the API and set state.
export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice;

export const selectUserResult = usersApiSlice.endpoints.getUsers.select(); // get query result

// create memoized selector by calling .createSelector() function
const selectUsersData = createSelector(
	selectUserResult,
	(usersResult) => usersResult.data // .data refers to the normalized data that was fetched from the endpoint
);

// RTK Query generates these selectors when .getSelectors() is called
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
