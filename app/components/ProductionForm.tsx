'use client';

import React, {  useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { TimeSlot, Table } from './types';
import { createColumnHelper, flexRender, getCoreRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Table>();


const ProductionForm = () => {

    const [time, setTime] = useState<TimeSlot>({ start: "", end: "", resource: ""});
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [availabitySlot, setAvailabitySlot] = useState<Table[]>([]);
    const [data, setData] = React.useState<Table[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [cellSelection, setCellSelection]= useState(null);
    
    const columns = [
    
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('status', {
            cell: ({cell, row}) => {
                return <div><strong>{row.original.status}</strong></div>
            }
        }),
    ]

    useEffect( () => {
        //When availabitySlot array exists, then map through it to get each object. We want the object because the data variable from tanstacktable expects an array of objects
      if (availabitySlot) {
        const updatedTable = availabitySlot.map( job => job);
        setData(updatedTable);
      }
    },[availabitySlot]); //Each time there is a change to this array, re run it. This is updating the table we see
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const timeSlot: TimeSlot= {
            start: time.start,
            end: time.end,
            resource: time.resource
        }
        try {
            const response = await fetch('/api/schedule-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(timeSlot),
            });            
            const data = await response.json();
            setTimeSlot(data.slot);
            setAvailabitySlot(data.availabity);
        } catch (error) {
            console.log(error);
        }
    }
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
    const selectCell = async (cell: any) => {
        
        setCellSelection(cell);
        if (cell === "pending") {
            alert('allow editing');

        } else {
            return;
        }
        
    }

    const table = useReactTable({
        columns,
        data,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
        enableMultiRowSelection: false,
        getRowId: row => row.id,
        
        getCoreRowModel: getCoreRowModel(),
    })

  return (
    <div>
        <Form onSubmit={handleSubmit} >
            <Form.Select name='start' onChange={handleChange} aria-label="Default select example">
                <option>Start Time</option>
                <option value="08:00">8:00am</option>
                <option value="09:00">9:00am</option>
                <option value="10:00">10:00am</option>
                <option value="11:00">11:00am</option>
                <option value="12:00">12:00pm</option>
                <option value="13:00">1:00pm</option>
            </Form.Select>
            <Form.Select name='end' onChange={handleChange} aria-label="Default select example">
                <option>End Time</option>
                <option value="09:00">9:00am</option>
                <option value="10:00">10:00am</option>
                <option value="11:00">11:00am</option>
                <option value="12:00">12:00pm</option>
                <option value="13:00">1:00pm</option>
                <option value="14:00">2:00pm</option>
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
       
        <table>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => {
    return (
        <tr key={row.id}>
            {row.getVisibleCells().map(cell => {
            
            return <td key={cell.id} className={`${cellSelection ? 'tw-bg-black' : 'null'}`} onClick={() =>  selectCell(cell.getValue())} >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            
            })}
        </tr>
        )
        })}
            </tbody>
        </table>
        <h1>cell value</h1>
        <h1>{cellSelection}</h1>
    </div>
  )
}


export default ProductionForm;
