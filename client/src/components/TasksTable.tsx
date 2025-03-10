import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utility";
import { updateTasks } from "../store/slices/task.slice";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";

export default function TasksTable() {
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
  const tasks = useSelector((state: any) => state.tasks);
  const headings = tasks.length > 0 ? Object.keys(tasks[0]) : [];
  const dispatch = useDispatch();

  if (tasks.length <= 0) {
    return <h1>Start creating tasks and assign them</h1>;
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
        }

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            {headings.map((heading) => (
              <td key={heading}>
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
            <td>
              <EditTaskButton data={task}/>
              <DeleteTaskButton taskId={task.id}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// import { DataGrid } from '@mui/x-data-grid';
// import { Box } from '@mui/material';
// import { useSelector } from 'react-redux';

// export default function DataGridDemo() {
//   const tasks = useSelector(state => state.tasks);
//   const headings = tasks && tasks.length > 0 ? Object.keys(tasks[0]) : [];
//   const cols = headings && headings.length > 0
//     ? headings.map((heading: string) => ({
//         field: heading,
//         headerName: heading.charAt(0).toUpperCase() + heading.slice(1),
//         width: 150,
//       }))
//     : [];

//   return (
//     <Box sx={{height: 'auto', width: '80%', margin: '2rem auto'}}>
//       <DataGrid
//         rows={tasks}
//         columns={cols}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 5,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         // checkboxSelection
//         disableRowSelectionOnClick
//       />
//     </Box>
//   );
// }
