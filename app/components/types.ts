
export type SlotStatus = 'Available' | 'Scheduled' | 'Busy';

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

export type TimeJobSlot = {
  id: CellID,
  timeslot: string,
  resource: string
};

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
  name: string,
  time: string
}

export type AppContextType = {
  data: Table[];
  //This is the type of the setData function that updates a Table[] array in state
  setData: React.Dispatch<React.SetStateAction<Table[]>>;
}
export type SlotContextType = {
  dataSlot: Slot,
  setDataSlot: React.Dispatch<React.SetStateAction<Slot>>;
}
export type ErrorMessage = {
  field: string,
  message: string
}