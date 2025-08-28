import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../componentStyles/invoiceListPage.css";

const API_BASE = "https://invoices-api-8ych.onrender.com";

const statusColors = {
  draft: "#dfe6e9",
  sent: "#ffeaa7",
  paid: "#55efc4",
  overdue: "#ff7675",
};

const InvoiceListPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [invoices, setInvoices] = useState([]);


  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/business/get-business`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinesses(res.data.businesses || []);
      } catch (err) {
        console.error("Failed to load businesses", err);
      }
    };
    fetchBusinesses();
  }, [token]);


  useEffect(() => {
    if (!businessId) {
      setInvoices([]);
      return;
    }
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/invoices/get-invoices/${businessId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvoices(res.data.invoices || []);
      } catch (err) {
        console.error("Failed to load invoices", err);
      }
    };
    fetchInvoices();
  }, [businessId, token]);

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/api/invoices/update-status/${invoiceId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="invoice-list-container">
      <h2>Invoices</h2>

      <label>Select Business</label>
      <select
        value={businessId}
        onChange={(e) => setBusinessId(e.target.value)}
      >
        <option value="">Select Business</option>
        {businesses.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>


      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.invoiceNumber || "N/A"}</td>
              <td>{inv.customerName || inv.customerId?.name || "N/A"}</td>
              <td>
                {inv.invoiceDate
                  ? new Date(inv.invoiceDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {inv.dueDate
                  ? new Date(inv.dueDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{(inv.total || 0).toFixed(2)}</td>
              <td>
                <select
                  value={inv.status || "draft"}
                  style={{
                    background: statusColors[inv.status] || "#eee",
                    borderRadius: "6px",
                    padding: "4px 6px",
                    border: "1px solid #ccc",
                  }}
                  onChange={(e) =>
                    handleStatusChange(inv._id, e.target.value)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/invoice/${inv._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                No invoices found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceListPage;
