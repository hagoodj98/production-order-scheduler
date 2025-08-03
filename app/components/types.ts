import React from "react";

export type SlotStatus = 'Pending' | 'Available' | 'Scheduled' | 'Busy';

export type SlotKey =
  | (typeof import("./dataslots").default[number]["slot"]);

export type CellID = {
  row: string,
  column: string
}

export type TimeSlots = {
  id: number,
  slot: string
}
interface ColumnFilter {
  id: string
  value: unknown
}
export type ColumnFiltersState = ColumnFilter[];

export type TimeJobSlot = {
  id: CellID,
  timeslot: string,
  resource: string
};

export type MapPending = {
  row: string,
  column: string,
}

export type AvailableSlotPair = {
  name: string,
  value: number
}

export type Resource = {
  id: number,
  name: string,
  row: string //This is so that I can have access to the row in which aligns with the job the user selected
} & {
  [key in SlotKey]: SlotStatus
}

export type Table = {
  id: number,
  name: string,
} & {
  //we are adding the following as keys from SlotKey so that I can access the key on the backend
  [key in SlotKey]: SlotStatus
}
export type Slot = {
  id: {
    row: string,
    column: string
  },
  time: string,
  name: string
}

export type AppContextType = {
  data: Table[];
  //This is the type of the setData function that updates a Table[] array in state
  setData: React.Dispatch<React.SetStateAction<Table[]>>;
  pendingCells: MapPending[];
  setPendingCells: React.Dispatch<React.SetStateAction<MapPending[]>>;
}
export type SlotContextType = {
  dataSlot: Slot,
  setDataSlot: React.Dispatch<React.SetStateAction<Slot>>;
  cellSlotArray: TimeJobSlot[];
  setCellSlotArray: React.Dispatch<React.SetStateAction<TimeJobSlot[]>>,
}
export type ErrorMessage = {
  field: string,
  message: string
}

export type CustomError = {
  message: string,
  status: number
}

export type PollResourceResponse = {
  availability: Table[],
  pendingCellsArray: TimeJobSlot[]
};
export type FormErrors = ErrorMessage[] | CustomError;