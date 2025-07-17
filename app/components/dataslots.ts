import { TimeSlots } from "./types";

const slots: TimeSlots[] = [
    {
        id: 1,
        slot: '08:42-08:45'
    },
    {
        id: 2,
        slot: '24:45-24:47'
    },
    {
        id: 3,
        slot: '24:47-24:49'
    },
    
] as const;

export default slots;