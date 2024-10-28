import { Nextclient } from "../lib/client/http";

export const deleteDocument = async (moduleId, token) => {
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

export const saveDocument = async (data, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post(`/documents/`, data, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}