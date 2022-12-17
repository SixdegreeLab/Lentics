import React from "react";
import LeftSide from "./LeftSide";

const Layout = ({ children }) => {
  return (
    <div className="bg-green-50">
      <LeftSide />
      {children}
    </div>
  );
};

export default Layout;
