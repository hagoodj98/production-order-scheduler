'use client';

import React, { createContext, useContext } from "react";
import type { Table, AppContextType } from '../components/types'

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode;
}) {
    const [data, setData] = React.useState<Table[]>([]);

    return (
        <AppContext.Provider value={{data, setData}}>
            {children}
        </AppContext.Provider>
    )
}
export function useAppContext() {
    const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}