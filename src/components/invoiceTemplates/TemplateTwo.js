import React from "react";
import headerImage from "../../Images/premHeads.png"; 
import "../../componentStyles/invoiceTemplatesCss/templateTwo.css";
const TemplateTwo = ({ invoice }) => {
  return (
    <div className="invoice-template-two">
      <div className="header-image">
        <img src={headerImage} alt="Invoice Header" className="header-img" />
      </div>
      <div className="invoice-content">
        <div className="invoice-meta">
        <div className="invoice-details">
            <p>Date: {new Date(invoice.invoiceDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
            <p>Invoice No. {invoice.invoiceNumber}</p>
          </div>
          <div className="buyer-section">
            <h3>BUYER/NOTIFY PARTY</h3>
            <p>{invoice.customerName || invoice.customerId?.name}</p>
            <p>{invoice.customerId.address}</p>
            <p>{invoice.customerId.email}</p>
            <p>{invoice.customerId.phones}</p>
          </div>
          
        </div>

        <h2 className="invoice-title">COMMERCIAL INVOICE</h2>

        <p className="invoice-intro">
          We take pleasure in confirming that we have sold to you the following goods on the terms and conditions stated below.
        </p>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Commodity & Description</th>
              <th>Quantity 'CTNS'</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th>CBM</th>
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
                <td>{item.cbm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals-section">
          <p>Sub Total : {invoice.subtotal?.toFixed(2)}</p>
          <p>Tax : {invoice.tax} %</p>
          <p>Freight Cost: {invoice.frieghtCost}</p>
          <p className="grand-total">Grand Total : {invoice.total?.toFixed(2)}</p>
        </div>

        <div className="terms-section">
          <h3 className="terms-title">Terms & Conditions</h3>
          <p>{invoice.notes}</p>
        </div>

        <footer className="invoice-footer">
          <p>We look forward to the pleasure of serving you.</p>
          <p className="confirmed-by">Confirmed By:</p>
        </footer>
      </div>
    </div>
  );
};

export default TemplateTwo;