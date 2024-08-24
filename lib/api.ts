// lib/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your actual API URL

export async function sendChatMessage(message: string) {
  const response = await axios.post(`${API_BASE_URL}/chat/`, { message });
  return response.data.response;
}

export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE_URL}/upload-pdf/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getPDFFiles(): Promise<string[]> {
  const response = await axios.get(`${API_BASE_URL}/pdf-files/`);
  return response.data.pdf_files;
}

export async function deletePDF(fileName: string) {
  const response = await axios.delete(`${API_BASE_URL}/delete-pdf/${fileName}`);
  return response.data;
}

export async function extractKeyPoints(pdfFile: string, numPoints: number = 5) {
  const response = await axios.post(`${API_BASE_URL}/extract-key-points/`, {
    pdf_file: pdfFile,
    num_points: numPoints,
  });
  return response.data;
}