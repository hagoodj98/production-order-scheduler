import { NextRequest, NextResponse } from 'next/server';
import type {TimeJobSlot, ErrorMessage, Resource} from '../../components/types';
import { myTasks, loopThroughScheduledJobs, parseTime  } from '@/tasks/MyTasks';
import { CustomError } from '@/utils/CustomErrors';
import { newResources } from '@/app/components/Resources';
import { getScheduledJobs } from '@/utils/route';
import * as z from 'zod/v4';
import slots from '@/app/components/dataslots';

//validating data before use
const cellID = z.object({
    row: z.string(),
    column: z.string()
});
const startEndTime = z.object({
    start: z.string().min(1,'Please select start time'),
    end: z.string().min(1,'Please select end time')
})
const userSelectionSchema = z.object({
    id: cellID,
    timeslot: startEndTime,
    resource: z.string().min(1, 'Please choose a job'),
});

export async function POST(req: NextRequest) {
    try {
        if (!req) {
            throw new CustomError('Missing input information', 404);
        }
        const raw = await req.json();
        if (Object.keys(raw).length > 0) {
            const validData = await userSelectionSchema.parseAsync(raw);
            //TimeSlot expects an object. So body will be an object
            const body: TimeJobSlot = validData;
            // User-submitted input
            if (body?.id && body?.timeslot && body?.resource) {
                // e.g:// { row: '1', column: '15:24-15:27' }
                //console.log(body.id);
                
                const { start, end } = body.timeslot;
                //the endTime and startTime are things we want to check before we proceed processing. For example, if user selects a time that is in the past or if user made end time before start time which is logically wrong
                const endTime = parseTime(end);
                const startTime = parseTime(start);
                const date = new Date();
                //if the current time is greater than the startTime selected, then the user selected a time in the past. So throw an error.
                if (startTime <= date) {
                    throw new CustomError('Cannot schedule in the past', 400);
                }
                //This prevents if users selects a start time that is greater then the end time
                if (endTime <= startTime) {
                    throw new CustomError('Sorry! End time must be after start time.', 400);
                }
                //This checks if user tries to select a start and end time that does  exists. If it does then proceed processing.
                const slotFound = slots.find(slot => slot.slot.start === start && slot.slot.end === end);
              
                if (!(slotFound === undefined)) {
                    const timeSlot = `${slotFound?.slot.start}-${ slotFound?.slot.end}`;
                   // setLatestJob({id: {row, column}, timeSlot: timeSlot, resource: body.resource });
                    try {
                        // ✅ Actually run the scheduling logic here
                        myTasks(timeSlot, body.resource, body.id);
                        return NextResponse.json({ availabity: newResources, message: 'Task ran successfully' }, { status: 200 });
                    } catch (err) {
                        if (err instanceof CustomError) {
                            return new NextResponse( JSON.stringify({ error: err.message, status: err.statusCode}), {status: err.statusCode});
                        }
                        return NextResponse.json({ message: 'Unknown error in task processing' }, { status: 500 });
                    }
                } else {
                    throw new CustomError('This time slot does not exist', 400);
                }
            }
        }
        // Retrieve and use the most up-to-date job input for cron. Because cron makes an API request to this endpoint with an empty body
        const scheduleJobs: Resource[] = getScheduledJobs();
        console.log(scheduleJobs.length);
        console.log('cron sees schedule array length');
        if (scheduleJobs.length > 0) {
            try {
                loopThroughScheduledJobs(scheduleJobs);
                
            } catch (error) {
                if (error instanceof CustomError) {
                    console.log('catching the error in schedule-task');
                    
                    return NextResponse.json({message: error.message}, {status: error.statusCode});
                } 
                return NextResponse.json({ message: 'Unknown error in task processing' }, { status: 500 });
            }
        }
        return NextResponse.json({ availabity: newResources, message: 'Task ran with latest job'}, {status: 200 });
    } catch (error) {
        console.error(error);
        //We want to have the same error structure as the frontend on the backend and return it.
        if (error instanceof CustomError) {
            return new NextResponse( JSON.stringify({ error: error.message, status: error.statusCode}), {status: error.statusCode});
        }
        if (error instanceof z.ZodError) {
            // error.issues contains validation errors for each field
            const fieldErrors : ErrorMessage[] = error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }));
            return new NextResponse(JSON.stringify({fieldErrors: fieldErrors}), {status: 400});
        }
        return NextResponse.json({error: 'There was an internal error. Try again later'} , {status: 500})
    }
}