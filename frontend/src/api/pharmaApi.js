// pharmaApi.js
// Handles all API calls to the FastAPI backend

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for LLM generation
});


export const analyzeVCF = async (vcfFile, drugNames) => {
  /**
   * Sends VCF file + drug names to backend for analysis.
   * Returns structured pharmacogenomic risk JSON.
   */
  const formData = new FormData();
  formData.append("vcf_file", vcfFile);
  formData.append("drug_names", drugNames);

  const response = await api.post("/api/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};


export const getSupportedDrugs = async () => {
  /**
   * Fetches list of supported drugs from backend.
   */
  const response = await api.get("/api/drugs");
  return response.data.supported_drugs;
};


export const checkHealth = async () => {
  /**
   * Checks if backend is running.
   */
  const response = await api.get("/api/health");
  return response.data;
};