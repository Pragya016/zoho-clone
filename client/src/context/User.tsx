import React, { createContext, useContext, useState } from "react";

interface ProviderInterface {
    children: React.ReactNode;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface UserInterface {
    user: User | null;
    // setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setUser: (user: User) => void;
}

const dummyUser: UserInterface = {
    user: null,
    setUser: () => {}
};

const UserContext = createContext<UserInterface>(dummyUser);

export function UserProvider({ children }: ProviderInterface) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
