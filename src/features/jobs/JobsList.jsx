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
		<div className="jobs-list-page">
			<h2 className="jobs-list-page__header">{header}</h2>
			{role === ROLES.Client && (
				<Link to="/dashboard/jobs/new" className="link">
					Make Job Posting &gt;
				</Link>
			)}
			<div className="jobs-list-page__table-container">
				{myJobs?.length > 0 ? (
					<table className="table jobs-table">
						<thead>
							<tr>
								<th>Job ID</th>
								<th>Title</th>
								<th>Description</th>
								<th>Client</th>
								<th>Skills</th>
								<th>Price (per hour)</th>
								<th>Assigned to</th>
								<th>Job Status</th>
								<th>Proposals</th>
							</tr>
						</thead>
						<tbody>
							{myJobs &&
								myJobs.map((id) => {
									const job = jobs.entities[id];
									return (
										job && (
											<tr key={job.id}>
												<td>{job.id}</td>
												<td>{job.title}</td>
												<td>{job.description}</td>
												<td>{job.clientUsername}</td>
												<td>
													{job.skills.map((skill, index) => {
														if (index == job.skills.length - 1) {
															return <span key={`${job.id}-${index}`}>{skill}</span>;
														}
														return <span key={`${job.id}-${index}`}>{skill}, </span>;
													})}
												</td>
												<td>{job.price}</td>
												<td>{job.freelancerUsername ? job.freelancerUsername : "N/A"}</td>
												<td>{job.status}</td>

												<td>{job?.proposals.join(", ")}</td>

												{role !== ROLES.Freelancer ? (
													<td>
														<Link to={`/dashboard/jobs/edit/${job?.id}`} className="link">
															Edit Job
														</Link>
													</td>
												) : role === ROLES.Freelancer && job?.proposals?.includes(username) ? (
													<td>
														<button className="btn btn--decline" onClick={() => handleDeleteProposal(job.id, username)}>
															Delete Proposal
														</button>
													</td>
												) : (
													<td>
														<button className="btn" onClick={() => handleAddProposal(job.id, username)}>
															Add Proposal
														</button>
													</td>
												)}

												{role === ROLES.Client && job.status === JOB_STATUSES.Accepted && (
													<td className="action-buttons">
														<button className="btn" onClick={() => handleUpdateStatus(job.id, JOB_STATUSES.Completed)}>
															Mark as Completed
														</button>
														<br />
														<button
															className="btn btn--decline"
															onClick={() => handleUpdateStatus(job.id, JOB_STATUSES.Cancelled)}
														>
															Mark as Cancelled
														</button>
													</td>
												)}
											</tr>
										)
									);
								})}
						</tbody>
					</table>
				) : (
					<p>Nothing to see here...</p>
				)}
			</div>
		</div>
	);
};

export default JobsList;
