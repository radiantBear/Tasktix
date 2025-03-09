'use client';

import React from 'react';
import { Card, CardBody, Tabs, Tab } from '@nextui-org/react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

export default function Page() {
  return (
    <main className='flex justify-center items-start mt-40'>
      <Card className='w-96 py-2 px-4'>
        <CardBody>
          <Tabs variant='underlined' className='flex justify-center'>
            <Tab key='signIn' title='Sign In' className='text-xl'>
              <SignIn />
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
