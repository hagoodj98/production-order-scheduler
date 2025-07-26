import React from 'react'
import { Table } from './types';
import { Column } from '@tanstack/react-table'

type DropDownFilteringProps = {
    column: Column<Table, unknown>;
}


const DropDownFiltering = ({ column }: DropDownFilteringProps) => {
    const filterValue = column.getFilterValue();
    const options = ['All', 'Scheduled'];

  return (
    
        <select 
            value={filterValue as string || 'All'}
            onChange={(e) => {
                const value = e.target.value;
                column.setFilterValue(value === 'All' ? undefined : value);
            }}
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
  )
}

export default DropDownFiltering;
