import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (email: string, password: string, full_name: string) =>
  api.post("/auth/signup", { email, password, full_name });

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const getMe = () => api.get("/auth/me");

// Resume
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/resume/upload", formData);
};

export const analyzeResume = (
  resume_storage_path: string,
  resume_filename: string,
  job_description: string
) =>
  api.post("/resume/analyze", {
    resume_storage_path,
    resume_filename,
    job_description,
  });

export const getAnalyses = () => api.get("/resume/analyses");

export const getAnalysis = (id: string) => api.get(`/resume/analyses/${id}`);

export const deleteAnalysis = (id: string) =>
  api.delete(`/resume/analyses/${id}`);

export default api;