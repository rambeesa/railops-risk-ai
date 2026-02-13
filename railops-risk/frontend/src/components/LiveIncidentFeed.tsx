import type { Incident } from "../types/risk";

const severityStyle: Record<string, { bg: string; fg: string }> = {
  low: { bg: "#e8f5e9", fg: "#2e7d32" },
  medium: { bg: "#fff8e1", fg: "#f57c00" },
  high: { bg: "#ffe0b2", fg: "#e65100" },
  critical: { bg: "#ffebee", fg: "#c62828" },
};

export default function LiveIncidentFeed({ incidents }: { incidents: Incident[] }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        maxHeight: 280,
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>🚨 Live incident feed</div>
      {incidents.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.8 }}>No incidents in the last 24h.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {incidents.map((inc) => {
            const s = severityStyle[inc.severity] ?? severityStyle.medium;
            return (
              <div
                key={inc.id}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  borderLeft: `4px solid ${s.fg}`,
                  background: s.bg,
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, textTransform: "uppercase", color: s.fg }}>{inc.severity}</span>
                  <span style={{ opacity: 0.8, fontSize: 12 }}>{inc.ts.replace("T", " ").slice(0, 16)}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{inc.type} — {inc.location}</div>
                <div style={{ opacity: 0.9, marginTop: 4 }}>{inc.description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
