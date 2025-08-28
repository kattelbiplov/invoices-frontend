import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../componentStyles/invoiceFormPage.css";

const API_BASE = "https://invoices-api-8ych.onrender.com";

const CreateInvoicePage = () => {
    const token = localStorage.getItem("token");

    const [businesses, setBusinesses] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [businessId, setBusinessId] = useState("");
    const [customerId, setCustomerId] = useState("");

    const [userInvoiceNumber, setUserInvoiceNumber] = useState("");

    const [invoiceDate, setInvoiceDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [items, setItems] = useState([
        { description: "", quantity: 1, unitPrice: 0, cbm: 0 },
    ]);

    const [tax, setTax] = useState(0);       
    const [freight, setFreight] = useState(0);
    const [notes, setNotes] = useState("");


    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/business/get-business`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBusinesses(res.data?.businesses || []);
            } catch (err) {
                console.error("Failed to load businesses", err);
            }
        };
        fetchBusinesses();
    }, [token]);

    useEffect(() => {
        const fetchCustomersForBusiness = async () => {
            if (!businessId) {
                setCustomers([]);
                setCustomerId("");
                return;
            }
            try {
                const res = await axios.get(
                    `${API_BASE}/api/customers/get-customer/${businessId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCustomers(res.data?.customers || []);
                setCustomerId(""); 
            } catch (err) {
                console.error("Failed to load customers for business", err);
                setCustomers([]);
            }
        };
        fetchCustomersForBusiness();
    }, [businessId, token]);


    const selectedBusiness = useMemo(
        () => businesses.find((b) => b._id === businessId),
        [businessId, businesses]
    );
    const invoicePrefix = selectedBusiness?.invoicePrefix || "";

    const handleItemChange = (index, field, value) => {
        const updated = [...items];
        if (["quantity", "unitPrice", "cbm"].includes(field)) {
            updated[index][field] = Number(value);
        } else {
            updated[index][field] = value;
        }
        setItems(updated);
    };

    const addItem = () => {
        setItems([
            ...items,
            { description: "", quantity: 1, unitPrice: 0, cbm: 0 },
        ]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };


    const subtotal = items.reduce(
        (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
        0
    );
    const taxAmount = (subtotal * (Number(tax) || 0)) / 100;
    const totalCBM = items.reduce((acc, it) => acc + (Number(it.cbm) || 0), 0);
    const grandTotal = subtotal + taxAmount + (Number(freight) || 0);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!businessId || !customerId) {
            alert("Please select Business and Customer.");
            return;
        }
        const payload = {
            businessId,
            customerId,
            invoiceNumber: `${invoicePrefix}${userInvoiceNumber}`.trim(),
            invoiceDate,
            dueDate,
            items,
            tax: Number(tax) || 0,              
            freight: Number(freight) || 0,
            notes,
            subtotal,
            taxAmount,
            totalCbm: totalCBM,
            totalAmount: grandTotal,
        };
        try {
            await axios.post(`${API_BASE}/api/invoices/add-invoice`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Invoice created successfully!");
            // (optional) reset form
            setCustomerId("");
            setUserInvoiceNumber("");
            setInvoiceDate("");
            setDueDate("");
            setItems([{ description: "", quantity: 1, unitPrice: 0, cbm: 0 }]);
            setTax(0);
            setFreight(0);
            setNotes("");
        } catch (err) {
            console.error("Create invoice error:", err);
            const msg =
                err?.response?.data?.message || "Failed to create invoice. Check console.";
            alert(msg);
        }
    };

    return (
        <div className="invoice-container">
            <h2>Create Invoice</h2>

            <form className="invoice-form" onSubmit={handleSubmit}>

                <label>Business</label>
                <select
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    required
                >
                    <option value="">Select Business</option>
                    {businesses.map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.name} {b.invoicePrefix ? `(${b.invoicePrefix})` : ""}
                        </option>
                    ))}
                </select>


                <label>Customer</label>
                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                    disabled={!businessId}
                >
                    <option value="">
                        {businessId ? "Select Customer" : "Select business first"}
                    </option>
                    {customers.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>

   
                <label>Invoice Number</label>
                <div className="invoice-number-wrap">
                    <span className="prefix-chip">{invoicePrefix || "—"}</span>
                    <input
                        type="text"
                        placeholder="Enter number (e.g., 000123)"
                        value={userInvoiceNumber}
                        onChange={(e) => setUserInvoiceNumber(e.target.value)}
                        required
                    />
                </div>


                <div className="date-group">
                    <div>
                        <label>Invoice Date</label>
                        <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

          
                <div className="items-section">
                    <h3>Items</h3>

                    <table className="items-table">
                        <thead>
                            <tr>
                                <th style={{ width: "38%" }}>Description</th>
                                <th style={{ width: "12%" }}>Qty</th>
                                <th style={{ width: "16%" }}>Unit Price</th>
                                <th style={{ width: "14%" }}>CBM</th>
                                <th style={{ width: "14%" }}>Line Total</th>
                                <th style={{ width: "6%" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            value={it.description}
                                            onChange={(e) =>
                                                handleItemChange(idx, "description", e.target.value)
                                            }
                                            placeholder="e.g., Product A"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={it.quantity}
                                            onChange={(e) =>
                                                handleItemChange(idx, "quantity", e.target.value)
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={it.unitPrice}
                                            onChange={(e) =>
                                                handleItemChange(idx, "unitPrice", e.target.value)
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={it.cbm}
                                            onChange={(e) =>
                                                handleItemChange(idx, "cbm", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="line-total">
                                        {(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toFixed(2)}
                                    </td>
                                    <td>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeItem(idx)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" className="add-item-btn" onClick={addItem}>
                        + Add Item
                    </button>
                </div>

 
                <div className="extras-section">
                    <div>
                        <label>Tax (%)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            placeholder="e.g., 15"
                        />
                    </div>
                    <div>
                        <label>Freight Cost</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={freight}
                            onChange={(e) => setFreight(e.target.value)}
                            placeholder="e.g., 100"
                        />
                    </div>
                </div>

                <label>Notes</label>
                <textarea
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes for this invoice..."
                />


                <div className="totals-section">
                    <p>Subtotal: <strong>{subtotal.toFixed(2)}</strong></p>
                    <p>Tax ({tax || 0}%): <strong>{taxAmount.toFixed(2)}</strong></p>
                    <p>Freight: <strong>{Number(freight).toFixed(2)}</strong></p>
                    <p>Total CBM: <strong>{totalCBM.toFixed(2)}</strong></p>
                    <p className="grand-total">Grand Total: <strong>{grandTotal.toFixed(2)}</strong></p>
                </div>

                <button type="submit" className="submit-btn">
                    Create Invoice
                </button>
            </form>
        </div>
    );
};

export default CreateInvoicePage;
