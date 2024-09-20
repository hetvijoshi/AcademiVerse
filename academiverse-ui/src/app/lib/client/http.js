import axios from "axios";

export const Nextclient = axios.create({
  baseURL: process.env.BASE_API_URL,
});
