"use client";

import Header from "./header";
import Footer from "./footer";

const HomeComponent = () => {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Header />
      <div className="px-2 ">Dashboard content</div>
      <Footer />
    </main>
  );
};

export default HomeComponent;
