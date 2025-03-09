import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function TasksTable() {
  const [age, setAge] = useState('');
  const tasks = useSelector((state) => state.tasks);
  const headings = tasks.length > 0 ? Object.keys(tasks[0]) : [];

  if (tasks.length <= 0) {
    return <h1>Start creating tasks and assign them</h1>;
  }


  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading, index: number) => (
            <th key={index}>{heading}</th>
          ))}
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index: number) => (
          <tr key={index}>
            {headings.map((heading: string, colIndex: number) => (
              <td key={colIndex}>
                {heading === 'status' &&  <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id={task.id}
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>}
                {heading !== 'status' && task[heading]}
              </td>
            ))}
            <td>edit, delete, status</td>
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
