import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetRequestsQuery, useUpdateRequestStatusMutation } from "./requestsApiSlice";
import { REQUEST_STATUSES, ROLES } from "../../config/constants";

const RequestList = () => {
	const { id, username, role } = useAuth(); // logged in user. Must be Freelancer

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	} = useGetUsersQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const { data: requests, refetch: refetchRequests } = useGetRequestsQuery(undefined, {
		pollingInterval: 30000, // 60 seconds requery the data.
		refetchOnFocus: true, // if re-focusing on browser window, refetch data
		refetchOnMountOrArgChange: true, // refetch the data when component is re-mounted
	});

	const [updateRequestStatus, { loading: loadingUpdateRequestStatus }] = useUpdateRequestStatusMutation();

	let myRequests;
	let header;
	if (role === ROLES.Freelancer) {
		myRequests = users?.entities[id].receivedRequests;
		header = "Your Received Job Requests";
	} else if (role === ROLES.Client) {
		myRequests = users?.entities[id].postedRequests;
		header = "Your Posted Job Requests";
	}

	console.log("🚀 ~ file: RequestList.jsx:19 ~ RequestList ~ myRequests:", myRequests);

	const handleEditStatus = async (requestId, status) => {
		console.log("edit clicked!");
		console.log("🚀 ~ file: RequestList.jsx:36 ~ handleEditStatus ~ status:", status);
		console.log("🚀 ~ file: RequestList.jsx:36 ~ handleEditStatus ~ requestId:", requestId);
		await updateRequestStatus({ requestId, status });
		refetch();
	};

	return (
		<>
			<h2>{header}</h2>
			<div className="received-requests">
				{myRequests &&
					myRequests.map((requestId) => {
						const request = requests?.entities[requestId];
						return (
							<>
								<div className="received-request" key={requestId}>
									<p>{request?.client}</p>
									<p>{request?.freelancer}</p>
									<p>{request?.title}</p>
									<p>{request?.description}</p>
									<p>{request?.price}</p>
									<p>{request?.status}</p>
									{request?.status === REQUEST_STATUSES.Pending && (
										<div>
											<button
												className="btn--accept"
												onClick={() => handleEditStatus(requestId, REQUEST_STATUSES.Accepted)}
											>
												Accept Request
											</button>
											<button
												className="btn--decline"
												onClick={() => handleEditStatus(requestId, REQUEST_STATUSES.Declined)}
											>
												Decline Request
											</button>
										</div>
									)}
								</div>
								<hr />
							</>
						);
					})}
			</div>
		</>
	);
};

export default RequestList;
