

import React from "react";
import { IoMdCall } from "react-icons/io";
import { IoMailUnreadOutline } from "react-icons/io5";
import "../../componentStyles/invoiceTemplatesCss/templateOne.css";
import Logo from "../../Images/nepaLogo.png";

const TemplateOne = ({ invoice }) => {
  return (
    <div className="invoice-template-one">
      <header className="invoice-header">
        <img
          src={Logo} 
          alt="Business Logo"
          className="invoice-logo"
        />
        <h1 className="business-name">NEPA GLOBAL CO., LTD</h1>
        <p className="business-address">
          22-19, HYANGGO RO 1BEON-GIL <br />
          PALDAL-GU, SUWON-SEA, GYEONGGI-DO <br />
          REPUBLIC OF KOREA
        </p>
        <hr className="header-divider" />
      </header>

      <h2 className="invoice-title">INVOICE</h2>

      <section className="invoice-info">
        <div className="customer-info">
          <h3>INVOICE TO</h3>
          <p className="customer-name">
            <strong>{invoice.customerName || invoice.customerId?.name}</strong>
          </p>
          <p>{invoice.customerId.address}</p>
          {invoice.customerId?.phones?.[0] && (
            <p>
              <IoMdCall className="icon" /> {invoice.customerId.phones[0]}
            </p>
          )}
          {invoice.customerId?.email && (
            <p>
              <IoMailUnreadOutline className="icon" /> {invoice.customerId.email}
            </p>
          )}
        </div>

        <div className="invoice-meta">
          <p>
            <strong>Invoice #</strong> {invoice.invoiceNumber}
          </p>
          <p>
            <strong>Date</strong>{" "}
            {new Date(invoice.invoiceDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <p className="invoice-intro">
        We take pleasure in confirming that we have sold to you the following
        goods on the terms and conditions stated below.
      </p>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Commodity & Description</th>
            <th>Quantity 'CTNS'</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice.toFixed(2)}</td>
              <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="invoice-totals">
        <p>
          <strong>Sub Total :</strong> {invoice.subtotal?.toFixed(2)}
        </p>
        <p>
          <strong>Tax :</strong> {invoice.tax} %
        </p>
        <p className="grand-total">
          <strong>Grand Total :</strong> {invoice.total?.toFixed(2)}
        </p>
      </section>

      <section className="terms">
        <h4>Terms & Conditions</h4>
        <p>{invoice.notes || " "}</p>
      </section>

      <footer className="invoice-footer">
        <p className="footer-note">
          We look forward to the pleasure of serving you.
        </p>
        <p className="confirmed-by">Confirmed By:</p>
      </footer>
    </div>
  );
};

export default TemplateOne;
