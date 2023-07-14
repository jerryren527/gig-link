import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROLES } from "../../config/constants";

const Welcome = () => {
	const { id, username, role } = useAuth();

	let linkText;
	let message;
	let btnMessage;
	let btnLink;
	if (role === ROLES.Client) {
		linkText = "View All Freelancers";
		message = "Find the perfect freelancer for your project";
		btnMessage = "Make a Job Post";
		btnLink = "/dashboard/jobs/new";
	} else if (role === ROLES.Freelancer) {
		linkText = "View All Clients and Freelancers";
		message = "Find the perfect gig for you.";
		btnMessage = "View Open Jobs";
		btnLink = "/dashboard/jobs";
	} else {
		linkText = "View All Users";
		message = "Find the perfect gig for you";
		btnMessage = "View Open Jobs";
		btnLink = "/dashboard/jobs";
	}

	return (
		<div className="welcome-page">
			<div className="welcome-page__message">
				<p>Welcome {username}</p>
				<p>{message}</p>
				<Link className="link-btn" to={btnLink}>
					{btnMessage}
				</Link>
			</div>
			<div className="welcome-page__links">
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
						<Link to="/dashboard/jobs"> View My Open Jobs</Link>
					</p>
				)}
				{role === ROLES.Freelancer && (
					<p>
						<Link to="/dashboard/jobs/my-jobs"> View All My Jobs</Link>
					</p>
				)}
				{role === ROLES.Freelancer && (
					<p>
						<Link to="/dashboard/proposals">View My Proposals</Link>
					</p>
				)}

				<p>
					<Link to={`/dashboard/users/profile/${id}`}>View My Profile</Link>
				</p>

				{(role === ROLES.Freelancer || role === ROLES.Client) && (
					<p>
						<Link to={`/dashboard/requests`}>View My Requests</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default Welcome;
