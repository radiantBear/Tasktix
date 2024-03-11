"use client";

import React from "react";
import { Button, Card, CardHeader, CardBody, Divider, Input, CardFooter } from "@nextui-org/react";
import { validateEmail, validatePassword } from "@/lib/validate";

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
      return <span></span>;

    const result = validatePassword(password);

    return (
      <span className={`text-${result.color}`}>
        Password is {result.strength}
      </span>
    )
  }, [password]);

	return (
		<main className="flex justify-center items-center h-screen w-screen">
			<Card className="w-96 py-2 px-4">
				<CardHeader className="flex justify-center">
					<h1 className="text-xl">Sign Up</h1>
				</CardHeader>
        <CardBody>
					<Input 
            label="Email" 
            isRequired 
            value={email}
            color={invalidEmail ? "danger" : email != "" ? "success" : "default"}
            errorMessage={invalidEmail && "Please enter a valid email"}
            onValueChange={setEmail}
            type="email"
            variant="underlined"
          />
          <Input 
            label="Password" 
            isRequired
            value={password}
            color={passwordColor}
            description={passwordMessage}
            onValueChange={setPassword}
            type="password" 
            variant="underlined"
          />
				</CardBody>
        <CardFooter className="flex justify-center">
          <Button color="primary" >Sign Up</Button>
        </CardFooter>
			</Card>
		</main>
	);
}