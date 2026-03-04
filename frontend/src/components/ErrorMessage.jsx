// ErrorMessage.jsx
// Displays user-friendly error messages

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  const getErrorDetails = (error) => {
    if (error.includes("5MB") || error.includes("too large"))
      return { title: "File Too Large", icon: "📦", color: "#ff6b6b" };
    if (error.includes("VCF") || error.includes("format") || error.includes("Invalid"))
      return { title: "Invalid VCF File", icon: "📄", color: "#ff6b6b" };
    if (error.includes("drug") || error.includes("Unsupported"))
      return { title: "Unsupported Drug", icon: "💊", color: "#ffa94d" };
    if (error.includes("network") || error.includes("Network"))
      return { title: "Connection Error", icon: "🔌", color: "#ff6b6b" };
    return { title: "Analysis Error", icon: "⚠️", color: "#ffa94d" };
  };

  const details = getErrorDetails(error);

  return (
    <div style={{
      background: "#2a1a1a",
      border: `1px solid ${details.color}`,
      borderRadius: "12px",
      padding: "16px 20px",
      marginTop: "16px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px"
    }}>
      <span style={{ fontSize: "24px" }}>{details.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: details.color, fontWeight: "600", marginBottom: "4px" }}>
          {details.title}
        </div>
        <div style={{ color: "#ccc", fontSize: "14px" }}>{error}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: "none", border: "none",
          color: "#888", cursor: "pointer", fontSize: "18px"
        }}>✕</button>
      )}
    </div>
  );
}