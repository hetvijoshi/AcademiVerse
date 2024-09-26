import { Nextclient } from "../lib/client/http";

export const getAllDepartment = async (token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/department`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}