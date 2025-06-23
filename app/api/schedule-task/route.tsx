import { NextRequest, NextResponse } from 'next/server';
import cron from 'node-cron';
import type { TimeSlot } from '../../components/types';
import { newResources } from '@/app/components/Resources';

//Created a simple array of time slots.
const slots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00"
];

export async function POST(req: NextRequest) {

    try {
        //TimeSlot expects an object. So body will be an object
        const body: TimeSlot = await req.json();
    
        // simply get the properties for use
        const startTime = `${body.start}`;
        const endTime = body.end;
        //For now, I created a string, so that it matches one of the items in the slots array 
        const timeSlot = `${startTime}-${endTime}`;
        console.log(timeSlot);
        const pendingSlot = slots.filter((slot) => slot === timeSlot);

        //logging the request time slot
        console.log('pending');
        console.log(pendingSlot);
        
        const resource = body.resource;

        const requestedJob = newResources.filter((job) => job.name === resource);

        //I beleive I will have a use of this later on when I want to flag certain properties
        /*const task= cron.schedule('* * * * *', () => {
                console.log('Running a task every minute');
        });*/

        //I get { name: 'Assembly Line B', status: 'Available' }. Now I want to change the status to pending.
        console.log(requestedJob[0]);
        const pendingJob = requestedJob[0].status = 'pending';

        console.log(newResources);

        return NextResponse.json({slot: timeSlot, availabity: newResources});
    } catch (error) {
        console.log('error');
        
        console.error(error);
        
    }
   

    
}