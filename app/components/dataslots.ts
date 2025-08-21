import { TimeSlots } from "./types";

//Add columns here. Below are some examples but follow the same structure of each object
const slots: TimeSlots[] = [
    {
        id: 1,
        slot: {
                start: '12:01',
                end: '12:02'
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
    
] as const; //This was to prevent the types.ts file from reading the type. I want the types file to read the actual value each array item is set to

export default slots;