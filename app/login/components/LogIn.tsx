'use client';

import { Button, Input } from '@nextui-org/react';

export default function LogIn() {
	return (
    <div>
        <Input 
          label='Username' 
          type='text'
          variant='underlined'
        />
        <Input 
          label='Password'
          type='password' 
          variant='underlined'
          description=''
        />
        <div className='flex justify-center mt-6'>
          <Button color='primary' >Log In</Button>
        </div>
    </div>
	);
}