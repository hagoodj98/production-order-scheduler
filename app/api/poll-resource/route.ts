import { NextResponse } from "next/server";
import { newResources } from "@/app/components/Resources";
import { getPendingJobs } from "@/utils/route";
import { SlotKey } from "@/app/components/types";
import slots from "@/app/components/dataslots";


export async function GET() {
    //I want to merge any Pending cells with the existing newResources array
    const availability = [...newResources];
    //I grab the existing array from getPendingJobs after addPendingJob function added the job to it.
    const pending = getPendingJobs();//array

    console.log(pending);
    console.log('pending array before processing');
    //This is a safe guard. So that I dont have to use the as SlotKey. The data I pass, if it comes back true, treat it as SlotKey to prevent typescript errors. Also allowed the passed value to check across a dynamic array of time slots
    function isSlotKey(key: string): key is SlotKey {
        return slots.map(s => s.slot).includes(key);
    }
    console.log(availability);//checking to see whats currently existing inside newResources
    console.log('what mark-pending sees before change');
    //Looping through the pending array I need the timeslot, which is the actual time the user selected. Need the resource of course to get the job object from the newResources array
    pending.forEach(({ id, timeslot, resource }) => {
        console.log(pending);
        console.log('inside pending array');
        const rowMatch = availability.find(job => job.row === id.row);
        console.log(rowMatch);
        console.log('match');
        if (rowMatch && isSlotKey(id.column)) {
            rowMatch[id.column] = 'Pending';
            
        }
        
        /*
        const rowMatch = availability.find(job => job.name === resource);//return an object/s from newResources
        console.log(rowMatch);//checking to see if i get what i asked
        console.log('pending job by name');
        if (rowMatch && isSlotKey(id.column)) {
            //if the timeslot already has a Scheduled status, simply ignore but otherwise change to Pending
            if (rowMatch[timeslot] === 'Scheduled') {
                return;
            } else {
                rowMatch[id.column] = 'Pending'; // Update specific timeslot to "Pending"
            }
        }
            */
    });
    console.log(availability);
    console.log('what mark-pending sees after the schedule change');
    return NextResponse.json({availability});
}