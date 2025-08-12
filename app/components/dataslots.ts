import { TimeSlots } from "./types";

const slots: TimeSlots[] = [
    {
        id: 1,
        slot: {
                start: '08:42',
                end: '08:45'
        }
    },
    {
        id: 2,
        slot: {
            start: '13:22',
            end: '13:23'
        }   
    },
    {
        id: 3,
        slot: {
            start: '24:47',
            end: '24:49'
        }   
    },
    
] as const;

export default slots;