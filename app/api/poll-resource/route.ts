import { NextResponse } from "next/server";
import { newResources } from "@/app/components/Resources";
import { getPendingJobs } from "@/utils/route";
import { SlotKey } from "@/app/components/types";
import slots from "@/app/components/dataslots";

export async function GET() {
    //I want to merge any Pending cells with the existing newResources array
    const availability = [...newResources];
    //I grab the existing array from getPendingJobs after addPendingJob function added the job to it.
    const pendingCellsArray = getPendingJobs();//array

    console.log(pendingCellsArray);
    console.log('pending array before processing');
    //This is a safe guard. So that I dont have to use the as SlotKey. The data I pass, if it comes back true, treat it as SlotKey to prevent typescript errors. Also allowed the passed value to check across a dynamic array of time slots
    function isSlotKey(key: string): key is SlotKey {
        return slots.map(s => `${s.slot.start}-${s.slot.end}`).includes(key);
    }
    console.log(availability);//checking to see whats currently existing inside newResources
    console.log('what mark-pending sees before change');
    //Looping through the pending array I need the timeslot, which is the actual time the user selected. Need the resource of course to get the job object from the newResources array
    pendingCellsArray.forEach(({ id, timeslot, resource }, index) => {
        const timeSlot = `${timeslot.start}-${timeslot.end}`;
        console.log(pendingCellsArray);
        console.log('inside pending array');
        const rowMatch = availability.find(job => job.row === id.row);
        console.log(rowMatch);
        console.log('match');
        if (rowMatch && isSlotKey(id.column)) {
            if (rowMatch[id.column] === 'Scheduled' || rowMatch[id.column] === 'Busy') {
                pendingCellsArray.splice(index, 1);
                return;
            }
            //This prevents a cell with a Scheduled status, change back to Pending.
            else {
                rowMatch[id.column] = 'Pending'; // Update specific timeslot to "Pending"
                const foundScheduledCell = availability.find(job => job.name === resource);
                if (foundScheduledCell) {
       //             console.log(foundScheduledCell);
           //         console.log('here is the job that has the scheduled status');
                    if (isSlotKey(timeSlot)) {
                        //If user went into one cell and selected another job, change the original cell back to Available, don't let it Pending anymore
                        if (foundScheduledCell[timeSlot] === 'Scheduled') {
                            rowMatch[id.column] = 'Available';
                            pendingCellsArray.splice(index, 1);
                        
                        }
                    }
                }
            } 
        } 
    });
   // console.log(availability);
   // console.log('what mark-pending sees after the schedule change');
    return NextResponse.json({availability, pendingCellsArray});
}
