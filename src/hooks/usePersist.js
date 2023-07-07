import { useState, useEffect } from "react";

// use usePersist very much like a useState hook.
const usePersist = () => {
	// Look at our localstorage and look for persist.
	const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

	// set localStorage.persist whenever persist changes
	useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(persist));
	}, [persist]);

	return [persist, setPersist];
};
export default usePersist;
