
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