'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { Cell } from "@tanstack/react-table";
import React, { useState } from 'react';
import type {Table } from "./types";
import { useAppContext } from "../context";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<Table>();

const Table = () => {
    const router = useRouter();
    const [cellSelection, setCellSelection]= useState(null);
    const {data} = useAppContext();
//According to the Tanstack Table docs, this is how we want to define our columns
    const columns = [
//Each accessor is a column name
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('08:00-09:00', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('09:00-10:00', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('10:00-11:00', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('11:00-12:00', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('12:00-13:00', {
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('13:00-14:00', {
            cell: info => info.getValue(),
        }),
       
       /* columnHelper.accessor('status', {
            cell: ({row}) => {
                return <div><strong>{row.original.status}</strong></div>
            }
        }),
        */
    ]
//According to tanstack, this is how we define our table
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    })
//This function executes when a user clicks on any cell that has a value of "pending". If true, then allow editing, if not, do not.
    const selectCell = async (cell: Cell<Table, unknown>) => {
        
        //setCellSelection(cell);
        if (cell.getValue() === "pending") {
            router.push('/assign-resource');
        } else {
            return;
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
            
            return <td key={cell.id} className={`${cellSelection ? 'tw-bg-black' : 'null'}`} onClick={() =>  selectCell(cell)} >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            
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
 


