import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { FiHome, FiBriefcase, FiUsers, FiFileText, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import "../componentStyles/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FiHome /> },
    { path: "/business", label: "Businesses", icon: <FiBriefcase /> },
    { path: "/customers", label: "Customers", icon: <FiUsers /> },
    { path: "/invoices", label: "Invoices", icon: <FiFileText /> },
    { path: "/invoices-list", label: "View Invoices", icon: <FiFileText /> },
    { path: "/settings", label: "Settings", icon: <FiSettings /> },
  ];


  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <h2 className="logo">InvoiceApp</h2>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <FiMenu />
        </button>
      </div>

      <ul className="sidebar-nav">
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="icon" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;