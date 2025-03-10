import { useDispatch } from "react-redux";
import { fetchData } from "../utility";
import styles from "./css/table.module.css";
import TablePopover from "./TablePopover";
import { addEmployee } from "../store/slices/employee.slice";
import { useRef } from "react";
import { useAdmin } from "../context/Admin";
import InfoIcon from "@mui/icons-material/Info";
import { usePagination } from "../context/Pagination";
import TableFilterForm from "./TableFilterForm";
import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import EmployeesTablePaginationDemo from "./Pagination";
import EditRowButton from "./EditRowButton";
import DeleteRowButton from "./DeleteRowButton";

export default function BasicTable() {
  const { admin } = useAdmin();
  const { employees } = usePagination();
  const headings = employees.length > 0 && [...Object.keys(employees[0])];
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      const res = await fetchData(
        `/api/admin/upload?adminId=${admin.id}`,
        "POST",
        formData
      );

      if (res.status === 201) {
        dispatch(addEmployee(res.data.data));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (employees.length === 0) {
    return (
      <div className={styles.container}>
        <InfoIcon sx={{ fontSize: "4rem" }} />
        <h1>No data found to display the table</h1>
        <p id={styles.text}>Click on the 'Upload button' to start</p>
      </div>
    );
  }

  return (
    <div id={styles.content}>
      <div id={styles.topContainer}>
        <TableFilterForm />
        <Button
          variant="outlined"
          sx={{ fontWeight: 600, padding: '0.8rem', fontSize: '1rem' }}
          onClick={handleUpload}
          startIcon={<UploadIcon />}
        >
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
      <div id={styles.tableContainer}>
      <table id={styles.table}>
        <thead>
          <tr className={styles.row}>
            {headings.map((heading: string, index: number) => (
              <th className={styles.theading} key={index}>
                {heading}
              </th>
            ))}
            <th className={styles.theading}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp: object, rowIndex: number) => (
            <tr key={rowIndex} className={styles.row}>
              {headings.map((heading: string, colIndex: number) => (
                <td className={styles.cols} key={colIndex}>
                  {emp[heading]}
                </td>
              ))}
              <td className={styles.cols}>
                {/* <TablePopover data={emp} /> */}
                <EditRowButton data={emp}/>
                <DeleteRowButton data={emp}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <EmployeesTablePaginationDemo />
    </div>
  );
}
