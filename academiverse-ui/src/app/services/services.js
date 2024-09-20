import { Nextclient } from "../lib/client/http";

export const getUserDetails = async (id, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/user/${id}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const postUserDetails = async (data, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post("/user", data, config);
    }
    catch (err) {
        console.log("Error", err)
    }
    return response.data
}

export const putUserDetails = async (data, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.put("/user", data, config);
    }
    catch (err) {
        console.log("Error", err)
    }
    return response.data
}