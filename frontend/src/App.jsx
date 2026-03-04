// App.jsx
// Main application component — ties everything together

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import DrugInput from "./components/DrugInput";
import ResultsPanel from "./components/ResultsPanel";
import ErrorMessage from "./components/ErrorMessage";
import { analyzeVCF } from "./api/pharmaApi";

export default function App() {
  const [vcfFile, setVcfFile] = useState(null);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    // Validations
    if (!vcfFile) {
      setError("Please upload a VCF file before analyzing.");
      return;
    }
    if (selectedDrugs.length === 0) {
      setError("Please select at least one drug.");
      return;
    }

    setError(null);
    setResults(null);
    setLoading(true);

    try {
      const drugString = selectedDrugs.join(", ");
      const data = await analyzeVCF(vcfFile, drugString);
      setResults(data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Analysis failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVcfFile(null);
    setSelectedDrugs([]);
    setResults(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      color: "#fff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "#111",
        borderBottom: "1px solid #222",
        padding: "20px 0"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "36px" }}>🧬</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#fff" }}>
                PharmaGuard
              </h1>
              <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
                Pharmacogenomic Risk Prediction System
              </p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{
                background: "#1a3a1a",
                border: "1px solid #51cf66",
                color: "#51cf66",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                RIFT 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Info banner */}
        <div style={{
          background: "#111",
          border: "1px solid #1a2a4a",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "32px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start"
        }}>
          <span style={{ fontSize: "20px" }}>ℹ️</span>
          <div style={{ color: "#888", fontSize: "13px", lineHeight: "1.6" }}>
            Upload a patient VCF file and select drugs to receive personalized
            pharmacogenomic risk predictions powered by CPIC guidelines and AI explanations.
            Analyzes <span style={{ color: "#748ffc" }}>CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD</span>.
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px"
        }}>
          {/* Step 1 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "#1a1a3a",
                border: "1px solid #748ffc",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#748ffc", fontSize: "13px", fontWeight: "700"
              }}>1</div>
              <span style={{ color: "#ccc", fontWeight: "600" }}>Upload VCF File</span>
            </div>
            <FileUpload
              onFileSelected={setVcfFile}
              selectedFile={vcfFile}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #222", marginBottom: "28px" }} />

          {/* Step 2 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "#1a1a3a",
                border: "1px solid #748ffc",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#748ffc", fontSize: "13px", fontWeight: "700"
              }}>2</div>
              <span style={{ color: "#ccc", fontWeight: "600" }}>Select Drug(s)</span>
            </div>
            <DrugInput
              onDrugsSelected={setSelectedDrugs}
              selectedDrugs={selectedDrugs}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #222", marginBottom: "24px" }} />

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: loading ? "#333" : "linear-gradient(135deg, #748ffc, #9775fa)",
              color: loading ? "#666" : "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.5px"
            }}
          >
            {loading ? (
              <span>⏳ Analyzing... (this may take 10-20 seconds)</span>
            ) : (
              <span>🔬 Analyze Pharmacogenomic Risk</span>
            )}
          </button>

          {/* Reset button */}
          {(results || error) && (
            <button onClick={handleReset} style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "transparent",
              color: "#666",
              fontSize: "14px",
              cursor: "pointer"
            }}>
              🔄 Reset
            </button>
          )}
        </div>

        {/* Error */}
        <ErrorMessage
          error={error}
          onDismiss={() => setError(null)}
        />

        {/* Results */}
        {results && <ResultsPanel results={results} />}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          color: "#444",
          fontSize: "12px",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid #1a1a1a"
        }}>
          PharmaGuard • RIFT 2026 Hackathon • HealthTech Track
          <br />
          Built with CPIC Guidelines • Powered by Claude AI
        </div>
      </div>
    </div>
  );
}