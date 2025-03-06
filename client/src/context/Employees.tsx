import React, { createContext, useContext, useState } from "react";

interface ProviderInterface {
    children: React.ReactNode;
}

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

export function EmployeesProvider({ children }: ProviderInterface) {
    const [employees, setEmployees] = useState<Employee[]>([]);

    return (
        <EmployeesContext.Provider value={{ employees, setEmployees }}>
            {children}
        </EmployeesContext.Provider>
    );
}

export function useEmployees() {
    const context = useContext(EmployeesContext);
    return context;
}
