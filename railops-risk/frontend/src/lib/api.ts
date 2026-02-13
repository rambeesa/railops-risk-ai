import axios from "axios";

export const API_BASE = "http://127.0.0.1:8001";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});
