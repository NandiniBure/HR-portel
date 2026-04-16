import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}auth/refresh`,
      {
        withCredentials: true, // 🔴 sends refresh cookie
      }
    );

    const data = response.data;

    console.log("DATA 👉", data);

    if (!data?.accessToken) {
      throw new Error("No accessToken in response");
    }

    return data.accessToken;
  } catch (error) {
    console.error("Refresh failed:", error);
    return null;
  }
};
