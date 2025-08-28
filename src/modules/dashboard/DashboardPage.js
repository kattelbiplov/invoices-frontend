import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RefreshCcw, Users, FileText, Building, DollarSign } from "lucide-react"; 
import "../../componentStyles/dashboard.css"; 

const statusColors = {
  draft: "bg-gray-200 text-gray-800",
  sent: "bg-blue-200 text-blue-800",
  paid: "bg-green-200 text-green-800",
  overdue: "bg-red-200 text-red-800",
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    businessStats: [],
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get("https://invoices-api-8ych.onrender.com/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const invoicesRes = await axios.get("https://invoices-api-8ych.onrender.com/api/dashboard/recent-invoices", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setStats(statsRes.data || {
          totalCustomers: 0,
          totalInvoices: 0,
          totalRevenue: 0,
          businessStats: [],
        });
        setRecentInvoices(invoicesRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setStats({
          totalCustomers: 0,
          totalInvoices: 0,
          totalRevenue: 0,
          businessStats: [],
        });
        setRecentInvoices([]);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCcw className="animate-spin w-10 h-10 text-blue-700" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Title */}
      <h1 className="dashboard-title">
        <FileText size={28} /> Dashboard
      </h1>


      <div className="stats-grid">
        <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
          <h3><Users size={18} /> Total Customers</h3>
          <p>{stats.totalCustomers ?? 0}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
          <h3><FileText size={18} /> Total Invoices</h3>
          <p>{stats.totalInvoices ?? 0}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
          <h3><DollarSign size={18} /> Total Revenue</h3>
          <p>Rs. {(stats.totalRevenue ?? 0).toFixed(2)}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
          <h3><Building size={18} /> Total Businesses</h3>
          <p>{stats.businessStats?.length ?? 0}</p>
        </motion.div>
      </div>


      <h2 className="section-title"><Building size={20} /> Business Breakdown</h2>
      <div className="business-grid">
        {stats.businessStats?.length > 0 ? stats.businessStats.map((b) => (
          <motion.div key={b.businessId} whileHover={{ scale: 1.03 }} className="business-card">
            <h4>{b.businessName}</h4>
            <p>Customers: <span>{b.totalCustomers ?? 0}</span></p>
            <p>Invoices: <span>{b.totalInvoices ?? 0}</span></p>
            <p>Revenue: <span>Rs. {(b.totalRevenue ?? 0).toFixed(2)}</span></p>
          </motion.div>
        )) : (
          <p className="text-gray-500">No business data available.</p>
        )}
      </div>


      <h2 className="section-title"><FileText size={20} /> Recent Invoices</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Business</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices?.length > 0 ? recentInvoices.map((inv) => (
              <tr key={inv._id}>
                <td>#{inv._id.slice(-6)}</td>
                <td>{inv.customerId?.name || "N/A"}</td>
                <td>{inv.businessId?.name || "N/A"}</td>
                <td>Rs. {(inv.totalAmount ?? 0).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${statusColors[inv.status] || "bg-gray-200 text-gray-800"}`}>
                    {inv.status?.toUpperCase() || "UNKNOWN"}
                  </span>
                </td>
                <td>{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "N/A"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
