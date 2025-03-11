import { createContext, useContext, useState, ReactNode } from 'react';

// Define the context interface
interface ActiveMenuContextInterface {
  active: ActiveInterface;
  setActive: (newActive: ActiveInterface) => void;
}

export interface ActiveInterface {
  tasks: boolean;
  crm: boolean;
  pieChart: boolean;
  lineChart: boolean;
  barChart: boolean;
}

const dummyActiveMenu: ActiveMenuContextInterface = {
  active: {
    crm: false,
    tasks: true,
    pieChart: false,
    lineChart: false,
    barChart: false,
  },
  setActive: () => {},
};

const ActiveMenuContext = createContext<ActiveMenuContextInterface | undefined>(undefined);

export function ActiveMenuProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveInterface>(dummyActiveMenu.active);

  return (
    <ActiveMenuContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveMenuContext.Provider>
  );
}

export function useActiveMenu() {
  const context = useContext(ActiveMenuContext);
  return context;
}
