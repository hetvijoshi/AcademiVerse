import { Nextclient } from "../lib/client/http";

export const getEnrolledStudents = async (instructId, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.get(
            `enrolments/eligible/${instructId}`,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};

export const enrolledStudent = async (data, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.post(
            `enrolments/`,
            data,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};