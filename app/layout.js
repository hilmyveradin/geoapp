import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./_components/home/auth-provider";
import "./globals.css";

export const metadata = {
  title: "Geoapp",
  description: "Geospatial Content Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
