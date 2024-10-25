import { Nextclient } from "../lib/client/http";

export const postAssignmentsByInstructId = async (data, token) => {
	let response;
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post("/assignments", data, config);
	} catch (err) {
		console.log("Error", err);
	}
	return response.data;
};

export const getAssignmentsByInstructId = async (instructId, token) => {
	let response;
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`/assignments/instruct/${instructId}/active`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}
	return response.data;
};
