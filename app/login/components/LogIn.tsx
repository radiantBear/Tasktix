'use client';

import { login } from '@/lib/actions/user/login';
import Message, { InputMessage } from '@/components/input_message';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';

export default function LogIn() {
  interface InputMessages {
    username: InputMessage;
    password: InputMessage;
  }

  const defaultMessage: InputMessage = {message: '', color: 'default'};

  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [inputMsgs, setInputMsgs] = useState<InputMessages>({ username: defaultMessage, password: defaultMessage });

  function handleUsernameInput(input: string) {
    setInputs({...inputs, username: input})
  }
  
  function handlePasswordInput(input: string) {
    setInputs({...inputs, password: input});
  }

	function handleSubmit() {
    login(inputs.username, inputs.password);
  }

  return (
    <form>
      <Input 
        label='Username' 
        value={inputs.username}
        color={inputMsgs.username.color}
        description={<Message data={inputMsgs.username} />}
        onValueChange={handleUsernameInput}
        type='text'
        variant='underlined'
      />
      <Input 
        label='Password' 
        value={inputs.password}
        color={inputMsgs.password.color}
        description={<Message data={inputMsgs.password} />}
        onValueChange={handlePasswordInput}
        type='password' 
        variant='underlined'
      />
      <div className='flex justify-center mt-6'>
        <Button color='primary' onPress={handleSubmit} >Log In</Button>
      </div>
    </form>
	);
}