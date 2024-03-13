"use client";

import React from "react";
import { Button, Card, CardBody, Input, Tabs, Tab } from "@nextui-org/react";
import { validateUsername, validateEmail, validatePassword } from "@/lib/validate";


export default function Page() {
  return (
    <main className="flex justify-center items-start mt-40">
      <Card className="w-96 py-2 px-4">
        <CardBody>
          <Tabs variant="underlined" className="flex justify-center">
            <Tab key="login" title="Log In" className="text-xl">
              <LogIn />
            </Tab>
            <Tab key="signUp" title="Sign Up" className="text-xl">
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
          label="Username" 
          type="text"
          variant="underlined"
        />
        <Input 
          label="Password"
          type="password" 
          variant="underlined"
          description=""
        />
        <div className="flex justify-center mt-6">
          <Button color="primary" >Log In</Button>
        </div>
    </div>
	);
}


function SignUp() {
  const [inputs, setInputs] = React.useState({ email: "", username: "", password: "" });

  const invalidUsername = React.useMemo(() => {
    if (inputs.username === "") return false;

    return !validateUsername(inputs.username);
  }, [inputs.username]);

  const invalidEmail = React.useMemo(() => {
    if (inputs.email === "") return false;

    return !validateEmail(inputs.email);
  }, [inputs.email]);

  const passwordColor = React.useMemo(() => {
    if (inputs.password === "") return 'default';

    return validatePassword(inputs.password).color;
  }, [inputs.password]);

  const passwordMessage = React.useMemo(() => {
    if(inputs.password === '') 
      return '';

    const result = validatePassword(inputs.password);

    return (
      <span className={`text-${result.color}`}>
        Password is {result.strength}
      </span>
    )
  }, [inputs.password]);

	return (
    <div>
        <Input 
          label="Username" 
          value={inputs.username}
          color={invalidUsername ? "danger" : inputs.username != "" ? "success" : "default"}
          errorMessage={invalidUsername && "Username can only have letters, numbers, and underscores"}
          onValueChange={val => setInputs({...inputs, username: val})}
          type="text"
          variant="underlined"
        />
        <Input 
          label="Email" 
          value={inputs.email}
          color={invalidEmail ? "danger" : inputs.email != "" ? "success" : "default"}
          errorMessage={invalidEmail && "Please enter a valid email"}
          onValueChange={val => setInputs({...inputs, email: val})}
          type="email"
          variant="underlined"
        />
        <Input 
          label="Password" 
          value={inputs.password}
          color={passwordColor}
          description={passwordMessage}
          onValueChange={val => setInputs({...inputs, password: val})}
          type="password" 
          variant="underlined"
        />
        <div className="flex justify-center mt-6">
          <Button color="primary" >Sign Up</Button>
        </div>
    </div>
	);
}