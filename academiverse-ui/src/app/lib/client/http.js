import axios from "axios";

export const Nextclient = axios.create({
  baseURL: "http://localhost:8080",
});
