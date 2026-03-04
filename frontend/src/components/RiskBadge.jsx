// RiskBadge.jsx
// Color-coded risk label display

export default function RiskBadge({ riskLabel, severity, confidenceScore }) {
  const getStyle = (risk) => {
    switch (risk?.toLowerCase()) {
      case "safe":
        return { bg: "#1a3a1a", border: "#51cf66", color: "#51cf66", icon: "✅" };
      case "adjust dosage":
        return { bg: "#3a2e00", border: "#ffd43b", color: "#ffd43b", icon: "⚠️" };
      case "toxic":
        return { bg: "#3a0a0a", border: "#ff6b6b", color: "#ff6b6b", icon: "☠️" };
      case "ineffective":
        return { bg: "#1a1a3a", border: "#748ffc", color: "#748ffc", icon: "❌" };
      default:
        return { bg: "#2a2a2a", border: "#888", color: "#888", icon: "❓" };
    }
  };

  const style = getStyle(riskLabel);

  return (
    <div style={{
      background: style.bg,
      border: `2px solid ${style.border}`,
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      marginBottom: "24px"
    }}>
      <div style={{ fontSize: "48px", marginBottom: "8px" }}>{style.icon}</div>

      <div style={{
        color: style.color,
        fontSize: "32px",
        fontWeight: "800",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "8px"
      }}>
        {riskLabel || "Unknown"}
      </div>

      <div style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
        Severity: <span style={{ color: style.color, fontWeight: "600" }}>
          {severity?.toUpperCase() || "N/A"}
        </span>
      </div>

      {confidenceScore !== undefined && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ color: "#888", fontSize: "12px", marginBottom: "6px" }}>
            Confidence Score
          </div>
          <div style={{
            background: "#111",
            borderRadius: "999px",
            height: "8px",
            overflow: "hidden"
          }}>
            <div style={{
              background: style.border,
              width: `${Math.round(confidenceScore * 100)}%`,
              height: "100%",
              borderRadius: "999px",
              transition: "width 0.8s ease"
            }} />
          </div>
          <div style={{ color: style.color, fontSize: "13px", marginTop: "4px" }}>
            {Math.round(confidenceScore * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}