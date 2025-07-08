import { createColumnHelper, flexRender, getCoreRowModel, RowSelectionState, useReactTable } from "@tanstack/react-table";
import Table from "./components/Table";
import Link from "next/link";


export default function Home () {
  
  return (

    <div>
      <h1>Hello world</h1>
      <Table />
    </div>
  );
}
