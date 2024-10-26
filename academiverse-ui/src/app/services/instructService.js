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

export const fetchStudentCourses = async (userId, year, semester, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`instructs/student/${userId}?year=${year}&semester=${semester}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
}

export const getInstruct = async (instructId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`instructs/${instructId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const saveInstruct = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			'instructs/',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const editInstruct = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.put(
			'instructs/',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};