import React from "react";
import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Wrap Prefetch component around the routes that you want the state to be prefetched for.
const Prefetch = () => {
	useEffect(() => {
		console.log("subscribing");
		// create a manual subscription to users slice using .initiate(). The subscription will remain active indefinitely (until we leave the protected pages).
		const subscription = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		return () => {
			console.log("unsubscribing");
			subscription.unsubscribe();
		};
	}, []);

	return <Outlet />;
};

export default Prefetch;
