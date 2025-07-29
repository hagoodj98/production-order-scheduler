'use client';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { TimeJobSlot, ErrorMessage, Slot } from './types';
import { useAppContext, useSlotContext } from '../context';
import * as z from "zod/v4"
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const { data, setData } = useAppContext();
    const [timeJob, setTimeJob] = useState<TimeJobSlot>({id: {row: '', column: ''}, timeslot: "",  resource: ""});
    const {dataSlot, setDataSlot, cellSlotArray, setCellSlotArray} = useSlotContext();
    const [errors, setErrors]= useState<ErrorMessage[]>([]);
    const [errorStatus, setErrorStatus]= useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //Prevent the default behavior which is a automatic refresh when the form is submitted
        event.preventDefault();
        //We want to take the shape of TimeSlot that we set in the types.ts file and plug in the values from the form
        try {
            setErrors([]);
            console.log('access the cell data^^^');

            const timeSlot: TimeJobSlot= userSelection.parse({id: dataSlot.id, timeslot: timeJob.timeslot, resource: timeJob.resource});
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
            router.push('/');
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
//This block depends on any changes made to timeJob. 
useEffect(() => {
    //I want to share the current state of each field so i can have access to the value in the Table component. That way I can compare values and determine when to change status to Pending instead of changing the status to Pending just by clicking the cell.
    console.log('watching change');
    console.log(dataSlot.id);
   
   //If both fields aren't empty, make sure they are valid before hitting the mark-pending endpoint, which handles changes cells to Pending without submitting form
    if (timeJob.timeslot !== "" && timeJob.resource !== "") {
        const timeSlot: TimeJobSlot = userSelection.parse({id: dataSlot.id, timeslot: timeJob.timeslot, resource: timeJob.resource});
        //In order to be able to go into a pending cell with its previous entries, I created an array containing the cell id, resource name and timeslot. If the cell already exist in the array simply dont add it but instead update the existing cells' properties. That way we can go into any cell and see our last input before deciding to submit the job.
        const cellSlotAlreadyExist = cellSlotArray.some((cellField) => 
            cellField.id.row === dataSlot.id.row &&
            cellField.id.column === dataSlot.id.column 
        );
        console.log(cellSlotAlreadyExist);
        if (!cellSlotAlreadyExist) {
            setCellSlotArray(prev => [
                ...prev,
                timeSlot
            ]); 
        } else {
            const editExistingPendingJob = cellSlotArray.findIndex(pendingJob => pendingJob.id.row === timeSlot.id.row && pendingJob.id.column === timeSlot.id.column);
            if (editExistingPendingJob !== -1) {
                cellSlotArray[editExistingPendingJob].resource = timeSlot.resource;
                cellSlotArray[editExistingPendingJob].timeslot = timeSlot.timeslot;
            }
        }
        const sendPendingStatus = async () => {
            try {
                const response = await fetch('/api/mark-pending', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(timeSlot),
                });
                if (!response.ok) {
                    console.error('Failed to mark pending');
                } else {
                    console.log('Marked slot as Pending on backend');
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
            }
        };
        sendPendingStatus();
    }
   
},[timeJob])

useEffect(() => {
    if (dataSlot?.name !== "" && dataSlot?.time !== "") {
        setTimeJob({
            id: {
                row: dataSlot.id.row,
                column: dataSlot.id.column,
            },
            timeslot: dataSlot.time,
            resource: dataSlot.name
        })
    }
},[dataSlot]);

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
                        <option key={index} value={slot.slot}>{slot.slot}</option>
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
