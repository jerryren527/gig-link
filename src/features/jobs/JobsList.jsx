import React from "react";
import { selectAllJobs, useDeleteJobMutation, useGetJobsQuery, useUpdateJobStatusMutation } from "./jobsApiSlice";
import { useSelector } from "react-redux";
import NewJobForm from "./NewJobForm";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { JOB_STATUSES, ROLES } from "../../config/constants";
import {
	useAddProposalMutation,
	useDeleteProposalMutation,
	useGetProposalsQuery,
} from "../proposals/proposalsApiSlice";
import useTitle from "../../hooks/useTitle";

const JobsList = () => {
	useTitle(`Gig-Link | Jobs`);
	// const jobs = useSelector(selectAllJobs)
	const { id: userId, username, role } = useAuth();

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

	const {
		data: proposals,
		isLoading: isProposalLoading,
		isSuccess: isProposalSuccess,
		isError: isProposalError,
		error: proposalError,
	} = useGetProposalsQuery(undefined, {
		pollingInterval: 15000, // 30 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const [addProposal, { isLoading: isAddLoading }] = useAddProposalMutation();
	const [deleteProposal, { isLoading: isDeleteLoading }] = useDeleteProposalMutation();
	const [updateJobStatus, { isLoading: isJobStatusLoading }] = useUpdateJobStatusMutation();

	if (!jobs) {
		return <h2>Loading...</h2>;
	}

	if (jobs?.ids.length === 0) {
		return <h2>Nothing to see here...</h2>;
	}

	let myJobs;
	if (role === ROLES.Admin) {
		myJobs = jobs?.ids;
	} else if (role === ROLES.Client) {
		myJobs = jobs?.ids.filter((id) => jobs.entities[id].clientUsername === username);
	} else if (role === ROLES.Freelancer) {
		myJobs = jobs?.ids.filter((id) => jobs.entities[id].status === JOB_STATUSES.Pending);
	}

	let header;
	if (role === ROLES.Admin) {
		header = "All Jobs";
	} else if (role === ROLES.Client) {
		header = "My Open Jobs";
	} else if (role === ROLES.Freelancer) {
		header = "All Open Jobs";
		myJobs = jobs?.ids.filter((id) => jobs.entities[id].status === JOB_STATUSES.Pending);
	}

	console.log("myJobs", myJobs);

	const handleAddProposal = async (jobId, freelancerUsername) => {
		console.log("🚀 ~ file: JobsList.jsx:75 ~ handleAddProposal ~ freelancerUsername:", freelancerUsername);
		console.log("🚀 ~ file: JobsList.jsx:75 ~ handleAddProposal ~ jobId:", jobId);
		console.log("handleAddProposal clicked!");
		await addProposal({ jobId, freelancerUsername: freelancerUsername });
		refetch();
	};

	const handleDeleteProposal = async (jobId, freelancerUsername) => {
		console.log("🚀 ~ file: JobsList.jsx:82 ~ handleDeleteProposal ~ freelancerUsername:", freelancerUsername);
		console.log("🚀 ~ file: JobsList.jsx:82 ~ handleDeleteProposal ~ jobId:", jobId);
		console.log("handleDeleteProposal clicked!");
		await deleteProposal({ jobId, freelancerUsername: freelancerUsername });
		refetch();
	};

	const handleUpdateStatus = async (jobId, status) => {
		console.log("marking as", status);
		await updateJobStatus({ jobId, status });
		refetch();
	};

	return (
		<>
			<h2>{header}</h2>
			{role === ROLES.Client && <Link to="/dashboard/jobs/new">Make Job Posting</Link>}
			<br />
			<div>
				{myJobs &&
					myJobs.map((id) => {
						const job = jobs.entities[id];
						return (
							job && (
								<div key={job.id}>
									<p>{job.id}</p>
									<p>{job.title}</p>
									<p>{job.description}</p>
									<p>{job.client}</p>
									<p>{job.clientUsername}</p>
									<p>
										{job.skills.map((skill, index) => {
											if (index == job.skills.length - 1) {
												return <span key={`${job.id}-${index}`}>{skill}</span>;
											}
											return <span key={`${job.id}-${index}`}>{skill}, </span>;
										})}
									</p>
									<p>{job.price}</p>
									<p>{job.startDate}</p>
									<p>{job.dueDate}</p>
									<p>Assigned to: {job.freelancerUsername ? job.freelancerUsername : "N/A"}</p>
									<p>{job.status}</p>

									<p>{JSON.stringify(job.proposals)}</p>

									{role !== ROLES.Freelancer && <Link to={`/dashboard/jobs/edit/${job.id}`}>Edit Job</Link>}
									{role === ROLES.Freelancer && job?.proposals?.includes(username) && (
										<button onClick={() => handleDeleteProposal(job.id, username)}>Delete Proposal</button>
									)}
									{role === ROLES.Freelancer && !job?.proposals?.includes(username) && (
										<button onClick={() => handleAddProposal(job.id, username)}>Add Proposal</button>
									)}

									{role === ROLES.Client && job.status === JOB_STATUSES.Accepted && (
										<div className="action-buttons">
											<button onClick={() => handleUpdateStatus(job.id, JOB_STATUSES.Completed)}>
												Mark as Completed
											</button>
											<br />
											<button onClick={() => handleUpdateStatus(job.id, JOB_STATUSES.Cancelled)}>
												Mark as Cancelled
											</button>
										</div>
									)}

									<hr />
								</div>
							)
						);
					})}
			</div>
		</>
	);
};

export default JobsList;
