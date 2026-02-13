type Status = "green" | "yellow" | "red";

export type Indicator = {
  label: string;
  status: Status;
  sub?: string;
};

const colors: Record<Status, { bg: string; fg: string; dot: string }> = {
  green: { bg: "#e8f5e9", fg: "#2e7d32", dot: "#4caf50" },
  yellow: { bg: "#fff8e1", fg: "#f57c00", dot: "#ffc107" },
  red: { bg: "#ffebee", fg: "#c62828", dot: "#f44336" },
};

export default function StatusIndicators({ indicators }: { indicators: Indicator[] }) {
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
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>🚦 Status indicators</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {indicators.map((ind, i) => {
          const c = colors[ind.status];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 10,
                background: c.bg,
                color: c.fg,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.dot,
                  boxShadow: `0 0 6px ${c.dot}`,
                }}
              />
              <span>{ind.label}</span>
              {ind.sub && <span style={{ fontWeight: 400, opacity: 0.9 }}>— {ind.sub}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
