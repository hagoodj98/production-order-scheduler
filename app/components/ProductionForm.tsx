'use client';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { TimeSlot } from './types';
import { useAppContext, useSlotContext } from '../context';

const ProductionForm = () => {

    const { data, setData } = useAppContext();
    const [time, setTime] = useState<TimeSlot>({ timeslot: "",  resource: ""});
    const {dataSlot, setDataSlot} = useSlotContext();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //Prevent the default behavior which is a automatic refresh when the form is submitted
        event.preventDefault();
        //We want to take the shape of TimeSlot that we set in the types.ts file and plug in the values from the form
        const timeSlot: TimeSlot= {
            timeslot: time.timeslot,
            resource: time.resource
        }
        //making an api call to process the data from form
        try {
            const response = await fetch('/api/schedule-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(timeSlot),
            });
            //If everything passes, grab the json object and push the data to the context with created. That way we can share the data with any component in the application. In this case, the Table component       
            const data = await response.json();
            setData(data.availabity);
            
        } catch (error) {
            console.log(error);
        }
    }

    //This function happens if there was a change made to the form. If user decides to make any changes, keep the previous value and change the field being changed(Lines 60-65).
    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value}= event.target;
        console.log(name,value);
        setTime(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    useEffect(() => {
        if (dataSlot) {
          setTime({
            timeslot: dataSlot.time,
            resource: dataSlot.name
          });
        }
      }, [dataSlot]);

  return (
    <div>
        <Form onSubmit={handleSubmit}>
            <Form.Select name='timeslot' onChange={handleChange} value={time.timeslot}>
                <option>Choose time slot</option>
                <option value="12:13-12:15">14:56-14:59</option>
                <option value="12:14-12:17">15:12-15:13</option>
                <option value="12:15-12:19">15:14-15:15</option>

            </Form.Select>
           
            <Form.Select name='resource' onChange={handleChange} value={time.resource} >
                <option>Choose job</option>
                <option value="CNC Machine 1">CNC Machine 1</option>
                <option value="Assembly Line A">Assembly Line A</option>
                <option value="Assembly Line B">Assembly Line B</option>
                <option value="Assembly Line C">Assembly Line C</option>
            </Form.Select>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    </div>
  )
}


export default ProductionForm;
