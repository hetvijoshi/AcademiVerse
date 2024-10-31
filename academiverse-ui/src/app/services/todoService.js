import { Nextclient } from "../lib/client/http";

export const getUserTodos = async (instructId, userId, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/todo/${instructId}?userId=${userId}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const markCompleted = async (toDoId, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post(`/todo/${toDoId}`, null, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}