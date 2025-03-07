import { BaseSyntheticEvent, useEffect, useRef } from "react";
import styles from "./css/crm.module.css";
import {
    Button,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { fetchData } from "../utility";
import BasicTable from "./BasicTable";
import { useAdmin } from "../context/Admin";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee } from "../store/slices/employee.slice";
import EmployeesTablePaginationDemo from "./EmployeesTablePagination";
import TableFilterForm from "./TableFilterForm";

export default function CRMTab() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { admin } = useAdmin();
  const allEmployees = useSelector((state: any) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    if (admin) {
      fetchEmployees();
    }
  }, [admin]);

  async function fetchEmployees() {
    try {
      const res = await fetchData(`/api/admin`, "GET");
      dispatch(addEmployee(res.data));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  function handleUpload() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: BaseSyntheticEvent) {
    const file = e.target.files[0];
    if (file) {
      uploadData(file);
    }
  }

  async function uploadData(file: File) {
    try {
      if (!admin || !admin.id) {
        console.error("Admin is undefined or missing ID");
        return;
      }

      const formData = new FormData();
      formData.append("employees-data", file);
      const res = await fetchData(`/api/admin/upload?adminId=${admin.id}`, "POST", formData);

      if(res.status === 201){
        dispatch(addEmployee(res.data.data));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id={styles.content}>
      <div id={styles.topContainer}>
        <TableFilterForm />
        <Button onClick={handleUpload} startIcon={<UploadIcon />}>
          Upload File
        </Button>
        <input
          type="file"
          onChange={handleFileChange}
          name="employees"
          id="fileInput"
          ref={fileInputRef}
          hidden
        />
      </div>
      <div>
        <BasicTable />
        {allEmployees.length > 0 && <EmployeesTablePaginationDemo />}
      </div>
    </div>
  );
}
