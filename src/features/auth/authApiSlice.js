import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	// Endpoint definitions (e.g. login, sendLogout, etc.)
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/auth/logIn",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(logOut()); // make state.token = null
					dispatch(apiSlice.util.resetApiState()); // This action is dispatched to reset the apiSlice state, which clears any cached data or errors related to API requests made through apiSlice.
				} catch (err) {
					console.log(err);
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			// Define RTK query's onQueryStarted(), which allows you to define logic that occurs after the request returns. In effect, whenever we do this refresh mutation, the logic defined below will also set the credentials (i.e. the access token) to the redux store state.
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // wait for request to complete, destructure 'data'
					console.log(data);
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
				} catch (err) {
					console.log(err);
				}
			},
		}),
	}),
});

// RTK Query generates these hooks that can make API requests
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice;
