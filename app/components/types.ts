export type SlotStatus = 'Available' | 'Pending' | 'Busy';

export type SlotKey =
  | '12:13-12:15'
  | '12:14-12:17'
  | '12:15-12:19'


export type TimeSlot = {
  timeslot: string 
  resource: string
};

export type Resource = {
  id: number,
  name: string,
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