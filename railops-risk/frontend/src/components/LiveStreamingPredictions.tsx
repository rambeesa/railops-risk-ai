import type { RiskEvent } from "../types/risk";

export default function LiveStreamingPredictions({ events }: { events: RiskEvent[] }) {
  const recent = [...events].reverse().slice(0, 8);
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>⏱️ Live streaming predictions</div>
      {recent.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.8 }}>Predictions will appear here as they run.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {recent.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 8,
                background: e.pRisk >= 0.85 ? "#ffebee" : e.pRisk >= 0.5 ? "#fff8e1" : "#e8f5e9",
                fontSize: 13,
              }}
            >
              <span>
                <strong>Risk {Math.round(e.pRisk * 100)}%</strong> — Pred: {e.prediction}
              </span>
              <span style={{ opacity: 0.8, fontSize: 12 }}>{e.ts.split("T")[1]?.slice(0, 8)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
