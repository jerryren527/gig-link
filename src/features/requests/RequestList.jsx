import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetRequestsQuery, useUpdateRequestStatusMutation } from "./requestsApiSlice";
import { REQUEST_STATUSES, ROLES } from "../../config/constants";
import useTitle from "../../hooks/useTitle";

const RequestList = () => {
	useTitle(`Gig-Link | Requests`);
	const { id, role } = useAuth();

	const { data: users, refetch } = useGetUsersQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const { data: requests, refetch: refetchRequests } = useGetRequestsQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const [updateRequestStatus] = useUpdateRequestStatusMutation();

	let myRequests;
	let header;
	if (role === ROLES.Freelancer) {
		myRequests = users?.entities[id].receivedRequests;
		header = "Your Received Job Requests";
	} else if (role === ROLES.Client) {
		myRequests = users?.entities[id].postedRequests;
		header = "Your Posted Job Requests";
	}

	const handleEditStatus = async (requestId, status) => {
		await updateRequestStatus({ requestId, status });
		refetchRequests();
		refetch();
	};

	return (
		<div className="requests-list-page">
			<h2 className="requests-list-page__header">{header}</h2>
			<div className="requests-list-page__table-container">
				{myRequests?.length > 0 ? (
					<table className="table requests-list-table">
						<thead>
							<tr>
								<th>Client</th>
								<th>Freelancer</th>
								<th>Title</th>
								<th>Description</th>
								<th>Price</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{myRequests &&
								myRequests.map((requestId) => {
									const request = requests?.entities[requestId];
									const clientUsername = users?.entities[request?.client]?.username;
									const freelancerUsername = users?.entities[request?.freelancer]?.username;
									return (
										<tr key={requestId}>
											<td>{clientUsername}</td>
											<td>{freelancerUsername}</td>
											<td>{request?.title}</td>
											<td>{request?.description}</td>
											<td>{request?.price}</td>
											<td>{request?.status}</td>
											<td>
												{request?.status === REQUEST_STATUSES.Pending && role === ROLES.Freelancer && (
													<div className="action-buttons-container">
														<button
															className="btn btn--accept"
															onClick={() => handleEditStatus(requestId, REQUEST_STATUSES.Accepted)}
														>
															Accept Request
														</button>
														<button
															className="btn btn--decline"
															onClick={() => handleEditStatus(requestId, REQUEST_STATUSES.Declined)}
														>
															Decline Request
														</button>
													</div>
												)}
											</td>
										</tr>
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

export default RequestList;
