import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Employee {
  id: number;
  [key: string]: string | number;
}

interface SimpleTableProps {
  employees: Employee[];
}

export default function SimpleTable({ employees }: SimpleTableProps) {
  if (!employees || employees.length === 0) {
    return <p>No data available</p>;
  }

  const columns: GridColDef[] = Object.keys(employees[0]).map((key) => ({
    field: key,
    headerName: key,
    width: 150,
    editable: key === 'id',
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={employees}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
