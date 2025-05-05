"use client";

import { Button } from "@/components/ui/button";

const AppDashboard = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/get-layers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response);
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  return (
    <div>
      <Button onClick={() => handleLogin()}> Test Request Map</Button>
    </div>
  );
};

export default AppDashboard;
