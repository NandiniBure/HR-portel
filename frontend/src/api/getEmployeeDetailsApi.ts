import axios from "axios";

export default async function getEmployeeById({ userId }) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:5000/api/employees/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

   
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}
