import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from './slices/employee.slice';
import tasksReducer from './slices/task.slice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    tasks: tasksReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
