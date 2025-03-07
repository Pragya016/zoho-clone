import { createContext, ReactNode, useContext, useState } from "react";

export interface Admin {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface AdminInterface {
    admin: Admin | null;
    setAdmin: (admin: Admin) => void;
}

const dummyUser: AdminInterface = {
    admin: null,
    setAdmin: () => {}
};

const UserContext = createContext<AdminInterface>(dummyUser);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);

    return (
        <UserContext.Provider value={{ admin, setAdmin }}>
            {children}
        </UserContext.Provider>
    );
}

export function useAdmin() {
    return useContext(UserContext);
}
