'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';

import Message, { InputMessage } from '@/components/InputMessage';
import {
  validateUsername,
  validateEmail,
  validatePassword
} from '@/lib/validate';
import { addSnackbar } from '@/components/Snackbar';
import { default as api } from '@/lib/api';
import { setLoggedIn } from '@/app/body';

import {
  getUsernameMessage,
  getEmailMessage,
  getPasswordMessage
} from '../messages';

export default function SignUp() {
  interface InputMessages {
    username: InputMessage;
    email: InputMessage;
    password: InputMessage;
  }

  const defaultMessage: InputMessage = { message: '', color: 'default' };

  const [inputs, setInputs] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [inputMsgs, setInputMsgs] = useState<InputMessages>({
    email: defaultMessage,
    username: defaultMessage,
    password: defaultMessage
  });
  const router = useRouter();

  function handleUsernameInput(input: string) {
    setInputs({ ...inputs, username: input });
    setInputMsgs({ ...inputMsgs, username: getUsernameMessage(input) });
  }

  function handleEmailInput(input: string) {
    setInputs({ ...inputs, email: input });
    setInputMsgs({ ...inputMsgs, email: getEmailMessage(input) });
  }

  function handlePasswordInput(input: string) {
    setInputs({ ...inputs, password: input });
    setInputMsgs({ ...inputMsgs, password: getPasswordMessage(input) });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !validateUsername(inputs.username) ||
      !validateEmail(inputs.email) ||
      !validatePassword(inputs.password).valid
    ) {
      /* Ensure inputs that have never received input still get the appropriate error message */
      const messages = {
        username: getUsernameMessage(inputs.username),
        email: getEmailMessage(inputs.email),
        password: getPasswordMessage(inputs.password)
      };

      setInputMsgs(messages);

      return;
    }

    api
      .post('/user', inputs)
      .then(() => {
        api
          .post('/session', {
            username: inputs.username,
            password: inputs.password
          })
          .then(() => {
            setLoggedIn();
            router.replace('/list');
          })
          .catch(err => {
            addSnackbar(err.message, 'error');
          });
      })
      .catch(err => {
        addSnackbar(err.message, 'error');
      });
  }

  return (
    <form aria-label='Sign-Up Form' onSubmit={handleSubmit}>
      <Input
        color={inputMsgs.username.color}
        description={<Message data={inputMsgs.username} />}
        label='Username'
        type='text'
        value={inputs.username}
        variant='underlined'
        onValueChange={handleUsernameInput}
      />
      <Input
        color={inputMsgs.email.color}
        description={<Message data={inputMsgs.email} />}
        label='Email'
        type='email'
        value={inputs.email}
        variant='underlined'
        onValueChange={handleEmailInput}
      />
      <Input
        color={inputMsgs.password.color}
        description={<Message data={inputMsgs.password} />}
        label='Password'
        type='password'
        value={inputs.password}
        variant='underlined'
        onValueChange={handlePasswordInput}
      />
      <div className='flex justify-center mt-6'>
        <Button color='primary' type='submit'>
          Sign Up
        </Button>
      </div>
    </form>
  );
}
