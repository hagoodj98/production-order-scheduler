import { NextRequest, NextResponse } from 'next/server';
import cron from 'node-cron';
import type { Resource, TimeSlot, SlotKey } from '../../components/types';
import { newResources } from '@/app/components/Resources';

//Created a simple array of time slots.


export async function POST(req: NextRequest) {

    try {
        //TimeSlot expects an object. So body will be an object
        const body: TimeSlot = await req.json();
    
        // simply get the properties for use
        const timeSlot = `${body.timeslot}`;
        const resource = body.resource;

        const requestedJob = newResources.filter((job) => job.name === resource);
        /*const task= cron.schedule('* * * * *', () => {
                console.log('Running a task every minute');
        });*/
       
        console.log(timeSlot);
        
        //We want to take the data from the client and select the array holding the job. Inserting the users data inside to grab the key and change the value to pending
        requestedJob[0][timeSlot as SlotKey]='Pending';
       
        console.log(newResources);

        return NextResponse.json({slot: timeSlot, availabity: newResources});
    } catch (error) {
        console.log('error');
        
        console.error(error);
        
    }
   

    
}