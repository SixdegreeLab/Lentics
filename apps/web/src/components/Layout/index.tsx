import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div class="bg-green-50 min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
