import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/LoginPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import CustomerListPage from "./modules/customers/CustomerListPage";
import Layout from "./components/Layout";
import BusinessListPage from "./modules/businesses/BusinessListPage";
import InvoiceFormPage from "./modules/invoices/InvoiceFormPage";
import InvoiceListPage from "./modules/invoices/InvoiceListPage";
import InvoiceViewPage from "./modules/invoices/InvoiceViewPage";
import Setting from "./components/Setting";
function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={token ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/customers"
          element={token ? <Layout><CustomerListPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/business"
          element={token ? <Layout><BusinessListPage /></Layout> : <Navigate to="/login" />}
        />
         <Route
          path="/invoices"
          element={token ? <Layout><InvoiceFormPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/invoices-list"
          element={token ? <Layout><InvoiceListPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/invoice/:id"
          element={token ? <Layout><InvoiceViewPage /></Layout> : <Navigate to="/login" />}
        />
         <Route
          path="/settings"
          element={token ? <Layout><Setting /></Layout> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
