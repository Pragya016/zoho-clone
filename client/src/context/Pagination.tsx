import { createContext, ReactNode, useContext, useState } from "react";

export interface Employee {
    [key: string]: string;
}

export interface Employees {
    employees: Employee[];
    setEmployees: (emp: Employee[]) => void;
    page: number;
    setPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (page: number) => void;
}

const defaultEmployees: Employees = {
    employees: [],
    setEmployees: () => {},
    page: 0,
    setPage: () => [],
    rowsPerPage: 10,
    setRowsPerPage: () => [],
};

const EmployeesContext = createContext<Employees>(defaultEmployees);

export function PaginationProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    return (
        <EmployeesContext.Provider value={{ employees, setEmployees, page, setPage ,rowsPerPage, setRowsPerPage }}>
            {children}
        </EmployeesContext.Provider>
    );
}

export function usePagination() {
    const context = useContext(EmployeesContext);
    return context;
}
