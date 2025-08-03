import { NextRequest, NextResponse } from 'next/server';
import type {TimeJobSlot, ErrorMessage} from '../../components/types';
import { myTasks } from '@/tasks/MyTasks';
import { CustomError } from '@/utils/CustomErrors';
import { newResources } from '@/app/components/Resources';
import { setLatestJob, getLatestJob } from '@/utils/route'
import * as z from 'zod/v4';

//validating data before use
const cellID = z.object({
    row: z.string(),
    column: z.string()
});
const userSelectionSchema = z.object({
    id: cellID,
    timeslot: z.string().min(1,'Please select timeSlot'),
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
                console.log(body.id);
                const { row, column } = body.id;
                //Save the input so cron can later retrieve it. If data is not saved then timeslot and resource will be undefined from Cron's perspective, because it is sending an empty payload
                setLatestJob({id:{row, column}, timeSlot: body.timeslot, resource: body.resource });
               
                try {
                    // ✅ Actually run the scheduling logic here
                    myTasks(body.timeslot, body.resource, body.id);
                    return NextResponse.json({ availabity: newResources, message: 'Task ran successfully' }, { status: 200 });
                  } catch (err) {
                    if (err instanceof CustomError) {
                          return new NextResponse( JSON.stringify({ error: err.message, status: err.statusCode}), {status: err.statusCode});
                    }
                    return NextResponse.json({ message: 'Unknown error in task processing' }, { status: 500 });
                  }
            }
        }
        // Retrieve and use the most up-to-date job input for cron. Because cron makes an API request to this endpoint with an empty body
        const {id, timeSlot, resource } = getLatestJob();
        if (id && timeSlot && resource) {
            try {
                console.log('🔄 Reusing saved job:', {id, timeSlot, resource });//debugging
                myTasks( timeSlot, resource, id);
            } catch (err) {
                if (err instanceof CustomError) {
                    console.log('catching the error in schedule-task');
                    
                    return NextResponse.json({message: err.message}, {status: err.statusCode});
                } 
                return NextResponse.json({ message: 'Unknown error in task processing' }, { status: 500 });
            }
          
          }
          //console.log(newResources);//Debugging I expect to see what myTasks called
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