import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
	useTitle(`Gig-Link | Edit User`);
	const { userId } = useParams();

	const { user, refetch } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	if (!user) {
		return <PulseLoader color="#FFF" />;
	}

	let content = <EditUserForm user={user} refetch={refetch} />;

	return content;
};

export default EditUser;
