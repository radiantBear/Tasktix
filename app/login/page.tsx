'use client';

import React from 'react';
import { Card, CardBody, Tabs, Tab } from '@nextui-org/react';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

export default function Page() {
  return (
    <main className='flex justify-center items-start mt-40'>
      <Card className='w-96 py-2 px-4'>
        <CardBody>
          <Tabs variant='underlined' className='flex justify-center'>
            <Tab key='login' title='Log In' className='text-xl'>
              <LogIn />
            </Tab>
            <Tab key='signUp' title='Sign Up' className='text-xl'>
              <SignUp />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </main>
  );
}