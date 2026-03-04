// DrugInput.jsx
// Drug selection with multi-select dropdown

import { useState } from "react";

const SUPPORTED_DRUGS = [
  { name: "CODEINE",      gene: "CYP2D6",  desc: "Pain relief opioid" },
  { name: "WARFARIN",     gene: "CYP2C9",  desc: "Blood thinner" },
  { name: "CLOPIDOGREL",  gene: "CYP2C19", desc: "Antiplatelet" },
  { name: "SIMVASTATIN",  gene: "SLCO1B1", desc: "Cholesterol statin" },
  { name: "AZATHIOPRINE", gene: "TPMT",    desc: "Immunosuppressant" },
  { name: "FLUOROURACIL", gene: "DPYD",    desc: "Chemotherapy" },
];

export default function DrugInput({ onDrugsSelected, selectedDrugs }) {
  const [textInput, setTextInput] = useState("");
  const [inputMode, setInputMode] = useState("dropdown"); // dropdown | text

  const toggleDrug = (drugName) => {
    const current = selectedDrugs || [];
    if (current.includes(drugName)) {
      onDrugsSelected(current.filter(d => d !== drugName));
    } else {
      onDrugsSelected([...current, drugName]);
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    const drugs = e.target.value
      .split(",")
      .map(d => d.trim().toUpperCase())
      .filter(d => d);
    onDrugsSelected(drugs);
  };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {["dropdown", "text"].map(mode => (
          <button key={mode} onClick={() => setInputMode(mode)} style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: inputMode === mode ? "#748ffc" : "#444",
            background: inputMode === mode ? "#1a1a3a" : "transparent",
            color: inputMode === mode ? "#748ffc" : "#888",
            cursor: "pointer",
            fontSize: "13px",
            textTransform: "capitalize"
          }}>
            {mode === "dropdown" ? "🔽 Select" : "✏️ Type"}
          </button>
        ))}
      </div>

      {inputMode === "dropdown" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {SUPPORTED_DRUGS.map(drug => {
            const isSelected = (selectedDrugs || []).includes(drug.name);
            return (
              <div key={drug.name} onClick={() => toggleDrug(drug.name)} style={{
                padding: "12px",
                borderRadius: "10px",
                border: `1px solid ${isSelected ? "#748ffc" : "#333"}`,
                background: isSelected ? "#1a1a3a" : "#1a1a1a",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: isSelected ? "#748ffc" : "#ccc", fontWeight: "600", fontSize: "13px" }}>
                    {drug.name}
                  </span>
                  {isSelected && <span style={{ color: "#748ffc" }}>✓</span>}
                </div>
                <div style={{ color: "#666", fontSize: "11px", marginTop: "2px" }}>
                  {drug.gene} • {drug.desc}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            value={textInput}
            onChange={handleTextChange}
            placeholder="e.g. CODEINE, WARFARIN"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #444",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <div style={{ color: "#666", fontSize: "12px", marginTop: "6px" }}>
            Supported: CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL
          </div>
        </div>
      )}

      {/* Selected summary */}
      {(selectedDrugs || []).length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {selectedDrugs.map(drug => (
            <span key={drug} style={{
              background: "#1a1a3a",
              border: "1px solid #748ffc",
              color: "#748ffc",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px"
            }}>
              {drug}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}