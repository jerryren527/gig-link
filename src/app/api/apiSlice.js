import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "https://gig-link-api.onrender.com",
	// baseUrl: "http://localhost:3500",
	credentials: "include",

	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	console.log("🚀 ~ file: apiSlice.js:21 ~ baseQueryWithReauth ~ result:", result);

	// Handle 404
	if (result?.error?.status === 404) {
		// send refresh token to get new access token.
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			api.dispatch(setCredentials({ ...refreshResult.data }));

			// retry original query with new access token stored in authorization header now.
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired. ";
			}
			return refreshResult;
		}
	}

	// Handle 403 forbidden (acceess token expired)
	if (result?.error?.status === 403) {
		// send refresh token to get new access token.
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			api.dispatch(setCredentials({ ...refreshResult.data }));

			// retry original query with new access token stored in authorization header now.
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired. ";
			}
			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["User", "Job", "Message", "Proposal", "Request", "Review"],
	endpoints: (builder) => ({}),
});
