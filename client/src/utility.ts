import axios from "axios";

export async function fetchData(
  endpoint: string,
  method: string,
  data?: object,
  headers?: object
) {
  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    let result;

    switch (method) {
      case "POST":
        if (!headers) {
          result = await axios.post(baseUrl + endpoint, data);
          return result;
        }

        result = await axios.post(baseUrl + endpoint, data, headers);
        return result;

      case "DELETE":
        result = await axios.delete(baseUrl + endpoint);
        return result;

      case "PATCH":
        result = await axios.patch(baseUrl + endpoint, data);
        return result;
      default:
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
