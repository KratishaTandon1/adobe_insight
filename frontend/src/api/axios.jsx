import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Make sure this is the backend URL
});

export default instance;
