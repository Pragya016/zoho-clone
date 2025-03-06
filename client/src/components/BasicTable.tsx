import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utility";
import styles from './css/employees.table.module.css';
import TablePopover from "./TablePopover";
import { addEmployee } from "../store/slices/employee.slice";
import { useEffect } from "react";
import { useAdmin } from "../context/Admin";
import InfoIcon from '@mui/icons-material/Info';

export default function BasicTable() {
    const {admin} = useAdmin();
    const employees = useSelector(state => state.employees);
    const headings = employees.length > 0 && [...Object.keys(employees[0])];
    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, [])

    async function getUsers() {
        try {
            const response = await fetchData(`/api/admin?adminId=${admin.id}`, 'GET');
            dispatch(addEmployee(response.data));
        } catch (error) {
            console.error(error);
        }
    }

        
    if (!employees || employees.length === 0) {
        return (
        <div className={styles.container}>
            <InfoIcon sx={{fontSize: '4rem'}}/>
            <h1>No data found to display the table</h1>
            <p id={styles.text}>Click on the 'Upload button' to start</p>
        </div>
        )
    }

    return (
        <table id={styles.table}>
            <thead>
                <tr className={styles.row}>
                    <th className={styles.theading}></th>
                    {headings.map((heading, index) => (
                        <th className={styles.theading} key={index}>{heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {employees.map((emp, rowIndex) => (
                    <tr key={rowIndex} className={styles.row}>
                        <td className={styles.cols}>
                            <TablePopover data={emp}/>
                        </td>
                        {headings.map((heading, colIndex) => (
                            <td className={styles.cols} key={colIndex}>{emp[heading]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}