// this component will help us remain logged after refreshing the app
import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

import React from "react";

const PersistLogin = () => {
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false); // handling strict mode in React 18.

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [
		refresh,
		{
			isUninitialized, // this state reveals if the refresh state has not been initialized
			isLoading,
			isSuccess,
			isError,
			error,
		},
	] = useRefreshMutation();

	useEffect(() => {
		// Strict mode runs this component twice. On the first mount, this useEffect runs one and sets effectRan.current to true. On the second mount, this useEffect runs again, but this time verifyRefreshToken() gets executed because effectRan.current is true. In effect, we can effectively execute our logic once despite being in Strict Mode.
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			// React 18 Strict Mode

			const verifyRefreshToken = async () => {
				console.log("verifying refresh token");
				try {
					//const response =
					await refresh(); // When PersistLogin component mounts, the refresh() function is run, which runs the RTK query endpoint that hits the /auth/refresh route. The backend api logic returns a new access token

					//const { accessToken } = response.data

					setTrueSuccess(true); // set TrueSuccess  to true. This is our personal boolean flag that we use instead of the 'isSuccess' value given to us from useRefreshMutation() hook. It is possible for 'isSuccess' to be true before refresh() if fully complete -- before the credentials in the redux store are set. This workaround allows RTK to completely set the credentials before moving on.
				} catch (err) {
					console.error(err);
				}
			};

			// When there is no token (when you refresh the page, you lose your access token in memory), then run verifyRefreshToken().
			if (!token) verifyRefreshToken();
		}

		return () => (effectRan.current = true);

		// The comment below will disable any warning about missing dependencies in dependency array.

		// eslint-disable-next-line
	}, []);

	let content;
	if (isLoading) {
		// token: no
		console.log("loading");
		content = <p>Loading...</p>;
	} else if (isError) {
		// when refresh token expires
		console.log("error");
		content = (
			<p className="errmsg">
				{error.data?.message}. <Link to="/login">Please login again</Link>.
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		// token: yes
		console.log("success");
		content = <Outlet />;
	} else if (token && isUninitialized) {
		// token: yes; and useRefreshMutation() has not initialized yet. You may see this from time to time, typically when this component is first mounted? This also returns <Outlet />
		console.log("token and uninit");
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
};

export default PersistLogin;
