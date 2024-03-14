'use client';

import { getUsernameMessage, getEmailMessage, getPasswordMessage } from '../messages';
import Message, { InputMessage } from '@/components/input_message';
import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import { register } from '@/lib/actions/register';
import { addSnackbar } from '@/components/snackbar';
import React from 'react';
import { Button, Input } from '@nextui-org/react';

export default function SignUp() {
  interface InputMessages {
    username: InputMessage;
    email: InputMessage;
    password: InputMessage;
  }

  const defaultMessage: InputMessage = {message: '', color: 'default'};

  const [inputs, setInputs] = React.useState({ email: '', username: '', password: '' });
  const [inputMsgs, setInputMsgs] = React.useState<InputMessages>({ email: defaultMessage, username: defaultMessage, password: defaultMessage });

  function handleUsernameInput(input: string) {
    setInputs({...inputs, username: input})
    setInputMsgs({...inputMsgs, username: getUsernameMessage(input)});
  }
  
  function handleEmailInput(input: string) {
    setInputs({...inputs, email: input});
    setInputMsgs({...inputMsgs, email: getEmailMessage(input)});
  }
  
  function handlePasswordInput(input: string) {
    setInputs({...inputs, password: input});
    setInputMsgs({...inputMsgs, password: getPasswordMessage(input)});
  }

  function handleSubmit() {
    if(!validateUsername(inputs.username) || !validateEmail(inputs.email) || !validatePassword(inputs.password).valid) {
      /* Ensure inputs that have never received input still get the appropriate error message */
      const messages = {
        username: getUsernameMessage(inputs.username),
        email: getEmailMessage(inputs.email),
        password: getPasswordMessage(inputs.password)
      };
      setInputMsgs(messages);
      return;
    }

    register(inputs.username, inputs.email, inputs.password)
      .then((res) => {
        addSnackbar(res.message, 'success');
      })
      .catch((err) => {
        addSnackbar(err.message, 'error');
      })
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
          label='Email' 
          value={inputs.email}
          color={inputMsgs.email.color}
          description={<Message data={inputMsgs.email} />}
          onValueChange={handleEmailInput}
          type='email'
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
          <Button color='primary' onPress={handleSubmit}>Sign Up</Button>
        </div>
    </form>
	);
}