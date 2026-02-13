export default function RiskGauge({ pRisk }: { pRisk: number }) {
  const pct = Math.round(pRisk * 100);

  let label = "LOW";
  let bg = "#e8f5e9";
  let fg = "#2e7d32";

  if (pct >= 60) { label = "MEDIUM"; bg = "#fff8e1"; fg = "#f57c00"; }
  if (pct >= 85) { label = "HIGH"; bg = "#ffebee"; fg = "#c62828"; }

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e6e6e6",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Current Risk</div>
        <div style={{ padding: "4px 10px", borderRadius: 999, background: bg, color: fg, fontWeight: 700, fontSize: 12 }}>
          {label}
        </div>
      </div>

      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{pct}%</div>

      <div style={{ height: 10, background: "#f2f2f2", borderRadius: 999, overflow: "hidden", marginTop: 10 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: fg }} />
      </div>

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        Probability of incident / failure (class 1)
      </div>
    </div>
  );
}
