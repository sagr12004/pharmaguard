// JsonOutput.jsx
// Download and copy JSON output

import { useState } from "react";

export default function JsonOutput({ data }) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard_${data.patient_id}_${data.drug}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <button onClick={handleDownload} style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #51cf66",
          background: "#1a3a1a",
          color: "#51cf66",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px"
        }}>
          ⬇️ Download JSON
        </button>

        <button onClick={handleCopy} style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #748ffc",
          background: copied ? "#1a1a3a" : "transparent",
          color: "#748ffc",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px"
        }}>
          {copied ? "✅ Copied!" : "📋 Copy JSON"}
        </button>
      </div>

      {/* JSON preview */}
      <pre style={{
        background: "#0d0d0d",
        border: "1px solid #333",
        borderRadius: "10px",
        padding: "16px",
        overflowX: "auto",
        fontSize: "12px",
        color: "#a9dc76",
        maxHeight: "300px",
        overflowY: "auto",
        lineHeight: "1.6"
      }}>
        {jsonString}
      </pre>
    </div>
  );
}