import { createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    getEmployees: (state) => {
      return state;
    },
    addEmployee: (state, action) => {
      console.log(action.payload);
      return action.payload;
    },
    deleteEmployee: (state, action) => {
      const filteredData = state.filter(data => data.email !== action.payload.email);
      return filteredData;
    }
  }
});

export const {getEmployees, addEmployee, deleteEmployee} = employeesSlice.actions;
export default employeesSlice.reducer;