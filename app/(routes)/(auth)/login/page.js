"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        router.push("/app/maps");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-nileBlue-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="flex justify-center mb-6">
            <Image
              src="/geoportal-logo.svg"
              alt="Geoportal Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium text-nileBlue-900"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  className="block w-full px-3 py-2 mt-1 bg-white border border-nileBlue-300 rounded-md shadow-sm focus:outline-none focus:ring-nileBlue-500 focus:border-nileBlue-500 sm:text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-nileBlue-900"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-3 py-2 mt-1 bg-white border border-nileBlue-300 rounded-md shadow-sm focus:outline-none focus:ring-nileBlue-500 focus:border-nileBlue-500 sm:text-sm"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-nileBlue-600 border border-transparent rounded-md shadow-sm hover:bg-nileBlue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nileBlue-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <Image
          className="absolute inset-0 object-cover w-full h-full"
          src="/login-image.png"
          alt="Login background"
          layout="fill"
          priority
        />
      </div>
    </div>
  );
}
