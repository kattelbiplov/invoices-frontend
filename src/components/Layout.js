import React from "react";
import Sidebar from "./Sidebar";
import "../styles/layout.css"; 
const Layout = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
