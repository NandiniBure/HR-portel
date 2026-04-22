import axios from "axios";

export default async function login({ email, password }) {
  try {
    console.log(email, password);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}auth/login`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // 🔴 REQUIRED
      }
    );

    console.log(response.data.accessToken);

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("userId", response.data.user.id);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function signup({
  name,
  email,
  password,
  role,
  first_name,
  last_name,
  department_id,
  designation_id,
  joining_date,
  employment_type,
  salary,
}) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}auth/signup`,
      {
        name,
        email,
        password,
        role,
        first_name,
        last_name,
        department_id,
        designation_id,
        joining_date,
        employment_type,
        salary,
      },
      {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true, // 🔴 REQUIRED
        },
      }
    );

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("userId", response.data.user.id);

    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
}
