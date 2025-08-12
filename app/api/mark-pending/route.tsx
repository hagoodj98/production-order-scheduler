import { NextRequest, NextResponse } from "next/server";
import { CustomError } from '@/utils/CustomErrors';
import * as z from 'zod/v4';
import type { TimeJobSlot, ErrorMessage } from "@/app/components/types";
import { addPendingJobToArrays, getPendingJobs } from "@/utils/route";
import slots from "@/app/components/dataslots";

//validating data before use
const cellID = z.object({
    row: z.string(),
    column: z.string()
  });
  const startEndTime = z.object({
    start: z.string().min(1,'Please select start time'),
    end: z.string().min(1,'Please select end time')
})
const userSelection = z.object({
    id: cellID,
    timeslot: startEndTime,
    resource: z.string().min(1, 'Please choose a job'),
});

//This handler takes care of the pending state. This route is only called when the data is valid.
export async function POST(req: NextRequest) {
    
    try {
        if (!req) {
            throw new CustomError('Missing input information', 404);
        }
        const raw = await req.json();
        
        //The object.key is a safe guard to make sure there is at least one 
        if (Object.keys(raw['timeSlot']).length > 0) {
            const validData = await userSelection.parseAsync(raw['timeSlot']);
            const body: TimeJobSlot = validData;
             /**
             * What the simple payload looks like
             * {
                    id: { row: '1', column: '14:52-14:53' },
                    timeslot: { start: '14:52', end: '14:53' },
                    resource: 'Assembly Line B'
                }
             */
            if (body?.id && body?.timeslot && body?.resource) {
                const { start, end } = body.timeslot
                const slotFound = slots.find(slot => slot.slot.start === start && slot.slot.end === end);
                if (!(slotFound === undefined)) {
                     //The addPendingJob function passes in the payload and simply pushes it to an array if it does not exist.
                    addPendingJobToArrays(body);
                } 
            }
        }

        return NextResponse.json({ pending: getPendingJobs()});
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
              );
        }
        if (error instanceof z.ZodError) {
            // error.issues contains validation errors for each field
            const fieldErrors : ErrorMessage[] = error.issues.map(issue => ({
                field: issue.path.join(''),
                message: issue.message
            }));
            return new NextResponse(JSON.stringify({fieldErrors: fieldErrors}), {status: 400});
        }
        return NextResponse.json({error: 'There was an internal error. Try again later'} , {status: 500})
    }
}