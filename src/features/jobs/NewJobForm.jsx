import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAddJobMutation } from "./jobsApiSlice";
import useTitle from "../../hooks/useTitle";
import { formatDateForInput } from "../../config/utils";

const NewJobForm = () => {
	useTitle(`Gig-Link | New Job`);
	const { id, username } = useAuth();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [client, setClient] = useState("");
	const [clientUsername, setClientUsername] = useState(username);
	const [skills, setSkills] = useState("");
	const [price, setPrice] = useState("");
	const [startDate, setStartDate] = useState("");
	const [dueDate, setDueDate] = useState("");

	const navigate = useNavigate();

	const [addNewJob, { isLoading, isSuccess, isError, error }] = useAddJobMutation();

	useEffect(() => {
		if (isSuccess) {
			alert("Job added successfully.");
			setTitle("");
			setDescription("");
			setClient("");
			setClientUsername("");
			setSkills("");
			setPrice("");
			setStartDate("");
			setDueDate("");
			navigate("/dashboard/jobs");
		}
		if (isError) {
			alert(`Error: ${error?.data.message}`);
		}
	}, [isSuccess, isError, error]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("submitted");
		await addNewJob({ title, description, clientUsername, skills, price, startDate, dueDate });
	};

	return (
		<div className="new-job-page">
			<h2 className="new-job-page--header">New Job Form</h2>
			<form className="new-job-form" onSubmit={handleSubmit}>
				<div className="new-job-form__input">
					<label htmlFor="title-input">Title: </label>
					<input id="title-input" value={title} type="text" onChange={(e) => setTitle(e.target.value)} required />
				</div>

				<div className="new-job-form__input">
					<label htmlFor="description-input">Description: </label>
					<input
						id="description-input"
						value={description}
						type="text"
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				<div className="new-job-form__input">
					<label htmlFor="clientUsername-input">Client Username: </label>
					<input
						id="clientUsername-input"
						value={clientUsername}
						type="text"
						onChange={(e) => setClient(e.target.value)}
						required
						disabled
					/>
				</div>

				<div className="new-job-form__input">
					<label htmlFor="skills-input">Skills (comma-separated. E.g., C, Python): </label>
					<input id="skills-input" value={skills} type="text" onChange={(e) => setSkills(e.target.value)} required />
				</div>

				<div className="new-job-form__input">
					<label htmlFor="price-input">Price: </label>
					<input
						id="price-input"
						value={price}
						type="number"
						onChange={(e) => setPrice(e.target.value)}
						required
						min={0}
					/>
				</div>

				<div className="new-job-form__input">
					<label htmlFor="startDate-input">StartDate: </label>
					<input
						id="startDate-input"
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						min={formatDateForInput(new Date(Date.now()))}
						// min={new Date().toISOString().split("T"[0])}
						required
					/>
				</div>

				<div className="new-job-form__input">
					<label htmlFor="dueDate-input">DueDate: </label>
					<input
						id="dueDate-input"
						value={dueDate}
						type="date"
						onChange={(e) => setDueDate(e.target.value)}
						min={startDate}
						required
					/>
				</div>

				<div>
					<button type="submit" className="btn">
						Post Job
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewJobForm;
