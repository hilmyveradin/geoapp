"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const signInResult = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          variant: "destructive",
          title: "Invalid username/password",
          description: "Please try again",
        });
      } else if (signInResult?.ok) {
        router.push("/app/maps");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="flex flex-col items-start w-2/3 p-8 border rounded-lg shadow-lg h-4/5">
        <Image
          src="/geoportal-logo.svg"
          alt="logo"
          width={80}
          height={80}
          className="mb-4"
        />
        <div className="flex w-full gap-4">
          <Image
            src="/login-image.png"
            alt="user avatar"
            width={600}
            height={400}
            className="w-[60%] rounded-lg"
          />
          <div className="flex flex-col w-[40%] gap-12 text-center">
            <p className="text-3xl font-bold">Welcome to Geoportal</p>
            <form
              ref={formRef}
              onSubmit={handleLogin}
              className="flex flex-col gap-4 text-start"
            >
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  autoComplete="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  name="username"
                  placeholder="Enter username"
                  required
                  type="text"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  type="password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
