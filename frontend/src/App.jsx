import { useState, useEffect, useRef } from "react";
import FileUpload from "./components/FileUpload";
import DrugInput from "./components/DrugInput";
import ResultsPanel from "./components/ResultsPanel";
import ErrorMessage from "./components/ErrorMessage";
import { analyzeVCF } from "./api/pharmaApi";

// Animated DNA Helix Background
function DNABackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ opacity: 0.07 }}>
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bf00ff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#bf00ff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <ellipse key={i}
            cx={`${10 + i * 12}%`} cy="50%" rx="2%" ry="40%"
            fill="none" stroke="#00f5ff" strokeWidth="0.5"
            style={{
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          borderRadius: "50%",
          background: i % 2 === 0 ? "#00f5ff" : "#bf00ff",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${4 + Math.random() * 6}s ease-in-out infinite alternate`,
          animationDelay: `${Math.random() * 4}s`,
          boxShadow: `0 0 ${6 + Math.random() * 10}px currentColor`
        }} />
      ))}

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />
    </div>
  );
}

// Glowing scan line effect
function ScanLine() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: "2px",
      background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
      animation: "scanline 4s linear infinite",
      zIndex: 1, pointerEvents: "none"
    }} />
  );
}

// Gene badge component
function GeneBadge({ gene }) {
  const colors = {
    CYP2D6: "#00f5ff", CYP2C19: "#bf00ff",
    CYP2C9: "#ff6b35", SLCO1B1: "#39ff14",
    TPMT: "#ff0080", DPYD: "#ffd700"
  };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontFamily: "'Courier New', monospace",
      fontWeight: "700",
      color: colors[gene] || "#00f5ff",
      border: `1px solid ${colors[gene] || "#00f5ff"}`,
      background: `${colors[gene] || "#00f5ff"}15`,
      letterSpacing: "1px"
    }}>
      {gene}
    </span>
  );
}

// Loading animation
function AnalyzingLoader() {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: i === 0 ? "relative" : "absolute",
            top: i === 0 ? "auto" : "50%",
            left: i === 0 ? "auto" : "50%",
            transform: i === 0 ? "none" : "translate(-50%,-50%)",
            width: `${60 + i * 30}px`,
            height: `${60 + i * 30}px`,
            borderRadius: "50%",
            border: `2px solid transparent`,
            borderTopColor: i === 0 ? "#00f5ff" : i === 1 ? "#bf00ff" : "#ff0080",
            animation: `spin ${1 + i * 0.5}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }} />
        ))}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: "24px"
        }}>🧬</div>
      </div>
      <div style={{
        color: "#00f5ff",
        fontFamily: "'Courier New', monospace",
        fontSize: "14px",
        letterSpacing: "3px",
        animation: "blink 1s ease-in-out infinite"
      }}>
        ANALYZING GENOME...
      </div>
      <div style={{ color: "#555", fontSize: "12px", marginTop: "8px" }}>
        Parsing variants • Running risk engine • Generating AI explanation
      </div>
    </div>
  );
}

export default function App() {
  const [vcfFile, setVcfFile] = useState(null);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!vcfFile) { setError("Please upload a VCF file before analyzing."); return; }
    if (selectedDrugs.length === 0) { setError("Please select at least one drug."); return; }
    setError(null); setResults(null); setLoading(true);
    try {
      const data = await analyzeVCF(vcfFile, selectedDrugs.join(", "));
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVcfFile(null); setSelectedDrugs([]); setResults(null); setError(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #020409;
          min-height: 100vh;
        }

        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.6; }
          to { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
        @keyframes pulse {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100vh; }
        }
        @keyframes spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(0,245,255,0.1); }
          50% { box-shadow: 0 0 30px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.2); }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes dataStream {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          background: linear-gradient(135deg, #00f5ff 0%, #bf00ff 50%, #ff0080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 4px;
          line-height: 1;
          animation: fadeSlideUp 0.8s ease forwards;
        }

        .card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,245,255,0.15);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          animation: fadeSlideUp 0.6s ease forwards;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00f5ff, transparent);
        }

        .analyze-btn {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          font-family: 'Orbitron', monospace;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #00f5ff20, #bf00ff20);
          color: #00f5ff;
          border: 1px solid #00f5ff;
          animation: glowPulse 2s ease infinite;
        }

        .analyze-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #00f5ff40, #bf00ff40);
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0,245,255,0.4);
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
        }

        .step-number {
          width: 32px; height: 32px;
          border-radius: "50%";
          display: flex; align-items: center; justify-content: center;
          font-family: 'Orbitron', monospace;
          font-size: 13px; font-weight: 700;
          color: #00f5ff;
          border: 1px solid #00f5ff;
          background: rgba(0,245,255,0.1);
          flex-shrink: 0;
        }

        .mono { font-family: 'Share Tech Mono', monospace; }
        .orbitron { font-family: 'Orbitron', monospace; }
        .exo { font-family: 'Exo 2', sans-serif; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020409; }
        ::-webkit-scrollbar-thumb { background: #00f5ff30; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00f5ff60; }
      `}</style>

      <DNABackground />
      <ScanLine />

      <div style={{
        position: "relative", zIndex: 2,
        minHeight: "100vh",
        fontFamily: "'Exo 2', sans-serif",
        color: "#e0e0e0"
      }}>

        {/* HEADER */}
        <header style={{
          borderBottom: "1px solid rgba(0,245,255,0.1)",
          background: "rgba(2,4,9,0.8)",
          backdropFilter: "blur(20px)",
          padding: "0 24px",
          position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{
            maxWidth: "900px", margin: "0 auto",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            height: "64px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "40px", height: "40px",
                background: "linear-gradient(135deg, #00f5ff, #bf00ff)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 0 20px rgba(0,245,255,0.5)"
              }}>🧬</div>
              <div>
                <div className="orbitron" style={{
                  fontSize: "18px", fontWeight: "700",
                  background: "linear-gradient(90deg, #00f5ff, #bf00ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>PHARMAGUARD</div>
                <div className="mono" style={{ fontSize: "10px", color: "#555", letterSpacing: "2px" }}>
                  GENOMIC RISK SYSTEM v1.0
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {["CYP2D6","CYP2C19","CYP2C9"].map(g => <GeneBadge key={g} gene={g} />)}
              <span style={{
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.3)",
                color: "#00f5ff", padding: "4px 12px",
                borderRadius: "999px", fontSize: "11px",
                fontFamily: "'Orbitron', monospace", letterSpacing: "1px"
              }}>RIFT 2026</span>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

          {/* HERO */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="mono" style={{
              color: "#00f5ff", fontSize: "12px",
              letterSpacing: "6px", marginBottom: "16px",
              opacity: 0.7
            }}>
              ◈ PRECISION MEDICINE ALGORITHM ◈
            </div>
            <h1 className="hero-title">PHARMAGUARD</h1>
            <div style={{ marginTop: "8px", marginBottom: "20px" }}>
              <span className="orbitron" style={{
                fontSize: "13px", color: "#bf00ff",
                letterSpacing: "4px"
              }}>PHARMACOGENOMIC RISK PREDICTION</span>
            </div>
            <p className="exo" style={{
              color: "#666", fontSize: "15px",
              maxWidth: "500px", margin: "0 auto",
              lineHeight: "1.8"
            }}>
              Upload patient genomic data. Predict drug interactions.
              Save lives with AI-powered clinical insights.
            </p>

            {/* Gene badges row */}
            <div style={{
              display: "flex", gap: "8px",
              justifyContent: "center", marginTop: "24px",
              flexWrap: "wrap"
            }}>
              {["CYP2D6","CYP2C19","CYP2C9","SLCO1B1","TPMT","DPYD"].map(g => (
                <GeneBadge key={g} gene={g} />
              ))}
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px", marginBottom: "32px"
          }}>
            {[
              { value: "100K+", label: "Deaths Preventable/yr", color: "#ff0080" },
              { value: "6", label: "Critical Genes Analyzed", color: "#00f5ff" },
              { value: "CPIC", label: "Guidelines Aligned", color: "#bf00ff" }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ padding: "20px", textAlign: "center" }}>
                <div className="orbitron" style={{
                  fontSize: "28px", fontWeight: "900",
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}`
                }}>{stat.value}</div>
                <div className="mono" style={{
                  fontSize: "10px", color: "#555",
                  letterSpacing: "1px", marginTop: "4px"
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* MAIN INPUT CARD */}
          <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>

            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              marginBottom: "32px", paddingBottom: "20px",
              borderBottom: "1px solid rgba(0,245,255,0.1)"
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#00f5ff",
                boxShadow: "0 0 10px #00f5ff",
                animation: "blink 1.5s ease infinite"
              }} />
              <span className="mono" style={{
                color: "#00f5ff", fontSize: "12px", letterSpacing: "3px"
              }}>GENOMIC ANALYSIS INTERFACE</span>
            </div>

            {/* Step 1 */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: "12px", marginBottom: "16px"
              }}>
                <div className="step-number" style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: "1px solid #00f5ff", background: "rgba(0,245,255,0.1)", color: "#00f5ff", fontFamily: "Orbitron", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>01</div>
                <div>
                  <div className="orbitron" style={{ color: "#fff", fontSize: "13px", letterSpacing: "2px" }}>
                    UPLOAD GENOMIC DATA
                  </div>
                  <div className="mono" style={{ color: "#444", fontSize: "11px", marginTop: "2px" }}>
                    VCF FORMAT v4.2 • MAX 5MB
                  </div>
                </div>
              </div>
              <FileUpload onFileSelected={setVcfFile} selectedFile={vcfFile} />
            </div>

            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)",
              marginBottom: "32px"
            }} />

            {/* Step 2 */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: "12px", marginBottom: "16px"
              }}>
                <div style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: "1px solid #bf00ff", background: "rgba(191,0,255,0.1)", color: "#bf00ff", fontFamily: "Orbitron", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>02</div>
                <div>
                  <div className="orbitron" style={{ color: "#fff", fontSize: "13px", letterSpacing: "2px" }}>
                    SELECT TARGET DRUG(S)
                  </div>
                  <div className="mono" style={{ color: "#444", fontSize: "11px", marginTop: "2px" }}>
                    SINGLE OR MULTI-DRUG ANALYSIS
                  </div>
                </div>
              </div>
              <DrugInput onDrugsSelected={setSelectedDrugs} selectedDrugs={selectedDrugs} />
            </div>

            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(191,0,255,0.2), transparent)",
              marginBottom: "32px"
            }} />

            {/* Analyze button */}
            {loading ? (
              <AnalyzingLoader />
            ) : (
              <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
                ⬡ INITIATE GENOMIC ANALYSIS ⬡
              </button>
            )}

            {(results || error) && !loading && (
              <button onClick={handleReset} style={{
                width: "100%", marginTop: "12px",
                padding: "10px", borderRadius: "8px",
                border: "1px solid #333", background: "transparent",
                color: "#555", fontSize: "12px",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "2px", cursor: "pointer",
                transition: "all 0.2s"
              }}>
                ↺ RESET ANALYSIS
              </button>
            )}
          </div>

          {/* Error */}
          <ErrorMessage error={error} onDismiss={() => setError(null)} />

          {/* Results */}
          {results && <ResultsPanel results={results} />}

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: "60px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(0,245,255,0.05)"
          }}>
            <div className="mono" style={{
              color: "#333", fontSize: "11px", letterSpacing: "3px"
            }}>
              PHARMAGUARD • RIFT 2026 • HEALTHTECH TRACK
            </div>
            <div className="mono" style={{
              color: "#222", fontSize: "10px",
              marginTop: "6px", letterSpacing: "2px"
            }}>
              POWERED BY CPIC GUIDELINES + GROQ AI + REACT
            </div>
          </div>
        </div>
      </div>
    </>
  );
}