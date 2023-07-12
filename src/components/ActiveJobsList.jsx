import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../features/users/usersApiSlice";
import useAuth from "../hooks/useAuth";
import { selectJobById, useGetJobsQuery } from "../features/jobs/jobsApiSlice";

const ActiveJobsList = () => {
	const { id: userId, username, role } = useAuth();

	const user = useSelector((state) => selectUserById(state, userId));
	// const activeJobs = user?.activeJobs || [];
	// const jobs = activeJobs.map((activeJob) => useSelector((state) => selectJobById(state, activeJob)));
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
	// console.log(user?.activeJobs);

	const myActiveJobIds = jobs?.ids.filter((jobId) => user?.activeJobs.includes(jobId));

	// console.log("myActiveJobIds", myActiveJobIds);

	const myActiveJobs = myActiveJobIds?.map((activeJobid) => jobs.entities[activeJobid]);

	return (
		<>
			{myActiveJobs?.length > 0 ? (
				myActiveJobs?.map((job, index) => {
					return (
						<div className="active-jobs" key={index}>
							<div className="active-job">
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

export default ActiveJobsList;
