import axios from "axios";

export async function fetchData(endpoint: string, method: string, data?: object) {
    try {
        const baseUrl = import.meta.VITE_BACKEND_URL as ImportMeta || 'http://localhost:3001';
        let result;

        switch(method) {
            case 'POST':
                result = await axios.post(baseUrl + endpoint, data);
                return result;
            default: 
                result = await axios.get(baseUrl + endpoint);
                return result;
        }
    } catch (error: unknown) {
        const response = error.response.data;
        return {message: response.message, status: error.status};
    }
}