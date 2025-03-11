import { useEffect, useState } from "react";
import { fetchData } from "../utility";
import BasicTable from "./Table";
import { useAdmin } from "../context/Admin";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee } from "../store/slices/employee.slice";
import Loader from "./Loader";
import { usePagination } from "../context/Pagination";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import { AxiosResponse } from "axios";

export default function CRMTab() {
  const { admin } = useAdmin();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const { page, rowsPerPage, setEmployees } = usePagination();
  const allEmployees = useSelector((state: {employees}) => state.employees);

  useEffect(() => {
    if (admin) {
      fetchEmployees();
    }
  }, [admin]);

  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedEmployees = allEmployees.slice(startIndex, endIndex);
    setEmployees(paginatedEmployees);
  }, [page, rowsPerPage, setEmployees, allEmployees]);

  async function fetchEmployees() {
    try {
      const res = await fetchData(`/api/admin`, "GET");
      dispatch(addEmployee((res as AxiosResponse).data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <Navbar heading='Customer Relationship Module'/>
      <BasicTable />;
    </Box>
  );
}
