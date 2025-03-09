import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        getTasks: (state) => {
            return state;
        },
        createTask: (state, action) => {
            return [action.payload, ...state]
        },
        setInitialState: (state, action) => {
            return action.payload;
        }
    }
})

export const {getTasks, createTask, setInitialState} = taskSlice.actions;
export default taskSlice.reducer;