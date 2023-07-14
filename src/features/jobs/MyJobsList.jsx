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
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});
	const user = users?.entities[userId];
	console.log("🚀 ~ file: MyJobsList.jsx:11 ~ MyJobsList ~ user:", user);

	const {
		data: jobs,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	} = useGetJobsQuery(undefined, {
		pollingInterval: 15000, // 30 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const myJobIds = jobs?.ids.filter((jobId) => user?.activeJobs.includes(jobId));
	console.log("🚀 ~ file: MyJobsList.jsx:27 ~ MyJobsList ~ myJobIds:", myJobIds);

	const myJobs = myJobIds?.map((myJobId) => jobs.entities[myJobId]);
	console.log("🚀 ~ file: MyJobsList.jsx:30 ~ MyJobsList ~ myJobs:", myJobs);

	return (
		<>
			<h2>My Jobs</h2>
			{myJobs?.length > 0 ? (
				myJobs?.map((job, index) => {
					return (
						<div className="my-jobs" key={index}>
							<div className="my-job">
								<p>Job Id: {job.id}</p>
								<p>{job.title}</p>
								<p>{job.description}</p>
								<p>Client Username: {job.clientUsername}</p>
								<p>{job.status}</p>
								<hr />
							</div>
						</div>
					);
				})
			) : (
				<h3>Nothing to see here...</h3>
			)}
		</>
	);
};

export default MyJobsList;
