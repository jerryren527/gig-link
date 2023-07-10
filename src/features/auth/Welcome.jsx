import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROLES } from "../../config/constants";

const Welcome = () => {
	const { username, role } = useAuth();
	return (
		<>
			<div>
				Welcome {username} ({role})
			</div>
			<p>
				<Link to="/dashboard/users">View Users</Link>
			</p>
			{role === ROLES.Admin && (
				<p>
					<Link to="/dashboard/jobs">View All Jobs</Link>
				</p>
			)}
			{role === ROLES.Freelancer && (
				<p>
					<Link to="/dashboard/jobs">View Open Jobs</Link>
				</p>
			)}
			{role === ROLES.Client && (
				<p>
					<Link to="/dashboard/jobs">View My Open Jobs</Link>
				</p>
			)}
			{role === ROLES.Freelancer && (
				<p>
					<Link to="/dashboard/jobs/active">View My Active Jobs</Link>
				</p>
			)}
			{role === ROLES.Freelancer && (
				<p>
					<Link to="/dashboard/proposals">View My Proposals</Link>
				</p>
			)}
		</>
	);
};

export default Welcome;
