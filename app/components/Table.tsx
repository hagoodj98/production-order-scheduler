'use client';

import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import type { Cell } from "@tanstack/react-table";
import React, { useEffect, useState } from 'react';
import type {Table, ColumnFiltersState } from "./types";
import { useAppContext, useSlotContext } from "../context";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { newResources } from "./Resources";
import slots from "./dataslots";
import DropDownFiltering from "./DropDownFiltering";

const columnHelper = createColumnHelper<Table>();

const Table = () => {
    const {dataSlot, setDataSlot} = useSlotContext();
    const router = useRouter();
    const fetcher =  async (url: string) => {
        const res = await fetch(url);
        return await res.json();
    }
    const { data: fetchedData } = useSWR('/api/poll-resource', fetcher, {
        refreshInterval: 5000, // poll every 5 seconds
      });
    const [cellSelection, setCellSelection]= useState(false);
    const { pendingCells, setPendingCells } = useAppContext();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
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
        if (cell.getValue() === "Pending" || cell.getValue() === "Available") {
            setCellSelection(true);
            router.push('/assign-resource');
        } else {
            alert('Cannot edit a scheduled time');
            return;
        }

        
        //setCellSelection(cell);
        console.log('values to push👇🏽');
        
        const cellID = {
            row: cell.row.id,
            column: cell.column.id
        }
        const alreadyExists = pendingCells.some(
            (p) => p.row === cellID.row && p.column === cellID.column
          );

        if (!alreadyExists) {
            setPendingCells( prev => [
                ...prev,
                {
                    row: cellID.row,
                    column: cellID.column,
                }
            ]);
        }
        
        const cellInfo = {
            id: cellID,
            name: cell.row.original.name,
            time: cell.column.id,
        }
        //This would be used if I wanted to prefill the form if user wanted to edit a pending job.
        setDataSlot(cellInfo);
    //This conditional statement controls if user tries to click any of the cells. If avaiable or pending, allow scheduling. Otherwise, don't.
       
    }
    useEffect(() => {
        if (pendingCells.length > 0) {
            localStorage.setItem('pendingCells', JSON.stringify(pendingCells));
        }

    },[pendingCells]);
    useEffect(()=> {
        const saved = localStorage.getItem('pendingCells');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setPendingCells(parsed);
                }
            } catch (error) {
                console.error('Failed to parse pendingCells from localstorage', error);
            }
        }
    },[]);

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
                            return <td key={cell.id} className={cell.getValue() === "Pending" || cell.getValue() === "Available" ? 'tw-cursor-pointer hover:tw-bg-orange-400' : '' } onClick={() => selectCell(cell)}>
                            {
                                pendingCells?.some(p => p.row === cell.row.id && p.column === cell.column.id) ? "Pending" : flexRender(cell.column.columnDef.cell, cell.getContext())
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
 


