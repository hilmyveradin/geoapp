"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const username = formData.get("username");
    const password = formData.get("password");

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/login-image.png)`,
      }}
    >
      <Card className="w-full max-w-md relative z-10 backdrop-blur-md bg-white/30">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/geoportal-logo.svg`}
              alt="logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Geoportal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Enter your username"
                className="bg-white text-black placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="bg-white text-black placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-nileBlue-600 border border-transparent rounded-md shadow-sm hover:bg-nileBlue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nileBlue-500"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
