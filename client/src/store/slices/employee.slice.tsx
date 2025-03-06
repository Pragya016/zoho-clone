import { createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    getEmployees: (state) => {
      return state;
    },
    addEmployee: (state, action) => {
      const updatedState = [...state, action.payload]
      return updatedState;
    },
    deleteEmployee: (state, action) => {
      const filteredData = state.filter(data => data.email !== action.payload.email);
      console.log(filteredData);
      return filteredData;
    }
  }
});

export const {getEmployees, addEmployee, deleteEmployee} = employeesSlice.actions;
export default employeesSlice.reducer;