import { useEffect } from "react";

// Pass in whatever title you want for the page
const useTitle = (title) => {
	useEffect(() => {
		const prevTitle = document.title;
		document.title = title;

		// cleanup function restores the previous title. When component unmounts, document.title reverts to previous title.
		return () => (document.title = prevTitle);
	}, [title]);
};

export default useTitle;
