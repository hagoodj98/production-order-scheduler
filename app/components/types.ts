export type SlotStatus = 'Available' | 'Pending' | 'Scheduled';

export type SlotKey =
  | '08:00-09:00'
  | '09:00-10:00'
  | '10:00-11:00'
  | '11:00-12:00'
  | '12:00-13:00'
  | '13:00-14:00';


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
  [key in SlotKey]: SlotStatus
}

export type AppContextType = {
  data: Table[];
  //This is the type of the setData function that updates a Table[] array in state
  setData: React.Dispatch<React.SetStateAction<Table[]>>;
}