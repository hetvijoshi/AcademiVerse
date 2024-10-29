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
			`/assignments/instruct/${instructId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}
	return response.data;
};

export const getActiveAssignmentsByInstructId = async (instructId, token) => {
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

export const getAssignmentById = async (assignmentId, token) => {
	let response;
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`/assignments/${assignmentId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}
	return response.data;
};

export const updateAssignment = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.put(
			'/assignments',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const deleteAssignment = async (assignmentId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.delete(
			`/assignments/${assignmentId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const activeAssignment = async (assignmentId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			`/assignments/active/${assignmentId}`,
			null,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
}
