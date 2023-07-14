import React from "react";
import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { jobsApiSlice } from "../jobs/jobsApiSlice";

// Wrap Prefetch component around the routes that you want the state to be prefetched for.
const Prefetch = () => {
	useEffect(() => {
		console.log("subscribing");
		// create a manual subscription to users slice using .initiate(). The subscription will remain active indefinitely (until we leave the protected pages).
		// const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
		// const jobs = store.dispatch(jobsApiSlice.endpoints.getJobs.initiate());

		// Actually prefetch the RTK Query endpoints (instead of manually creating and destroying subscriptions on every app restart).
		store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }));
		store.dispatch(usersApiSlice.util.prefetch("getJobs", "jobsList", { force: true }));

		// We can remove this return. There is nothing to unsubscrbe from now because we are using prefetch.
		// return () => {
		// 	console.log("unsubscribing");
		// 	users.unsubscribe();
		// 	jobs.unsubscribe();
		// };
	}, []);

	return <Outlet />;
};

export default Prefetch;
