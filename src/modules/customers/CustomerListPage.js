import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../componentStyles/customers.css";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formCustomer, setFormCustomer] = useState({
    name: "",
    email: "",
    address:"",
    phones: [""],
    businessId: "",
  });

  const [toast, setToast] = useState({ message: "", type: "" }); 
  const token = localStorage.getItem("token");


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };


  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://invoices-api-8ych.onrender.com/api/customers/get-customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.customers);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch customers", "error");
      setLoading(false);
    }
  };


  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("https://invoices-api-8ych.onrender.com/api/business/get-business", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(res.data.businesses);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch businesses", "error");
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchBusinesses();
  }, []);


  const handleAddCustomer = async () => {
    try {
      await axios.post("https://invoices-api-8ych.onrender.com/api/customers/add-customer", formCustomer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
      setShowAddModal(false);
      setFormCustomer({ name: "", email: "",address:"", phones: [""], businessId: "" });
      showToast("Customer added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to add customer", "error");
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormCustomer({
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phones: customer.phones,
      businessId: customer.businessId?._id || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      await axios.put(
        `https://invoices-api-8ych.onrender.com/api/customers/update-customer/${selectedCustomer._id}`,
        formCustomer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCustomers();
      setShowEditModal(false);
      setFormCustomer({ name: "", email: "",address:"", phones: [""], businessId: "" });
      setSelectedCustomer(null);
      showToast("Customer updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update customer", "error");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`https://invoices-api-8ych.onrender.com/api/customers/delete-customer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
      showToast("Customer deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to delete customer", "error");
    }
  };

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="customers-page">
      {/* Toast Message */}
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>Add Customer</button>
      </div>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phones</th>
            <th>Business</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phones?.join(", ") || "-"}</td>
              <td>{customer.businessId?.name || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEditCustomer(customer)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteCustomer(customer._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Customer</h2>

            <label>Name</label>
            <input type="text" value={formCustomer.name} onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })} />

            <label>Email</label>
            <input type="email" value={formCustomer.email} onChange={(e) => setFormCustomer({ ...formCustomer, email: e.target.value })} />
            
            <label>Address</label>
            <input type="text" value={formCustomer.address} onChange={(e) => setFormCustomer({ ...formCustomer, address: e.target.value })} />

            <label>Phones (comma separated)</label>
            <input type="text" value={formCustomer.phones.join(",")} onChange={(e) => setFormCustomer({ ...formCustomer, phones: e.target.value.split(",") })} />

            <label>Business</label>
            <select value={formCustomer.businessId} onChange={(e) => setFormCustomer({ ...formCustomer, businessId: e.target.value })}>
              <option value="">Select Business</option>
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={handleAddCustomer}>Add</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Customer</h2>

            <label>Name</label>
            <input type="text" value={formCustomer.name} onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })} />

            <label>Email</label>
            <input type="email" value={formCustomer.email} onChange={(e) => setFormCustomer({ ...formCustomer, email: e.target.value })} />

            <label>Phones (comma separated)</label>
            <input type="text" value={formCustomer.phones.join(",")} onChange={(e) => setFormCustomer({ ...formCustomer, phones: e.target.value.split(",") })} />

            <label>Business</label>
            <select value={formCustomer.businessId} onChange={(e) => setFormCustomer({ ...formCustomer, businessId: e.target.value })}>
              <option value="">Select Business</option>
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleUpdateCustomer}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
