'use client';

import { Button, Input } from '@nextui-org/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { addSnackbar } from '@/components/Snackbar';
import { default as api } from '@/lib/api';
import { setLoggedIn } from '@/app/body';

export default function SignIn() {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const router = useRouter();

  function handleUsernameInput(input: string) {
    setInputs({ ...inputs, username: input });
  }

  function handlePasswordInput(input: string) {
    setInputs({ ...inputs, password: input });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api
      .post('/session', inputs)
      .then(() => {
        setLoggedIn();
        router.replace('/list');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label='Username'
        type='text'
        value={inputs.username}
        variant='underlined'
        onValueChange={handleUsernameInput}
      />
      <Input
        label='Password'
        type='password'
        value={inputs.password}
        variant='underlined'
        onValueChange={handlePasswordInput}
      />
      <div className='flex justify-center mt-6'>
        <Button color='primary' type='submit'>
          Sign In
        </Button>
      </div>
    </form>
  );
}
