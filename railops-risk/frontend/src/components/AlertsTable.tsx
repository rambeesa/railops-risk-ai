import type { RiskEvent } from "../types/risk";

export default function AlertsTable({ events }: { events: RiskEvent[] }) {
  const high = events
    .filter(e => e.pRisk >= 0.85)
    .slice(-10)
    .reverse();

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e6e6e6",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>High Risk Alerts (≥ 85%)</div>

      {high.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.8 }}>No high-risk alerts yet.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 12, opacity: 0.7 }}>
              <th style={{ padding: "8px 4px" }}>Time</th>
              <th style={{ padding: "8px 4px" }}>Risk</th>
              <th style={{ padding: "8px 4px" }}>Prediction</th>
              <th style={{ padding: "8px 4px" }}>Event ID</th>
            </tr>
          </thead>
          <tbody>
            {high.map((e) => (
              <tr key={e.id} style={{ borderTop: "1px solid #eee", fontSize: 13 }}>
                <td style={{ padding: "8px 4px" }}>{e.ts.replace("T", " ").slice(0, 19)}</td>
                <td style={{ padding: "8px 4px", fontWeight: 700 }}>{Math.round(e.pRisk * 100)}%</td>
                <td style={{ padding: "8px 4px" }}>{e.prediction}</td>
                <td style={{ padding: "8px 4px", fontFamily: "monospace" }}>{e.id.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
