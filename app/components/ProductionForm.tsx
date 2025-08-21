'use client';

import { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import Form from 'react-bootstrap/Form';
import type { TimeJobSlot, ErrorMessage, FormErrors } from './types';
import { useAppContext, useSlotContext } from '../context';
import * as z from "zod/v4";
import { useRouter } from "next/navigation";
import slots from './dataslots';
import Link from 'next/link';
import { CustomError } from '@/utils/CustomErrors';

const ProductionForm = () => {

    const cellID = z.object({
        row: z.string(),
        column: z.string()
    });
    const startEndTime = z.object({
        start: z.string().min(1,'Please select start time'),
        end: z.string().min(1,'Please select end time')
    });
    const userSelection = z.object({
        id: cellID,
        timeslot: startEndTime,
        resource: z.string().min(1, 'Please choose a job'),
    });
    const router = useRouter();
    const { setData } = useAppContext();
    const [timeJob, setTimeJob] = useState<TimeJobSlot>(
        {
            id: {
                row: '', 
                column: ''
            }, 
            timeslot: {
                start: '',
                end: ''
            },
            resource: ""
        });
    const { dataSlot } = useSlotContext();
    const [ errors, setErrors ]= useState<FormErrors>([]);
    const [ errorStatus, setErrorStatus ]= useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //Prevent the default behavior which is a automatic refresh when the form is submitted
        event.preventDefault();
     
        //We want to take the shape of TimeSlot that we set in the types.ts file and plug in the values from the form
        try {
            setErrors([]);
            const timeSlot: TimeJobSlot= userSelection.parse({id: dataSlot.id, timeslot: timeJob.timeslot, resource: timeJob.resource });
      
            //making an api call to process the data from form
            const response = await fetch('/api/schedule-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(timeSlot), 
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                console.log(errorResponse);
                if (errorResponse.fieldErrors) {
                    setErrors(errorResponse.fieldErrors);
                } else if (errorResponse.error && errorResponse.status) {
                    setErrors({
                        message: errorResponse.error,
                        status: errorResponse.status
                    });
                } else {
                    setErrorStatus('error');
                }
                return;
            } 
            //If everything passes, grab the json object and push the data to the context with created. That way we can share the data with any component in the application. In this case, the Table component      
            const data = await response.json();
            setData(data.availabity);
            router.push('/available-slots');
        } catch (error) {
            console.log(error);
            if (error instanceof z.ZodError) {
                console.log(error.issues);
                const fieldErrors : ErrorMessage[] = error.issues.map(issue => (
                    {
                        field: issue.path.join(""),
                        message: issue.message
                    }
                ));
                setErrors(fieldErrors);
                return;
            } 
            if (error instanceof CustomError) {
                const customError: CustomError = error;
                setErrors(
                    {
                        message:customError.message,
                        status: customError.statusCode
                    }); // you're already using FormErrors union type
                return;
            }
            
            else {
                setErrorStatus('error');
              }
        }
    }
    //This function happens if there was a change made to the form. If user decides to make any changes, keep the previous value and change the field being changed(Lines 60-65).
    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value}= event.target;
        console.log(name,value);
        setTimeJob(prevValue => {
            return {
                ...prevValue,
                timeslot: {
                    ...prevValue.timeslot,
                    [name]: value
                },
                [name]: value
            }
        });
    }
    //This block depends on any changes made to timeJob. 
    useEffect(() => {
        //I want to share the current state of each field so i can have access to the value in the Table component. That way I can compare values and determine when to change status to Pending instead of changing the status to Pending just by clicking the cell.
        console.log('watching change');
        console.log(dataSlot.id);
    //If both fields aren't empty, make sure they are valid before hitting the mark-pending endpoint, which handles changes cells to Pending without submitting form
        if (timeJob.timeslot.start !== "" && timeJob.timeslot.end !== "" && timeJob.resource !== "") {
        
            const timeSlot: TimeJobSlot = userSelection.parse({id: dataSlot.id, timeslot: timeJob.timeslot, resource: timeJob.resource});

            const sendPendingStatus = async () => {
                try {
                    const response = await fetch('/api/mark-pending', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({timeSlot}),
                    });
                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.log(errorResponse);
                        if (errorResponse.fieldErrors) {
                            setErrors(errorResponse.fieldErrors);
                        } else if (errorResponse.error) {
                            setErrors({
                                message: errorResponse.error,
                                status: errorResponse.status
                            });
                        } else {
                            setErrorStatus('error');
                        }
                        return;
                    } 
                } catch (error) {
                    console.error('Network error marking pending:', error);
                    if (error instanceof z.ZodError) {
                        const fieldErrors : ErrorMessage[] = error.issues.map(issue => ({
                            field: issue.path.join('.'),
                            message: issue.message
                        }));
                        setErrors(fieldErrors);
                    } 
                    if (error instanceof CustomError) {
                        const customError: CustomError = error;
                        setErrors({
                            message:customError.message,
                            status: customError.statusCode
                        }); // you're already using FormErrors union type
                        return;
                    }
                }
            };
            sendPendingStatus();
        }
    },[timeJob]);
//This prefills the fields based on what the user inputed last without submitting
    useEffect(() => {
        if (dataSlot?.name !== "" && dataSlot?.timeslot.start !== "" && dataSlot?.timeslot.end !== "") {
            setTimeJob({
                id: {
                    row: dataSlot.id.row,
                    column: dataSlot.id.column,
                },
                timeslot: {
                    start: dataSlot.timeslot.start, 
                    end: dataSlot.timeslot.end
                }, //dataSlot.time
                resource: dataSlot.name
            })
        }
    },[dataSlot]);

  return (
    <div className='tw-flex tw-flex-col tw-justify-evenly'>
        {errorStatus === 'error' &&
            <div className='tw-text-red-500'>
                <p>There was an internal error. Try again later</p>
            </div>
        }
        {!Array.isArray(errors) && errors?.message && (
            <div className="tw-text-red-500 tw-text-base tw-text-center tw-mt-10">
                {errors.message}
            </div>
        )}
        <div className=' tw-mt-28'>
            <div>
                <h2 className='tw-text-center tw-text-[#FFBB28]'>Choose a job</h2>
            </div>
            <Form className='tw-mx-auto tw-w-1/2 ' onSubmit={handleSubmit}>
                <Form.Select name='start' onChange={handleChange} value={timeJob.timeslot.start}>
                    <option value="">Start Time?</option>
                    {slots.map((slotObj, index) => {
                        return(
                            <option key={index} value={slotObj.slot.start}>{slotObj.slot.start}</option>
                        );
                    })}
                </Form.Select>
                {Array.isArray(errors) && errors.find(err => err.field === 'timeslotstart') && (
                    <div className='tw-text-red-500 tw-text-sm'>
                        {errors.find(err => err.field === 'timeslotstart')?.message}
                    </div>
                )}
                <Form.Select name='end' onChange={handleChange} value={timeJob.timeslot.end}>
                    <option value="">End Time?</option>
                    {slots.map((slotObj, index) => {
                        return(
                            <option key={index} value={slotObj.slot.end}>{slotObj.slot.end}</option>
                        );
                    })}
                </Form.Select>
                {Array.isArray(errors) && errors.find(err => err.field ==='timeslotend') && (
                    <div className='tw-text-red-500 tw-text-sm'>
                        {errors.find(err => err.field === 'timeslotend')?.message}
                    </div>
                )}
                <Form.Select name='resource' onChange={handleChange} value={timeJob.resource} >
                    <option value="" className='tw-text-stone-400'>Choose resource</option>
                    <option value="CNC Machine 1">CNC Machine 1</option>
                    <option value="Assembly Line A">Assembly Line A</option>
                    <option value="Assembly Line B">Assembly Line B</option>
                    <option value="Assembly Line C">Assembly Line C</option>
                </Form.Select>
                {Array.isArray(errors) && errors.find(err => err.field ==='resource') && (
                    <div className='tw-text-red-500 tw-text-sm'>
                        {errors.find(err => err.field === 'resource')?.message}
                    </div>
                )}
                <Button type="submit"  sx={{margin: 'auto', width: '100%', marginTop: 3 }} variant="contained" size='small' >Submit</Button>
            </Form>
        </div>
        <div className='tw-mx-auto tw-mt-28'>
            <Link href="/available-slots"><Button  size='small'  variant="contained">View Orders</Button></Link>
        </div>
    </div>
  )
}

export default ProductionForm;
