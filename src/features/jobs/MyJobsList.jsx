import React from "react";
import useAuth from "../../hooks/useAuth";
import { selectUserById, useGetUsersQuery } from "../users/usersApiSlice";
import { useGetJobsQuery } from "./jobsApiSlice";
import { useSelector } from "react-redux";
import useTitle from "../../hooks/useTitle";

const MyJobsList = () => {
	useTitle(`Gig-Link | My Jobs`);
	const { id: userId, username, role } = useAuth();

	const { data: users } = useGetUsersQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});
	const user = users?.entities[userId];

	const { data: jobs } = useGetJobsQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const myJobIds = jobs?.ids.filter((jobId) => user?.activeJobs.includes(jobId));

	const myJobs = myJobIds?.map((myJobId) => jobs.entities[myJobId]);

	return (
		<div className="my-jobs-list-page">
			<h2 className="my-jobs-list-page--header">My Jobs</h2>
			<div className="my-jobs-list-page__table-container">
				{myJobs?.length > 0 ? (
					<table className="table jobs-table">
						<thead>
							<tr>
								<th>Job ID</th>
								<th>Title</th>
								<th>Description</th>
								<th>Client</th>
								<th>Price (per hour)</th>
								<th>Job Status</th>
							</tr>
						</thead>
						<tbody>
							{myJobs?.length > 0 &&
								myJobs?.map((job, index) => {
									return (
										<tr className="my-job" key={index}>
											<td>{job.id}</td>
											<td>{job.title}</td>
											<td>{job.description}</td>
											<td>{job.clientUsername}</td>
											<td>{job.price}</td>
											<td>{job.status}</td>
											<hr />
										</tr>
									);
								})}
						</tbody>
					</table>
				) : (
					<h3>Nothing to see here...</h3>
				)}
			</div>
		</div>
	);
};

export default MyJobsList;
