import React from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetProposalsQuery } from "./proposalsApiSlice";
import { useGetJobsQuery } from "../jobs/jobsApiSlice";
import useTitle from "../../hooks/useTitle";
import { PROPOSAL_STATUSES, JOB_STATUSES } from "../../config/constants";

const ProposalsList = () => {
	useTitle(`Gig-Link | Proposals`);
	const { id, username, role } = useAuth();

	const {
		data: proposals,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	} = useGetProposalsQuery(undefined, {
		pollingInterval: 30000, // 30 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const { data: jobs } = useGetJobsQuery(undefined, {
		pollingInterval: 30000, // 30 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	// if (proposals?.ids.length === 0) {
	// 	return <h2>Nothing to see here...</h2>;
	// }

	const myProposals = [];

	proposals?.ids.map((proposalId) => {
		const proposal = proposals.entities[proposalId];
		if (proposal.freelancerUsername === username) {
			myProposals.push(proposal);
		}
	});

	console.log(proposals);
	console.log("🚀 ~ file: ProposalsList.jsx:29 ~ ProposalsList ~ myProposals:", myProposals);

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
							<tr className="proposal">
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
				<h2>Nothing to see here...</h2>
			)}
		</div>
	);
};

export default ProposalsList;
