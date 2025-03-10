import { useEffect } from "react";
import TaskForm from "./TaskForm";
import TasksTable from "./TasksTable";
import { fetchData } from "../utility";
import { useDispatch } from "react-redux";
import { setInitialState } from "../store/slices/task.slice";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

export default function TasksTab() {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTasks();
    }, [])

    async function fetchTasks() {
        try {
            const res = await fetchData('/api/tasks', 'GET');
            if(res.status === 200){
                dispatch(setInitialState(res.data));
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box sx={{width: '100%'}}>
            <Navbar heading="Tasks Management"/>
            <TaskForm />
            <TasksTable />
        </Box>
    )
}