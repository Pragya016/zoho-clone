import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        createTask: (state, action) => {
            return [action.payload, ...state]
        },
        setInitialState: (state, action) => {
            return action.payload;
        },
        updateTasks: (state, action) => {
            const updatedTask = action.payload;
            const index = state.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                state[index] = updatedTask;
            }
        },
        deleteTask: (state, action) => {
            const deletedTaskId = action.payload;
            const updatedTasks = state.filter(task => task.id !== deletedTaskId);
            return updatedTasks
        }
        
    }
})

export const { createTask, setInitialState, updateTasks, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;