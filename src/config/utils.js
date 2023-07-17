export function formatDateForInput(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatDateTime(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	return `${hour}:${minute} on ${year}-${month}-${day}`;
}

export function formatDecimal(number) {
	// Convert the input to a number and round to 2 decimal places
	const roundedNumber = Number(number.toFixed(2));

	// Convert the rounded number to a string with comma as a thousand separator
	const formattedNumber = roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return formattedNumber;
}
