import { Nextclient } from "../lib/client/http";

export const uploadDocument = async (data, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post(`/files/upload`, data, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}