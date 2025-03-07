import { createContext, ReactNode, useContext, useState } from "react";

export interface Employee {
    [key: string]: string;
}

export interface Employees {
    employees: Employee[];
    setEmployees: (emp: Employee[]) => void;
}

const defaultEmployees: Employees = {
    employees: [],
    setEmployees: () => {}
};

const EmployeesContext = createContext<Employees>(defaultEmployees);

export function PaginationProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>([]);

    return (
        <EmployeesContext.Provider value={{ employees, setEmployees }}>
            {children}
        </EmployeesContext.Provider>
    );
}

export function usePagination() {
    const context = useContext(EmployeesContext);
    return context;
}
