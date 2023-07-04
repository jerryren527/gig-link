import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

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
		}),
	}),
});

// RTK Query generates these hooks that can make API requests
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice;
