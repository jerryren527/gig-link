import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

// Each api request will include cookies and authorization header that includes
const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3500",
	credentials: "include",
	// prepareHeaders is specific to fetchBaseQuery(). 1st arg is headers, representing the headers. 2nd arg is an api object specific to prepareHeaders. We destructure 'getState' from it. The logic in prepareHeaders is applied to every request that is sent.
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token; // get the state, look at auth state, and get the token from it.

		if (token) {
			headers.set("authorization", `Bearer ${token}`); // if there is a token, set the authorization header.
		}
		return headers;
	},
});

// wrapper function. 1st param is 'args', which is essentially the args that get passed into fetchBaseQuery() defined above. 2nd param is 'api', which is baseQuery's own api object. 3rd param is an 'extraOptions' object. Pass them all in even if you are not using them.
const baseQueryWithReauth = async (args, api, extraOptions) => {
	// console.log(args) // request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraOptions) //custom like {shout: true}

	let result = await baseQuery(args, api, extraOptions); // get the result from the first baseQuery() request (this request contains the access token)

	// Handle 403 forbidden (acceess token expired)
	// If you want, handle other status codes, too
	if (result?.error?.status === 403) {
		console.log("sending refresh token");

		// send refresh token to get new access token.
		// Here we call baseQuery() again with a the refresh route. We pass api and extraOptins again. We expect to get data, which contains the access token.
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		// We expect to get back data from baseQuery(), and 'data' should hold our access token
		if (refreshResult?.data) {
			// store the new token
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
	tagTypes: ["User", "Job"],
	endpoints: (builder) => ({}),
});
