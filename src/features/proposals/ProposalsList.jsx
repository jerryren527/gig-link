import React from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetProposalsQuery } from "./proposalsApiSlice";
import { useGetJobsQuery } from "../jobs/jobsApiSlice";
import useTitle from "../../hooks/useTitle";
import { PROPOSAL_STATUSES, JOB_STATUSES } from "../../config/constants";

const ProposalsList = () => {
	useTitle(`Gig-Link | Proposals`);
	const { username } = useAuth();

	const { data: proposals } = useGetProposalsQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { data: jobs } = useGetJobsQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const myProposals = [];

	proposals?.ids.map((proposalId) => {
		const proposal = proposals.entities[proposalId];
		if (proposal.freelancerUsername === username) {
			myProposals.push(proposal);
		}
	});

	return (
		<div className="proposals-page">
			<h2>My Proposals</h2>
			{myProposals?.length > 0 ? (
				<table className="table proposals-table">
					<thead>
						<tr>
							<th>Job ID</th>
							<th>Title</th>
							<th>Description</th>
							<th>Client</th>
							<th>Proposal Status</th>
						</tr>
					</thead>
					<tbody>
						{myProposals.map((item, index) => (
							<tr className="proposal" key={index}>
								<td>{item.jobId}</td>
								<td>{jobs?.entities[item?.jobId].title}</td>
								<td>{jobs?.entities[item?.jobId].description}</td>
								<td>{jobs?.entities[item?.jobId].clientUsername}</td>
								<td>
									{item.status === PROPOSAL_STATUSES.Pending &&
									jobs?.entities[item?.jobId].status !== JOB_STATUSES.Pending
										? PROPOSAL_STATUSES.Declined
										: item.status}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>Nothing to see here...</p>
			)}
		</div>
	);
};

export default ProposalsList;
