import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from 'react-redux';
import { Employees, usePagination } from '../context/Pagination';

export default function EmployeesTablePaginationDemo() {
  const allEmployees = useSelector((state: Employees) => state.employees);
  const { employees, page, setPage, rowsPerPage, setRowsPerPage } = usePagination();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if(employees.length <= 0) {
    return (
      <h1>No data found</h1>
    )
  }

  return (
      <TablePagination
        style={{background: 'whitesmoke', color: 'grey'}}
        component="div"
        count={allEmployees.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  );
}
