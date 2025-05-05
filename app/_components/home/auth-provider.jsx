"use client";

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }) => {
  return (
    <SessionProvider basePath={process.env.NEXT_PUBLIC_BASE_PATH}>
      {children}
    </SessionProvider>
  );
};

export default AuthProvider;
