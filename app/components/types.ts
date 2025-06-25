
export type TimeSlot = {
    start: string;
    end: string;
    resource: string
  };

 export type Resource = {
    id: number,
    name: string,
    status: string
}

export type Table = {
  id: string,
  name: string,
  status: string
}

export type AppContextType = {
  data: Table[];
  //This is the type of the setData function that updates a Table[] array in state
  setData: React.Dispatch<React.SetStateAction<Table[]>>;
}