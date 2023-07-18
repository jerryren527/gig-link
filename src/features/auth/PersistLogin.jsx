import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

import React from "react";

const PersistLogin = () => {
	const token = useSelector(selectCurrentToken);
	console.log("🚀 ~ file: PersistLogin.jsx:11 ~ PersistLogin ~ token:", token);
	const effectRan = useRef(false);

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();

	useEffect(() => {
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			const verifyRefreshToken = async () => {
				console.log("verifying refresh token");
				try {
					await refresh();

					setTrueSuccess(true);
					console.log("success");
				} catch (err) {
					console.error(err);
				}
			};

			if (!token) verifyRefreshToken();
		}

		return () => (effectRan.current = true);

		// eslint-disable-next-line
	}, []);

	let content;
	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isError) {
		content = (
			<p className="errmsg">
				{error.data?.message}. <Link to="/login">Please login again</Link>.
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		content = <Outlet />;
	} else if (token && isUninitialized) {
		content = <Outlet />;
	}

	return content;
};

export default PersistLogin;
