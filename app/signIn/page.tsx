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
          <Tabs className='flex justify-center' variant='underlined'>
            <Tab key='signIn' className='text-xl' title='Sign In'>
              <SignIn />
            </Tab>
            <Tab key='signUp' className='text-xl' title='Sign Up'>
              <SignUp />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </main>
  );
}
