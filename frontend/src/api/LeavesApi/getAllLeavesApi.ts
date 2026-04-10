import axios from "axios";

export default async function getAllLeaves() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:5000/api/leaves/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch leaves:",
      error.response?.data || error.message
    );
    throw error;
  }
}
