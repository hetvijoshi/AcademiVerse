import { Nextclient } from "../lib/client/http";

export const getUserDetails = async (id, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/users/${id}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const fetchUserByEmail = async (email, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/users/?email=${email}`, config);
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
        response = await Nextclient.post("/users/", data, config);
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
        response = await Nextclient.put("/users/", data, config);
    }
    catch (err) {
        console.log("Error", err)
    }
    return response.data
}