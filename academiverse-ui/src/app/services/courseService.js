import { Nextclient } from "../lib/client/http";

export const getCourseByDeptId = async (departmentId, token) => {
	let response;
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		response = await Nextclient.get(`/courses/${departmentId}`, config);
	} catch (err) {
		console.log("Error", err);
	}
	return response.data;
};
