import { NextRequest, NextResponse } from 'next/server';
import type {TimeSlot } from '../../components/types';
import { myTasks } from '@/tasks/MyTasks';
import { newResources } from '@/app/components/Resources';
import { setLatestJob, getLatestJob } from '@/utils/route';

export async function POST(req: NextRequest) {

    try {
        //TimeSlot expects an object. So body will be an object
        const body: TimeSlot = await req.json();
    
         // User-submitted input
        if (body?.timeslot && body?.resource) {
            //Save the input so cron can later retrieve it. If data is not saved then timeslot and resource will be undefined from Cron's perspective, because it is sending an empty payload
            setLatestJob({ timeSlot: body.timeslot, resource: body.resource });
            return NextResponse.json({ message: 'Input saved' });//debugging
        }

        // Retrieve and use the most up-to-date job input for cron. Because cron makes an API request to this endpoint with an empty body
        const { timeSlot, resource } = getLatestJob();

        if (timeSlot && resource) {
            console.log('🔄 Reusing saved job:', { timeSlot, resource });//debugging
            myTasks(timeSlot, resource);
          }
          console.log(newResources);
          
          
        return NextResponse.json({ availabity: newResources, message: 'Task ran with latest job'});
    } catch (error) {
        console.error(error);
    }
    
}