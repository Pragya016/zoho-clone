import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utility";
import styles from './css/employees.table.module.css';
import TablePopover from "./TablePopover";
import { addEmployee } from "../store/slices/employee.slice";
import { useEffect } from "react";
import { useAdmin } from "../context/Admin";

export default function BasicTable() {
    const {admin} = useAdmin();
    const employees = useSelector(state => state.employees);
    const headings = [...Object.keys(employees[0])];
    const dispatch = useDispatch();
    console.log(employees);

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
        return <p>No employees found.</p>;
    }

    return (
        <table id={styles.table}>
            <thead>
                <tr className={styles.row}>
                    <th className={styles.theading}>Options</th>
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