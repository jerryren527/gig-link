import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectJobById, useGetJobsQuery, useUpdateJobMutation } from "./jobsApiSlice";
import { formatDateForInput } from "../../config/utils";
import { timezoneOffset } from "../../config/constants";
import { JOB_STATUSES } from "../../config/constants";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";

const EditJobForm = () => {
	useTitle(`Gig-Link | Edit Job`);
	const { jobId } = useParams();

	const {
		data: jobs,
		isLoading: isGetJobsLoading,
		isSuccess: isGetJobsSuccess,
		isError: isGetJobsError,
		error: getJobsError,
		refetch,
	} = useGetJobsQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	const job = jobs?.entities[jobId];

	const [title, setTitle] = useState(job?.title);
	const [description, setDescription] = useState(job?.description);
	const [clientUsername, setClientUsername] = useState(job?.clientUsername);
	const [skills, setSkills] = useState(job?.skills);
	const [price, setPrice] = useState(job?.price);
	const [proposals, setProposals] = useState(job?.proposals);
	const [freelancerUsername, setFreelancerUsername] = useState(job?.freelancerUsername);
	const [startDate, setStartDate] = useState(job?.startDate);
	const [dueDate, setDueDate] = useState(job?.dueDate);
	const [status, setStatus] = useState(job?.status);

	const navigate = useNavigate();

	const [updateJob, { isSuccess, isError, error }] = useUpdateJobMutation();

	const { data: users, refetch: refetchUsers } = useGetUsersQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	useEffect(() => {
		setTitle(job?.title);
		setDescription(job?.description);
		setClientUsername(job?.clientUsername);
		setSkills(job?.skills);
		setPrice(job?.price);
		setProposals(job?.proposals);
		setFreelancerUsername(job?.freelancerUsername);
		setStartDate(job?.startDate);
		setDueDate(job?.dueDate);
		setStatus(job?.status);
	}, [job]);

	useEffect(() => {
		if (isSuccess) {
			setTitle("");
			setDescription("");
			setClientUsername("");
			setSkills("");
			setPrice("");
			setStartDate("");
			setDueDate("");
			setStatus("");
			navigate("/dashboard/jobs");
		}
		if (isError) {
			alert(error?.data?.message);
		}
	}, [isSuccess, isError, error]);

	if (!job) {
		return <h2>Loading...</h2>;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newStatus = freelancerUsername ? JOB_STATUSES.Accepted : status;

		await updateJob({
			jobId,
			title,
			description,
			skills,
			price,
			proposals,
			freelancerUsername,
			startDate,
			dueDate,
			status: newStatus,
		});
		refetch();
		refetchUsers();
	};

	const handleChange = (e) => {
		setFreelancerUsername(e.target.value);
	};

	const handleDateChange = (e, dateType) => {
		const selectedDate = new Date(e.target.value);
		const adjustedDate = new Date(selectedDate.getTime() + timezoneOffset);
		if (dateType === "start") {
			setStartDate(adjustedDate);
		} else {
			setDueDate(adjustedDate);
		}
	};

	return (
		<div className="edit-job-form-page">
			<h2 className="edit-job-form-page--header">Edit Job Form</h2>
			<form className="edit-job-form" onSubmit={handleSubmit}>
				<div className="edit-job-form__input">
					<label htmlFor="title-input">Title: </label>
					<input id="title-input" value={title} type="text" onChange={(e) => setTitle(e.target.value)} />
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="description-input">Description: </label>
					<input
						id="description-input"
						value={description}
						type="text"
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="clientUsername-input">ClientUsername: </label>
					<input
						id="clientUsername-input"
						value={clientUsername}
						type="text"
						onChange={(e) => setClientUsername(e.target.value)}
						disabled
					/>
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="skills-input">Skills: </label>
					<input id="skills-input" value={skills} type="text" onChange={(e) => setSkills(e.target.value)} />
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="price-input">Price: </label>
					<input id="price-input" value={price} type="number" onChange={(e) => setPrice(e.target.value)} min={0} />
				</div>

				<div className="edit-job-form__input">
					<h3>Proposals: </h3>
					<div>
						{proposals?.length === 0 ? (
							<h4>No proposals yet!</h4>
						) : (
							proposals?.map((proposal, index) => {
								// 'proposal' is username. Find userId from username.
								const freelancerId = users?.ids.find((userId) => users?.entities[userId].username === proposal);

								return (
									<>
										<Link key={index} to={`../../users/profile/${freelancerId}`}>
											{proposal}
										</Link>
										<br />
									</>
								);
							})
						)}
					</div>
				</div>

				{proposals?.length > 0 && (
					<div className="edit-job-form__input">
						<label htmlFor="freelancerUsername-input">Freelancer: </label>
						<select id="freelancerUsername-input" onChange={handleChange} value={freelancerUsername}>
							<option value="">-- Select --</option>
							{proposals.map((option, index) => (
								<option key={index} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>
				)}

				<div className="edit-job-form__input">
					<label htmlFor="status-input">Status: </label>
					<select id="status-input-input" onChange={(e) => setStatus(e.target.value)} value={status} disabled>
						<option value="">-- Select --</option>
						{Object.entries(JOB_STATUSES).map(([key, value]) => (
							<option key={key} value={value}>
								{value}
							</option>
						))}
					</select>
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="startDate-input">StartDate: </label>
					<input
						id="startDate-input"
						value={formatDateForInput(startDate)}
						type="date"
						onChange={(e) => handleDateChange(e, "start")}
						min={formatDateForInput(new Date(Date.now()))}
					/>
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="dueDate-input">DueDate: </label>
					<input
						id="dueDate-input"
						value={formatDateForInput(dueDate)}
						type="date"
						onChange={(e) => handleDateChange(e, "due")}
						min={formatDateForInput(startDate)}
					/>
				</div>

				<div>
					<button type="submit" className="btn">
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditJobForm;
