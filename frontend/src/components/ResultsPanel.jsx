// ResultsPanel.jsx
// Full results display with expandable sections

import { useState } from "react";
import RiskBadge from "./RiskBadge";
import JsonOutput from "./JsonOutput";

function Section({ title, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid #333",
      borderRadius: "10px",
      marginBottom: "10px",
      overflow: "hidden"
    }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#1a1a1a"
      }}>
        <span style={{ color: "#ccc", fontWeight: "600" }}>{icon} {title}</span>
        <span style={{ color: "#666" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "16px", background: "#111", borderTop: "1px solid #222" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span style={{ color: "#888", fontSize: "13px" }}>{label}</span>
      <span style={{ color: color || "#ccc", fontSize: "13px", fontWeight: "500" }}>{value}</span>
    </div>
  );
}

export default function ResultsPanel({ results }) {
  if (!results) return null;

  // Handle both single result and multiple results
  const resultList = results.results || [results];

  return (
    <div>
      {resultList.map((result, index) => (
        <div key={index} style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px"
        }}>
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: "#888", fontSize: "13px" }}>Patient ID</div>
            <div style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>
              {result.patient_id}
            </div>
            <div style={{ color: "#748ffc", fontSize: "14px", marginTop: "2px" }}>
              Drug: {result.drug}
            </div>
            <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Risk Badge */}
          <RiskBadge
            riskLabel={result.risk_assessment?.risk_label}
            severity={result.risk_assessment?.severity}
            confidenceScore={result.risk_assessment?.confidence_score}
          />

          {/* Expandable Sections */}
          <Section title="Pharmacogenomic Profile" icon="🧬">
            <InfoRow label="Primary Gene" value={result.pharmacogenomic_profile?.primary_gene} color="#748ffc" />
            <InfoRow label="Diplotype" value={result.pharmacogenomic_profile?.diplotype} />
            <InfoRow label="Phenotype" value={result.pharmacogenomic_profile?.phenotype} color="#ffd43b" />
            {result.pharmacogenomic_profile?.detected_variants?.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>
                  Detected Variants
                </div>
                {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                  <div key={i} style={{
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "6px",
                    fontSize: "12px"
                  }}>
                    <span style={{ color: "#748ffc" }}>{v.rsid}</span>
                    <span style={{ color: "#666", margin: "0 8px" }}>|</span>
                    <span style={{ color: "#ffd43b" }}>{v.star_allele}</span>
                    <span style={{ color: "#666", margin: "0 8px" }}>|</span>
                    <span style={{ color: "#aaa" }}>{v.zygosity}</span>
                    <div style={{ color: "#666", marginTop: "4px" }}>{v.clinical_significance}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Clinical Recommendation" icon="💊">
            <InfoRow label="Action" value={result.clinical_recommendation?.action} color="#51cf66" />
            <div style={{ color: "#ccc", fontSize: "13px", margin: "8px 0", lineHeight: "1.6" }}>
              {result.clinical_recommendation?.dose_adjustment}
            </div>
            {result.clinical_recommendation?.alternative_drugs?.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ color: "#888", fontSize: "12px", marginBottom: "6px" }}>Alternatives</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {result.clinical_recommendation.alternative_drugs.map((d, i) => (
                    <span key={i} style={{
                      background: "#1a3a1a",
                      border: "1px solid #51cf66",
                      color: "#51cf66",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "12px"
                    }}>{d}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: "10px" }}>
              <a href={result.clinical_recommendation?.cpic_guideline_url}
                target="_blank" rel="noreferrer"
                style={{ color: "#748ffc", fontSize: "12px" }}>
                📖 View CPIC Guideline →
              </a>
            </div>
          </Section>

          <Section title="AI Clinical Explanation" icon="🤖">
            {["summary", "mechanism", "variant_impact", "clinical_context"].map(key => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <div style={{ color: "#748ffc", fontSize: "12px", fontWeight: "600",
                  textTransform: "uppercase", marginBottom: "4px" }}>
                  {key.replace("_", " ")}
                </div>
                <div style={{ color: "#ccc", fontSize: "13px", lineHeight: "1.7" }}>
                  {result.llm_generated_explanation?.[key] || "N/A"}
                </div>
              </div>
            ))}
          </Section>

          <Section title="Quality Metrics" icon="📊">
            <InfoRow label="VCF Parsing" value={result.quality_metrics?.vcf_parsing_success ? "✅ Success" : "❌ Failed"} />
            <InfoRow label="Variants Detected" value={result.quality_metrics?.variants_detected} />
            <InfoRow label="Genes Analyzed" value={result.quality_metrics?.genes_analyzed} />
            <InfoRow label="Annotation Completeness"
              value={`${Math.round((result.quality_metrics?.annotation_completeness || 0) * 100)}%`} />
            <InfoRow label="Analysis Version" value={result.quality_metrics?.analysis_version} />
          </Section>

          {/* JSON Output */}
          <Section title="Raw JSON Output" icon="📄">
            <JsonOutput data={result} />
          </Section>
        </div>
      ))}
    </div>
  );
}