import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import type { Resource } from "./types";

const newResources: Resource[] = [
    {name: "CNC Machine 1", status: "Available"},
    {name: "Assembly Line A", status: "Available"},
    {name: "Assembly Line B", status: "Available"},
    {name: "Assembly Line C", status: "Available"}
]

const columnHelper = createColumnHelper<Resource>();

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
        
        cell: info => info.getValue(),
    })
]

const Table = () => {
    const [data, setData] = useState(() => [...newResources]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
    <div>
        <table>
            <thead>
                {table.getHeaderGroups().map(headersGroup => (
                    <tr key={headersGroup.id}>
                        {headersGroup.headers.map( header => (
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
                { table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row._getAllVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell,
                                cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default Table;
 


