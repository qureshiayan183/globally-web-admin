// apiClient.js
import axios from "axios";
import { handleResponse } from "./authService";

// const BACKEND_URL = "http://localhost:5000/api/v1";
// const BACKEND_URL = "http://192.168.1.43:2222/api/v1";
const BACKEND_URL = "https://globallywebsolutions.ca/api/v1";

/**
 * Make an API request
 * @param {"get"|"post"|"put"|"delete"} method
 * @param {string} url
 * @param {Object} data
 * @param {Object} headers
 * @param {boolean} isFile
 */
export const makeRequest = async (
  method,
  url,
  data = {},
  headers = {},
  isFile = false,
) => {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${BACKEND_URL}${url}`,
      headers: {
        ...(isFile
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        ...headers,
      },
    };

    if (method.toLowerCase() === "get") {
      config.params = data;
    } else {
      config.data = isFile ? data : JSON.stringify(data);
    }

    const response = await axios(config);
    console.log("response", response);

    return handleResponse(response.data);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    console.error("Request Error:", message);

    // Optional: rethrow with more context
    throw new Error(message);
  }
};

export const makeRequestAuth = async (
  method,
  url,
  data = {},
  isFile = false,
) => {
  try {
    // Get token from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      throw new Error("Token not found. Please login again.");
    }

    // Prepare headers
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(isFile
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" }),
    };

    // Create request config
    const config = {
      method: method.toLowerCase(),
      url: `${BACKEND_URL}${url}`,
      headers,
    };

    if (method.toLowerCase() === "get") {
      config.params = data;
    } else {
      config.data = isFile ? data : JSON.stringify(data);
    }

    const response = await axios(config);
    console.log("API Response:", response);

    return handleResponse(response.data);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    console.error("API Error:", message);
    throw new Error(message);
  }
};

export const uploadFiles = async ({
  files = [],
  endpoint = "/uploadImage",
  fieldName = "files",
  isMultiple = true,
}) => {
  if (!files.length) throw new Error("No file selected.");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  if (!token) throw new Error("Token not found. Please login again.");

  const formData = new FormData();
  if (isMultiple) {
    files.forEach((file) => {
      formData.append(fieldName, file); // 👈 must match backend
    });
  } else {
    formData.append(fieldName, files[0]);
  }

  try {
    const res = await axios.post(`${BACKEND_URL}${endpoint}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // 👇 DO NOT manually set Content-Type
      },
    });

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Upload failed";
    console.error("Upload error:", message);
    throw new Error(message);
  }
};
