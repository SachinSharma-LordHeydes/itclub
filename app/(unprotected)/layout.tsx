import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

const homeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default homeLayout;
