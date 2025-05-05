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
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  // TODO: Change this to shadcn Form
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();

  const handleLogin = async () => {
    const signInResult = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    console.log("SIGN IN RESULT: ", signInResult);
    if (signInResult?.error) {
      toast({
        variant: "destructive",
        title: "Invalid username/password",
        description: "Please try again",
      });
    }

    if (signInResult?.ok) {
      router.push("/app/maps");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="flex flex-col items-start w-2/3 p-8 border rounded-lg shadow-lg h-4/5">
        <img src="/geoportal-logo.svg" alt="logo" className="h-20 mb-4" />
        <div className="flex w-full h-full gap-4">
          <img
            src="/login-image.svg"
            alt="user avatar"
            className="rounded-lg"
          />
          <div className="flex flex-col flex-grow gap-12 text-center">
            <p className="text-3xl font-bold">Welcome to Geoportal</p>
            <div className="flex flex-col gap-4 text-start">
              <div className="">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Username
                </label>
                <div className="gap-2">
                  <input
                    id="username"
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" // Added some styling to the input
                    name="email"
                    placeholder="Enter username"
                    required
                    type="email"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="current-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" // Added some styling to the input
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    type="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
