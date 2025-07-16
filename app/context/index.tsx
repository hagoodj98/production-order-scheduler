'use client';

import React, { createContext, useContext, useState } from "react";
import type { Table, AppContextType, SlotContextType, Slot } from '../components/types'
import { newResources } from "../components/Resources";

const AppContext = createContext<AppContextType | undefined>(undefined);
const SlotContext = createContext<SlotContextType | undefined>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode;
}) {
    const [data, setData] = React.useState<Table[]>(newResources);

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

export function SlotWrapper({children} : {
    children: React.ReactNode;
}) {
    const [dataSlot, setDataSlot] = React.useState<Slot>({
        id: {
            row: '',
            column: ''
        },
        name:'',
        time: ''
    });

    return (
        <SlotContext.Provider value={{dataSlot, setDataSlot}}>
            {children}
        </SlotContext.Provider>

    )
}

export function useSlotContext() {
    const context = useContext(SlotContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppWrapper");
      }
    return context;
}