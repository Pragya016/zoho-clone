import { fetchData } from "../utility";
import { Employees } from "./CRMTab";
import styles from './css/employees.table.module.css';
import TablePopover from "./TablePopover";

export default function BasicTable({ employees }: Employees) {
    if (!employees || employees.length === 0) {
        return <p>No employees found.</p>;
    }

    const headings = ['' ,...Object.keys(employees[0])];

    function handleDelete(id: number) {
        deleteUser(id);
    }

    async function deleteUser(id: number){
        try {
            const res = await fetchData(`/api/admin/${id}`, 'DELETE');
            // update the state as well
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <table id={styles.table}>
            <thead>
                <tr>
                    {headings.map((heading, index) => (
                        <th key={index}>{heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {employees.map((emp, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>
                            <TablePopover onDelete={() => handleDelete(emp.id)}/>
                        </td>
                        {headings.map((heading, colIndex) => (
                            <td key={colIndex}>{emp[heading]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}