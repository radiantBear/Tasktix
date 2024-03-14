'use client';

import React from 'react';
import { Button, Card, CardBody, Input, Tabs, Tab } from '@nextui-org/react';
import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import { addSnackbar } from '@/lib/components/Snackbar';


interface InputMessage {
  message: React.ReactNode|string;
  color: 'default'|'success'|'warning'|'danger';
}


function getUsernameMessage(input: string): InputMessage {
  console.log(!!input)
  
  if(input)
    if(!validateUsername(input))
      return {
        message: 'Username can only have letters, numbers, and underscores',
        color: 'danger'
      };
    else
      return {
        message: '',
        color: 'success'
      };
  else
    return {
      message: 'Username is required',
      color: 'danger'
    };
}


function getEmailMessage(input: string): InputMessage {
  if(input)
    if(!validateEmail(input))
      return {
        message: 'Please enter a valid email',
        color: 'danger'
      };
    else
      return {
        message: '',
        color: 'success'
      };
  else
    return {
      message: 'Email address is required',
      color: 'danger'
    };
}


function getPasswordMessage(input: string): InputMessage {
  if(input) {
    const passwordResult = validatePassword(input);
    return {
      message: `Password is ${passwordResult.strength}`,
      color: passwordResult.color
    };
  }
  else
    return {
      message: `Password is required`,
      color: 'danger'
    };
}


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


function LogIn() {
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


function SignUp() {
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

    addSnackbar('User Created', 'success');
  }

	return (
    <div>
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
    </div>
	);
}

function Message({data}: {data: InputMessage}) {
  return (
    <span className={`text-${data.color}`}>
      {data.message}
    </span>
  );
}