// FileUpload.jsx
// Drag and drop VCF file upload with validation

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ onFileSelected, selectedFile }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      setError("Invalid file. Please upload a .vcf file under 5MB.");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate extension
    if (!file.name.toLowerCase().endsWith(".vcf")) {
      setError("Invalid file type. Only .vcf files are supported.");
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    onFileSelected(file);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".vcf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? "#748ffc" : selectedFile ? "#51cf66" : "#444"}`,
        borderRadius: "12px",
        padding: "40px 20px",
        textAlign: "center",
        cursor: "pointer",
        background: isDragActive ? "#1a1a3a" : selectedFile ? "#1a3a1a" : "#1a1a1a",
        transition: "all 0.2s ease"
      }}>
        <input {...getInputProps()} />

        {selectedFile ? (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>✅</div>
            <div style={{ color: "#51cf66", fontWeight: "600", fontSize: "16px" }}>
              {selectedFile.name}
            </div>
            <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
              {formatSize(selectedFile.size)} / 5 MB max
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}>
              Click or drag to replace
            </div>
          </div>
        ) : isDragActive ? (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>📂</div>
            <div style={{ color: "#748ffc", fontWeight: "600" }}>Drop your VCF file here</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>🧬</div>
            <div style={{ color: "#ccc", fontWeight: "600", fontSize: "16px" }}>
              Drag & drop your VCF file here
            </div>
            <div style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>
              or click to browse
            </div>
            <div style={{ color: "#555", fontSize: "12px", marginTop: "12px" }}>
              Supports: .vcf format • Max size: 5 MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          color: "#ff6b6b", fontSize: "13px",
          marginTop: "8px", padding: "8px 12px",
          background: "#2a1a1a", borderRadius: "8px"
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}