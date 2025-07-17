'use client';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { TimeJobSlot, ErrorMessage } from './types';
import { useAppContext, useSlotContext } from '../context';
import * as z from "zod/v4"
import slots from './dataslots';

const ProductionForm = () => {

    const cellID = z.object({
        row: z.string(),
        column: z.string()
    })

    const userSelection = z.object({
        id: cellID,
        timeslot: z.string().min(1,'Please select timeSlot'),
        resource: z.string().min(1, 'Please choose a job'),
    });

    const { data, setData } = useAppContext();
    const [timeJob, setTimeJob] = useState<TimeJobSlot>({id: {row: '', column: ''}, timeslot: "",  resource: ""});
    const {dataSlot, setDataSlot} = useSlotContext();
    const [errors, setErrors]= useState<ErrorMessage[]>([]);
    const [errorStatus, setErrorStatus]= useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //Prevent the default behavior which is a automatic refresh when the form is submitted
        event.preventDefault();
        //We want to take the shape of TimeSlot that we set in the types.ts file and plug in the values from the form
       
        try {
            setErrors([]);
            console.log('access the cell data^^^');
            

            const timeSlot: TimeJobSlot= userSelection.parse({id: timeJob.id, timeslot: timeJob.timeslot, resource: timeJob.resource});
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
                if (response.status === 404 || errorResponse.fieldErrors) {
                    setErrors(errorResponse.fieldErrors);
                } else {
                    setErrorStatus('error');
                }
                return;
            } 
           //If everything passes, grab the json object and push the data to the context with created. That way we can share the data with any component in the application. In this case, the Table component      
            const data = await response.json();
            setData(data.availabity);
            
        } catch (error) {
            console.log(error);
            
            if (error instanceof z.ZodError) {
                const fieldErrors : ErrorMessage[] = error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                setErrors(fieldErrors);
            } else {
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
                [name]: value
            }
        });
    }

    useEffect(() => {
        if (dataSlot) {
            setTimeJob({
            id: dataSlot.id,
            timeslot: dataSlot.time,
            resource: dataSlot.name
          });
        }
      }, [dataSlot]);

  return (
    <div>
        
        {errorStatus === 'error' &&
        <div className='tw-text-red-500'>
            <p>There was an internal error. Try again later</p>
        </div>
        }
        <Form onSubmit={handleSubmit}>
            <Form.Select name='timeslot' onChange={handleChange} value={timeJob.timeslot}>
                <option value="">Choose time slot</option>
                {slots.map((slot, index) => {
                    return(
                        <div key={index}>
                            <option value={slot.slot}>{slot.slot}</option>
                        </div>
                    )
                })}
            </Form.Select>
            {errors.find(err => err.field ==='timeslot') && (
                <div className='tw-text-red-500'>
                    {errors.find(err => err.field === 'timeslot')?.message}
                </div>
            )}
           
            <Form.Select name='resource' onChange={handleChange} value={timeJob.resource} >
                <option value="">Choose job</option>
                <option value="CNC Machine 1">CNC Machine 1</option>
                <option value="Assembly Line A">Assembly Line A</option>
                <option value="Assembly Line B">Assembly Line B</option>
                <option value="Assembly Line C">Assembly Line C</option>
            </Form.Select>
            {errors.find(err => err.field === 'resource' ) && (
                <div className='tw-text-red-500'>
                    {errors.find(err => err.field === 'resource')?.message}
                </div>
            )}
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    </div>
  )
}

export default ProductionForm;

/*
             <option value="08:42-08:45">14:56-14:59</option>
                <option value="24:45-24:47">15:12-15:13</option>
                <option value="24:47-24:49">15:14-15:15</option>
*/