import React from "react";
import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }));
		store.dispatch(usersApiSlice.util.prefetch("getJobs", "jobsList", { force: true }));
	}, []);

	return <Outlet />;
};

export default Prefetch;
