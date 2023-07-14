import React from "react";
import { Outlet } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const Dashboard = () => {
	useTitle("Gig-Link | Dashboard");
	return (
		<>
			<h1>Dashboard</h1>
			<Outlet />
		</>
	);
};

export default Dashboard;
