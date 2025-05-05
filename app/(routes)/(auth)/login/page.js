"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  // TODO: Change this to shadcn Form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      router.push("/app/dashboard");
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Card className="max-w-md p-6 mx-auto mt-10 space-y-4 bg-white shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Please enter your username and password to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              required
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              required
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleLogin()}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Login;
