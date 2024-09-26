import { Nextclient } from "../lib/client/http";

export const getAllDegree = async (token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/degree`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}