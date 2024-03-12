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
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const invalidUsername = React.useMemo(() => {
    if (username === "") return false;

    return !validateUsername(username);
  }, [username]);

  const invalidEmail = React.useMemo(() => {
    if (email === "") return false;

    return !validateEmail(email);
  }, [email]);

  const passwordColor = React.useMemo(() => {
    if (password === "") return 'default';

    return validatePassword(password).color;
  }, [password]);

  const passwordMessage = React.useMemo(() => {
    if(password === '') 
      return '';

    const result = validatePassword(password);

    return (
      <span className={`text-${result.color}`}>
        Password is {result.strength}
      </span>
    )
  }, [password]);

	return (
    <div>
        <Input 
          label="Username" 
          value={username}
          color={invalidUsername ? "danger" : username != "" ? "success" : "default"}
          errorMessage={invalidUsername && "Username can only have letters, numbers, and underscores"}
          onValueChange={setUsername}
          type="text"
          variant="underlined"
        />
        <Input 
          label="Email" 
          value={email}
          color={invalidEmail ? "danger" : email != "" ? "success" : "default"}
          errorMessage={invalidEmail && "Please enter a valid email"}
          onValueChange={setEmail}
          type="email"
          variant="underlined"
        />
        <Input 
          label="Password" 
          value={password}
          color={passwordColor}
          description={passwordMessage}
          onValueChange={setPassword}
          type="password" 
          variant="underlined"
        />
        <div className="flex justify-center mt-6">
          <Button color="primary" >Sign Up</Button>
        </div>
    </div>
	);
}