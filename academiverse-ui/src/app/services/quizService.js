import { Nextclient } from "../lib/client/http";

export const fetchInstructQuizzes = async (instructId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`quiz/${instructId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const fetchQuizByInstructId = async (instructId, userId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`quiz/${instructId}?userId=${userId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const fetchQuizQuestions = async (quizId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`quiz/questions/${quizId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const fetchStudentQuizQuestions = async (quizId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(
			`quiz/stuquestions/${quizId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const saveQuiz = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			'quiz/',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const editQuiz = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.put(
			'quiz/',
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const deleteQuiz = async (quizId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.delete(
			`quiz/${quizId}`,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
};

export const activeQuiz = async (quizId, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			`quiz/active/${quizId}`,
			null,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
}

export const submitQuiz = async (data, token) => {
	let response;

	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.post(
			`quiz/submit`,
			data,
			config,
		);
	} catch (err) {
		console.log("Error", err);
	}

	return response.data;
}
