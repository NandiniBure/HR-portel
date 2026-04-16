import API from "@/middlewear/ClientApi"; // ✅ your interceptor-based axios instance

export default async function getAllEmployeesApi(
  filters: {
    search?: string;
    department?: string;
    designation?: string;
    status?: string;
    joinedFrom?: string;
    joinedTo?: string;
  } = {}
) {
  try {
    // Prepare params by only including non-empty (non-undefined, non-empty string) values
    const params: Record<string, string> = {};

    console.log(filters);

    if (filters.search && filters.search.trim() !== "") {
      params.search = filters.search.trim();
    }
    if (filters.department && filters.department.trim() !== "") {
      params.department = filters.department.trim();
    }
    if (filters.designation && filters.designation.trim() !== "") {
      params.designation = filters.designation.trim();
    }
    if (filters.status && filters.status.trim() !== "") {
      params.status = filters.status.trim();
    }
    if (filters.joinedFrom && filters.joinedFrom.trim() !== "") {
      params.joinFrom = filters.joinedFrom.trim();
    }
    if (filters.joinedTo && filters.joinedTo.trim() !== "") {
      params.joinTo = filters.joinedTo.trim();
    }

    const res = await API.get("/employees", {
      params,
    });

    return res.data;
  } catch (e: any) {
    throw new Error(
      e?.response?.data?.message ||
        e.message ||
        "An error occurred while fetching employees"
    );
  }
}
