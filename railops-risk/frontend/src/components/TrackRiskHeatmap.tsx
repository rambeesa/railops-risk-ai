type SegmentRisk = { segmentId: string; risk: number }; // 0–1

function riskToColor(risk: number): string {
  if (risk <= 0.33) return "#4caf50";
  if (risk <= 0.66) return "#ffc107";
  return "#f44336";
}

export default function TrackRiskHeatmap({ segments }: { segments: SegmentRisk[] }) {
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
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>🛤️ Track risk heatmap</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        {segments.map((s) => (
          <div
            key={s.segmentId}
            title={`${s.segmentId}: ${Math.round(s.risk * 100)}%`}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: riskToColor(s.risk),
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 4, background: "#4caf50" }} /> Low
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 4, background: "#ffc107" }} /> Medium
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 4, background: "#f44336" }} /> High
        </span>
      </div>
    </div>
  );
}
