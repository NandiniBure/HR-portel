import axios from "axios";

export default async function getAllEmployeesApi(search?: string) {
  console.log("--->",search);
  try {
    const token = localStorage.getItem("token");
    const params: Record<string, string> = {};
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }
    const res = await axios.get("http://localhost:5000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return res.data;
  } catch (e: any) {
    throw new Error(e.message || "An error occurred while fetching employees");
  }
}
