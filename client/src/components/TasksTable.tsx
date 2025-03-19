import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utility";
import { updateTasks } from "../store/slices/task.slice";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import styles from './css/table.module.css';
import { toast, ToastContainer } from "react-toastify";

interface Tasks {
  tasks: {[key: string]: string}[];
}

export default function TasksTable() {
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
  const tasks = useSelector((state: Tasks) => state.tasks);
  const headings = tasks.length > 0 ? Object.keys(tasks[0]) : [];
  const dispatch = useDispatch();

  if (tasks.length <= 0) {
    return <div id={styles.errorContainer}>
      <FormatListBulletedIcon sx={{fontSize: '5rem'}} />
      <h1 id={styles.errorHeading}>There are no tasks to display</h1>
      <p id={styles.errorText}>Click on the 'Create Task' button to create a new task</p>
    </div>
  }

  function handleChange(event: SelectChangeEvent<string>, taskId: string) {
    const value = event.target.value;
    setSelectedStatus({
      ...selectedStatus,
      [taskId]: value,
    });

    // Update the status in the database
    updateStatus(taskId, value);
  };

  async function updateStatus(taskId: string, value: string) {
    try {
        const res = await fetchData(`/api/tasks/${taskId}`, 'PATCH', {status: value});

        if(res.status === 200) {
          dispatch(updateTasks(res.data));
          toast.success('Task status updated successfully');
        }

    } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Couldn\'t update task status');
    }
  }

  return (
    <>
    <div id={styles.content}>
    <table id={styles.table}>
      <thead>
        <tr className={styles.row}>
          {headings.map((heading, index) => (
            <th className={styles.theading} key={index}>{heading}</th>
          ))}
          <th className={styles.theading}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr className={styles.row} key={task.id}>
            {headings.map((heading) => (
              <td key={heading} className={styles.cols}>
                {heading === 'status' ? (
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id={`status-label-${task.id}`}>Status</InputLabel>
                    <Select
                      labelId={`status-label-${task.id}`}
                      id={task.id}
                      value={task[heading] || ''}
                      label="Status"
                      onChange={(e) => handleChange(e, task.id)}
                    >
                      <MenuItem value='Not started'>Not Started</MenuItem>
                      <MenuItem value='In Progress'>In Progress</MenuItem>
                      <MenuItem value='Pending'>Pending</MenuItem>
                      <MenuItem value='Completed'>Completed</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  task[heading]
                )}
              </td>
            ))}
            <td className={styles.cols}>
              <EditTaskButton data={task}/>
              <DeleteTaskButton taskId={task.id}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <ToastContainer closeOnClick={true}/>
    </>
  );
}