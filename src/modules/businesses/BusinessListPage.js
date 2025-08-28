import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../componentStyles/businesses.css"; 

const API_BASE = "https://invoices-api-8ych.onrender.com/api/business"; 

const BusinessListPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [phones, setPhones] = useState("");
  const [address, setAddress] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("");

  const token = localStorage.getItem("token");


  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/get-business`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(res.data.businesses || []);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);


  const handleAddBusiness = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/add-business`,
        {
          name,
          emails: emails.split(",").map((e) => e.trim()),
          phones: phones.split(",").map((p) => p.trim()),
          address,
          invoicePrefix,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBusinesses([...businesses, res.data.business]); // update state
      setShowModal(false);
      setName("");
      setEmails("");
      setPhones("");
      setAddress("");
      setInvoicePrefix("");
    } catch (err) {
      console.error("Error adding business:", err);
      alert("Failed to add business");
    }
  };

  return (
    <div className="business-page">
      <div className="business-header">
        <h2>Businesses</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Business
        </button>
      </div>

      {loading && <p>Loading businesses...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && businesses.length > 0 ? (
        <table className="business-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Emails</th>
              <th>Phones</th>
              <th>Address</th>
              <th>Invoice Prefix</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz) => (
              <tr key={biz._id}>
                <td>{biz.name}</td>
                <td>{biz.emails?.join(", ")}</td>
                <td>{biz.phones?.join(", ")}</td>
                <td>{biz.address}</td>
                <td>{biz.invoicePrefix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No businesses found.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Business</h3>
            <form onSubmit={handleAddBusiness}>
              <input
                type="text"
                placeholder="Business Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Emails (comma separated)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phones (comma separated)"
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Invoice Prefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessListPage;
