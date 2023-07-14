import React from "react";
import { Outlet } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const Dashboard = () => {
	useTitle("Gig-Link | Dashboard");
	return (
		<>
			<Outlet />
		</>
	);
};

export default Dashboard;
