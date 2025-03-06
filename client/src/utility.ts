import axios from "axios";

export async function fetchData(endpoint: string, method: string, data?: object, headers?: object) {
    try {
        const baseUrl = import.meta.VITE_BACKEND_URL as ImportMeta || 'http://localhost:3001';
        let result;

        switch(method) {
            case 'POST':
                if(!headers) {
                    result = await axios.post(baseUrl + endpoint, data);
                    return result;
                }

                result = await axios.post(baseUrl + endpoint, data, headers);
                return result;
            
            case 'DELETE':
                result = await axios.delete(baseUrl + endpoint);
                return result;

            case 'PATCH': 
                console.log(baseUrl + endpoint);
                result = await axios.patch(baseUrl + endpoint, data);
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