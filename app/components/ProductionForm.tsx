'use client';

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { TimeSlot } from './types';
import { useAppContext } from '../context';

const ProductionForm = () => {

    const { data, setData } = useAppContext();
    const [time, setTime] = useState<TimeSlot>({ timeslot: "",  resource: ""});
    
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

  return (
    <div>
        <Form onSubmit={handleSubmit} >
            <Form.Select name='timeslot' onChange={handleChange} aria-label="Default select example">
                <option>Choose time slot</option>
                <option value="08:00-09:00">8:00am-9:00am</option>
                <option value="09:00-10:00">9:00am-10:00am</option>
                <option value="10:00-11:00">11:00am-11:00am</option>
                <option value="11:00-12:00">11:00am-12:00pm</option>
                <option value="12:00-13:00">12:00pm-1:00pm</option>
                <option value="13:00-14:00">1:00pm-2:00pm</option>
            </Form.Select>
           
            <Form.Select name='resource' onChange={handleChange} aria-label="Default select example">
                <option>Choose Resource</option>
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
