import { useDispatch } from "react-redux";
import { fetchData } from "../utility";
import styles from './css/employees.table.module.css';
import TablePopover from "./TablePopover";
import { addEmployee } from "../store/slices/employee.slice";
import { useEffect, useState } from "react";
import { useAdmin } from "../context/Admin";
import InfoIcon from '@mui/icons-material/Info';
import { usePagination } from "../context/Pagination";

export default function BasicTable() {
    const {admin} = useAdmin();
    const {employees} = usePagination();
    const headings = employees.length > 0 && [...Object.keys(employees[0])];
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, [admin])

    async function getUsers() {
        try {
            if(admin){
                const response = await fetchData(`/api/admin?adminId=${admin.id}`, 'GET');
                dispatch(addEmployee(response.data));
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    if(loading) {
        return (
            <h1>Loading table...</h1>
        )
    }
        
    if (employees.length === 0) {
        return (
        <div className={styles.container}>
            <InfoIcon sx={{fontSize: '4rem'}}/>
            <h1>No data found to display the table</h1>
            <p id={styles.text}>Click on the 'Upload button' to start</p>
        </div>
        )
    }

    return (
        <>
        <h1 id={styles.heading}>Employees Table</h1>
        <table id={styles.table}>
            <thead>
                <tr className={styles.row}>
                    {headings.map((heading: string, index: number) => (
                        <th className={styles.theading} key={index}>{heading}</th>
                    ))}
                    <th className={styles.theading}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((emp: object, rowIndex: number) => (
                    <tr key={rowIndex} className={styles.row}>
                        {headings.map((heading: string, colIndex: number) => (
                            <td className={styles.cols} key={colIndex}>{emp[heading]}</td>
                        ))}
                        <td className={styles.cols}>
                            <TablePopover data={emp}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );
}