import React from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetProposalsQuery } from "./proposalsApiSlice";
import { useGetJobsQuery } from "../jobs/jobsApiSlice";
import useTitle from "../../hooks/useTitle";

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
		<>
			<div className="proposals">
				{myProposals?.length > 0 ? (
					myProposals.map((item, index) => (
						<div className="proposal">
							<p>{item.freelancerUsername}</p>
							<p>{item.status}</p>
							<p>JobId:{item.jobId}</p>
							{jobs?.entities[item?.jobId] && (
								<>
									<p>Job Title: {jobs?.entities[item?.jobId].title}</p>
									<p>Job Description: {jobs?.entities[item?.jobId].description}</p>
									<p>Client Username: {jobs?.entities[item?.jobId].clientUsername}</p>
								</>
							)}
							<hr />
						</div>
					))
				) : (
					<h2>Nothing to see here...</h2>
				)}
			</div>
		</>
	);
};

export default ProposalsList;
