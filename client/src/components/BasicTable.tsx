import { Employees } from "./CRMTab";
import styles from './css/employees.table.module.css';
import TablePopover from "./TablePopover";

export default function BasicTable({ employees }: Employees) {
    if (!employees || employees.length === 0) {
        return <p>No employees found.</p>;
    }

    const headings = ['' ,...Object.keys(employees[0])];

    function handleDelete(id: number) {
        // delete data from the database
        console.log('id from table', id);
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