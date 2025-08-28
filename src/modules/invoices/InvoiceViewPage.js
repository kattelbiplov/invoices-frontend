import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import TemplateOne from "../../components/invoiceTemplates/TemplateOne";
import TemplateTwo from "../../components/invoiceTemplates/TemplateTwo";
import TemplateThree from "../../components/invoiceTemplates/TemplateThree";

const API_BASE = "https://invoices-api-8ych.onrender.com/api/invoices";

const InvoiceViewPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  const templateMap = {
    "68a624fb99ff3abb5957cc45": TemplateOne,
    "68a76d393eeeaa66d050a316": TemplateTwo,
    "68a77f33c2ec9acc85591f3d": TemplateThree,
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched invoice:", res.data.invoice);
        setInvoice(res.data.invoice);
      } catch (err) {
        console.error("Failed to fetch invoice:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, token]);

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`invoice-${id}.pdf`);
    });
  };

  if (loading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found or failed to load.</div>;

  const businessKey =
    typeof invoice.businessId === "string"
      ? invoice.businessId
      : invoice.businessId?._id;

  const TemplateComponent = templateMap[businessKey] || TemplateOne;

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleDownloadPDF}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#2c3e50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>

      <div ref={invoiceRef}>
        <TemplateComponent invoice={invoice} />
      </div>
    </div>
  );
};

export default InvoiceViewPage;