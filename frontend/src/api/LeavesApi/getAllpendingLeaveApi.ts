import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getAllPendingLeaveApi = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const response = await axios.get(`${BASE_URL}/leaves/pending-leaves`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data?.message || "Failed to fetch pending leaves");
    }
    throw new Error("Network error");
  }
};