import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROLES } from "../../config/constants";

const Welcome = () => {
	const { id, username, role } = useAuth();

	let linkText;
	if (role === ROLES.Client) {
		linkText = "View All Freelancers";
	} else if (role === ROLES.Freelancer) {
		linkText = "View All Clients and Freelancers";
	} else {
		linkText = "View All Users";
	}

	return (
		<>
			<div>
				Welcome {username} ({role})
			</div>
			<p>
				<Link to="/dashboard/users">{linkText}</Link>
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
			{role === ROLES.Client && (
				<p>
					<Link to="/dashboard/reviews">View My Posted Reviews</Link>
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
			{role === ROLES.Freelancer && (
				<p>
					<Link to={`/dashboard/users/profile/${id}`}>View My Profile</Link>
				</p>
			)}
		</>
	);
};

export default Welcome;
