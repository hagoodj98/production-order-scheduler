import { useState } from 'react'
import { Table } from './types';
import { Column } from '@tanstack/react-table'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type DropDownFilteringProps = {
    column: Column<Table, unknown>;
}

const DropDownFiltering = ({ column }: DropDownFilteringProps) => {
    const filterValue = column.getFilterValue();
  
  return (
    <FormControl  sx={{ width:100, margin: 'auto', marginTop: 1, marginBottom: 1 }}>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={filterValue as string || ''}
        sx={{height:15}}
        onChange={(e) => {
          console.log(e);
          
          const value = e.target.value;
          column.setFilterValue(value === '' ? undefined : value);
      }}
    
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        <MenuItem value={'Scheduled'}>Scheduled</MenuItem>
      </Select>
  </FormControl>
     
  )
}

export default DropDownFiltering;
