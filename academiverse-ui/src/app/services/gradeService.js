import { Nextclient } from "../lib/client/http";

export const getStudentGrades = async (instructId, studentId, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.get(
            `grades/${instructId}/${studentId}`,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};

export const getInstructGrades = async (instructId, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.get(
            `grades/${instructId}`,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};

export const getQuizGrades = async (quizId, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.get(
            `grades/quiz/${quizId}`,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};

export const getAssignmentGrades = async (assignmentId, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.get(
            `grades/assignment/${assignmentId}`,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};

export const saveGrades = async (grades, token) => {
    let response;

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        response = await Nextclient.post(
            `grades/`,
            grades,
            config,
        );
    } catch (err) {
        console.log("Error", err);
    }

    return response.data;
};