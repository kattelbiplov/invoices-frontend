

import React from "react";
import "../../componentStyles/invoiceTemplatesCss/templateThree.css";

const TemplateThree = ({ invoice }) => {
  return (
    <div className="invoice-template-three">

      <header className="invoice-header">

        <div className="company-info">
          <h1>HIMALAYA ANATOLIA FOOD TRADING HUB-FZCO</h1>
          <p>DUBAI SILICON OASIS</p>
          <p>CONTACT NO: +977-9843462928, +971 50 205 7382</p>
          <p>EMAIL: info@himalayatolia.com</p>
        </div>
      </header>

      <div className="invoice-meta-top">
        <div className="date-info">
          <p>Date: {new Date(invoice.invoiceDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
          <p>Invoice No.: {invoice.invoiceNumber}</p>
        </div>
      </div>


      <div className="buyer-section">
        <h3>BUYER/NOTIFY PARTY</h3>
        <p>{invoice.customerName || invoice.customerId?.name || "Q K D SUPERMARKET L.L.C"}</p>
        <p>{invoice.customerId?.address || "No. 192, Jumeira garden city Al satwa"}</p>
        <p>☎ {invoice.customerId?.phone || "+971 52 668 4336"}</p>
        <p>✉ {invoice.customerId?.email || "rahil.okd.ae"}</p>
      </div>


      <h2 className="invoice-title">PROFORMA INVOICE</h2>


      <p className="invoice-intro">
        We take pleasure in confirming that we have sold to you the following goods on the terms and conditions stated below.
      </p>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>S.N</th>
            <th>Commodity & Description</th>
            <th>Quantity 'CTNS'</th>
            <th>Unit Price</th>
            <th>Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}.</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice.toFixed(2)}</td>
              <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-section">
        <p>Subtotal: {invoice.subtotal?.toFixed(2) || 0.00}</p>
        <p>Tax (%): {invoice.tax || 0}%</p>
        <p>Freight Cost: {invoice.freight?.toFixed(2) || 1500.00}</p>
        <p className="grand-total">Total Amount: {invoice.total?.toFixed(2) || 64100.00}</p>
      </div>


      <div className="terms-section">
        <h3 className="terms-title">TERMS AND CONDITION</h3>
        <p>{invoice.notes || "No terms and conditions provided."}</p>
      </div>

      <footer className="invoice-footer">
        <p>We look forward to the pleasure of serving you.</p>
        <p className="confirmed-by">CONFIRMED BY</p>
      </footer>
    </div>
  );
};

export default TemplateThree;