import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectJobById, useUpdateJobMutation } from "./jobsApiSlice";
import { formatDateForInput } from "../../config/utils";
import { JOB_STATUSES } from "../../config/constants";

const EditJobForm = () => {
	const { jobId } = useParams();

	// const message = useSelector(state => selectMessageById(state, id))
	const job = useSelector((state) => selectJobById(state, jobId));

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

	const [updateJob, { isLoading, isSuccess, isError, error }] = useUpdateJobMutation();

	// This way will avoid the "more hooks during previous render" error message
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
	}, [isSuccess, isError, error]);

	if (!job) {
		return <h2>Loading...</h2>;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted");
		console.log("🚀 ~ file: EditJobForm.jsx:70 ~ handleSubmit ~ proposals:", proposals);
		console.log("🚀 ~ file: EditJobForm.jsx:73 ~ handleSubmit ~ freelancerUsername:", freelancerUsername);

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
			status,
		});
	};

	const handleChange = (e) => {
		console.log(e.target.value);
		setFreelancerUsername(e.target.value);
	};

	return (
		<>
			<h2>Edit Job Form</h2>
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
					<input id="price-input" value={price} type="text" onChange={(e) => setPrice(e.target.value)} />
				</div>

				<div className="edit-job-form__input">
					<h3>Proposals: </h3>
					<div>
						{proposals?.length === 0 ? (
							<h4>No proposals yet!</h4>
						) : (
							proposals?.map((proposal, index) => (
								<>
									<Link key={index} to={`dashboard/users/${proposal}`}>
										{proposal}
									</Link>
									<br />
								</>
							))
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
					<select id="status-input-input" onChange={(e) => setStatus(e.target.value)} value={status}>
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
						onChange={(e) => setStartDate(e.target.value)}
					/>
				</div>

				<div className="edit-job-form__input">
					<label htmlFor="dueDate-input">DueDate: </label>
					<input
						id="dueDate-input"
						value={formatDateForInput(dueDate)}
						type="date"
						onChange={(e) => setDueDate(e.target.value)}
					/>
				</div>

				<div className="btn">
					<button type="submit">Save</button>
				</div>
			</form>
		</>
	);
};

export default EditJobForm;
