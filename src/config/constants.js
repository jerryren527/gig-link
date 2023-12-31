export const JOB_STATUSES = {
	Pending: "Pending",
	Accepted: "Accepted",
	Cancelled: "Cancelled",
	Completed: "Completed",
};

export const REQUEST_STATUSES = {
	Pending: "Pending",
	Accepted: "Accepted",
	Declined: "Declined",
};

export const PROPOSAL_STATUSES = {
	Pending: "Pending",
	Accepted: "Accepted",
	Declined: "Declined",
};

export const ROLES = {
	Client: "Client",
	Freelancer: "Freelancer",
	Admin: "Admin",
};

export const timezoneOffset = new Date().getTimezoneOffset() * 60000; // Timezone offset in milliseconds
