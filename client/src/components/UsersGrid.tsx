import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { Employees } from '../context/Pagination';

export default function UsersGrid() {
  const employees = useSelector((state: Employees) => state.employees);
  
  if(employees.length <= 0) {
    return (
      <h1>No data found to display the table</h1>
    )
  }

  const headings = [...Object.keys(employees[0]), 'actions'];
  const cols = headings.map(heading => {
    return {
      field: heading,
      header: heading,
    }
  })

  const rows = employees.map(emp => {
    return {
      ...emp, action: ''
    }
  })

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
