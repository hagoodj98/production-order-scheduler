'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';

const NavButton = () => {
  return (
    <div className='tw-flex tw-w-1/3 tw-mx-auto '>
       <Link className='tw-mx-auto' href='/available-slots'><Button  className='tw-border-2'   variant="contained">View Orders</Button></Link>
    </div>
  )
}

export default NavButton
