import type { TelemetryMetric } from "../types/risk";

const statusColor = { green: "#4caf50", yellow: "#ffc107", red: "#f44336" };

export default function SystemTelemetryMonitor({ metrics }: { metrics: TelemetryMetric[] }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>📡 System telemetry</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              borderRadius: 8,
              background: "#f5f5f5",
              borderLeft: `4px solid ${statusColor[m.status]}`,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
              {m.value}
              {m.unit != null && <span style={{ fontSize: 12, fontWeight: 400 }}> {m.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
