import { createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    getEmployees: (state) => {
      return state;
    },
    addEmployee: (state, action) => {
      return action.payload;
    },
    deleteEmployee: (state, action) => {
      const filteredData = state.filter(data => data.email !== action.payload.email);
      return filteredData;
    },
    updateEmployees: (state, action) => {
      const updatedState = state.map(emp => {
        if(emp.email === action.payload.email){
          return action.payload;
        }

        return emp;
      })

      return updatedState;
    }
  }
});

export const {getEmployees, addEmployee, deleteEmployee, updateEmployees} = employeesSlice.actions;
export default employeesSlice.reducer;