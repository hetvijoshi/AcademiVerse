import { Nextclient } from "../lib/client/http";

export const fetchInstructAnnouncements = async (instructId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`announcement/?instructId=${instructId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const saveAnnouncement = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			'announcement/',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};