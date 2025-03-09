import { useEffect } from "react";
import TaskForm from "./TaskForm";
import TasksTable from "./TasksTable";
import { fetchData } from "../utility";
import { useDispatch } from "react-redux";
import { setInitialState } from "../store/slices/task.slice";

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
        <div>
            <TaskForm />
            <TasksTable />
        </div>
    )
}