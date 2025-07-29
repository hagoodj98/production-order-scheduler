'use client';

import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import type { Cell } from "@tanstack/react-table";
import React, { useEffect, useState } from 'react';
import type {Table, ColumnFiltersState, Slot } from "./types";
import { useAppContext, useSlotContext } from "../context";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { newResources } from "./Resources";
import slots from "./dataslots";
import DropDownFiltering from "./DropDownFiltering";
import * as z from "zod/v4"
import { time } from "console";


const userSelection = z.object({
    timeslot: z.string().min(1,'Please select timeSlot'),
    resource: z.string().min(1, 'Please choose a job'),
});

const columnHelper = createColumnHelper<Table>();

const Table = () => {
   
    const {dataSlot, setDataSlot, cellSlotArray} = useSlotContext();
    const router = useRouter();
    const fetcher =  async (url: string) => {
        const res = await fetch(url);
        return await res.json();
    }
    const { data: fetchedData } = useSWR('/api/poll-resource', fetcher, {
        refreshInterval: 5000, // poll every 5 seconds
      });
   
    const [cellSelection, setCellSelection]= useState(false);
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
  
//According to the Tanstack Table docs, this is how we want to define our columns
    const columns = [
//Each accessor is a column name
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
        }),
        ...slots.map((slot) => {
            return columnHelper.accessor(slot.slot, {
                cell: info => info.getValue(),
                filterFn: (row,columnId, filterValue) => {
                    return row.getValue(columnId) === filterValue;
                },
               
            });
        }),
    ];
//According to tanstack, this is how we define our table
    const table = useReactTable({
        columns,
        data: fetchedData?.availability ?? newResources,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
    });
//This function executes when a user clicks on any cell that has a value of "pending". If true, then allow editing, if not, do not.
    const selectCell = async (cell: Cell<Table, unknown>) => {
        
        try {
            if (cell.getValue() === "Pending" || cell.getValue() === "Available") {
                setCellSelection(true);
                //console.log('NAVIGATING TO /assign-resource'); // Add this
               // console.log('cell.getValue()', cell.getValue()); // to confirm it's "Pending"
                router.push('/assign-resource');
            } else {
                alert('Cannot edit a scheduled time');
                return;
            }
            
            const cellID = {
                row: cell.row.id,
                column: cell.column.id
            }
            console.log(cellSlotArray);
            console.log('whats currently in cellSlotArray from Table component');
            //If there is a pending cell while its' properties are filled, then find that job in the array and grab its cell id, resource and time. resource and time are what i use to prefill the fields in the select options form. If a cell is not found, then that means there was no selection for that cell. So we redeclare cellInfo and set its properties to empty cause the user has not set them yet.
            const pendingData = cellSlotArray.find( cellSlot => cellSlot.id.row === cellID.row && cellSlot.id.column === cellID.column);
            if (pendingData !== undefined) {
                const cellInfo = {
                    id: cellID,
                    name: pendingData.resource,
                    time: pendingData.timeslot
                }
                //This would be used if I wanted to prefill the form if user wanted to edit a pending job. But what we are interested in is the row and column for marking cells for Pending. We want to the user to provide valid field data for the rest.
                setDataSlot(cellInfo);
            } else {
                const cellInfo = {
                    id: cellID,
                    name: "",
                    time: ""
                }
                setDataSlot(cellInfo);
            }
        } catch (error) {
            console.error('There was an error processing the input',error);
        }
    }
    return (
    <div>
        <table>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : (
                                  <>
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {header.column.getCanFilter() && (
                                      <DropDownFiltering column={header.column} />
                                    )}
                                  </>
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
                               
                            return <td key={cell.id} data-testid={`cell-${cell.id.replace(/:/g, '-')}`} className={cell.getValue() === "Pending" || cell.getValue() === "Available" ? 'tw-cursor-pointer hover:tw-bg-orange-400' : '' } onClick={() => selectCell(cell)}>
                                
                            {
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                            }
                        </td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
    )
}

export default Table;
