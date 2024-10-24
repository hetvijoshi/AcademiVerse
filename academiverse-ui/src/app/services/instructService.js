import { Nextclient } from "../lib/client/http";

export const fetchInstructCourses = async (userId, year, semester, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`instructs/professor/${userId}?year=${year}&semester=${semester}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};
