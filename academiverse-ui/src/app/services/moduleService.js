import { Nextclient } from "../lib/client/http";

export const getModules = async (instructId, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/modules/?instructId=${instructId}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const saveModules = async (data, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post(`/modules/`, data, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const deleteModule = async (moduleId, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.delete(`/documents/${moduleId}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

