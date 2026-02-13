type Recommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  action: string;
  reason: string;
  eta?: string;
};

export default function AIRecommendationsPanel({ recommendations }: { recommendations: Recommendation[] }) {
  const priorityColor = { high: "#c62828", medium: "#f57c00", low: "#2e7d32" };
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
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>🧠 AI recommendations</div>
      {recommendations.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.8 }}>No recommendations at this time.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                padding: 10,
                borderRadius: 8,
                borderLeft: `4px solid ${priorityColor[rec.priority]}`,
                background: "#f5f5f5",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{rec.action}</div>
              <div style={{ opacity: 0.9 }}>{rec.reason}</div>
              {rec.eta && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>ETA: {rec.eta}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
