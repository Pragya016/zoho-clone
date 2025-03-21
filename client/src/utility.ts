import axios from "axios";

export async function fetchData(
  endpoint: string,
  method: string,
  data?: object | null,
  token?: string
) {
  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    let result;

    switch (method) {
      case "POST":
        if (!token) {
          result = await axios.post(baseUrl + endpoint, data);
          return result;
        }

        result = await axios.post(baseUrl + endpoint, data, config);
        return result;

      case "DELETE":
        if (!token) {
          result = await axios.delete(baseUrl + endpoint);
          return result;
        }

        result = await axios.delete(baseUrl + endpoint, config);
        return result;

      case "PATCH":
        if(!token) {
          result = await axios.patch(baseUrl + endpoint, data);
          return result;
        }

        result = await axios.patch(baseUrl + endpoint, data, config);
        return result;

      default:
        if (token) {
          result = await axios.get(baseUrl + endpoint, config);
          return result;
        }

        result = await axios.get(baseUrl + endpoint);
        return result;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error.response?.data;
      return { message: response?.message, status: error.response?.status };
    } else {
      return { message: "An unknown error occurred", status: 500 };
    }
  }
}
