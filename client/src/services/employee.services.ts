import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../utility";

export const getEmployees = createAsyncThunk('employees/getEmployees', async ( _, thunkAPI ) => {
    try {
        const response = await fetchData('/api/admin', 'GET');
        console.log(response);

        return [];
    } catch (error) {
        console.log(error);
    }
} )