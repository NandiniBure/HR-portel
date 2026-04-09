import axios from "axios";

export default async function getLeaveBalance(year) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/leaves/balance?year=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get leave balance failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
