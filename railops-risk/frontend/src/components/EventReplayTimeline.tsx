import type { RiskEvent } from "../types/risk";

export default function EventReplayTimeline({
  events,
  currentIndex,
  onSeek,
  isPlaying,
  onPlayPause,
}: {
  events: RiskEvent[];
  currentIndex: number;
  onSeek: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}) {
  const sorted = [...events].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        maxHeight: 260,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>🧾 Event replay timeline</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button
          type="button"
          onClick={onPlayPause}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          Event {Math.min(currentIndex + 1, sorted.length)} of {sorted.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {sorted.length === 0 ? (
          <div style={{ fontSize: 14, opacity: 0.8 }}>Run predictions to build the timeline.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sorted.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onSeek(i)}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: currentIndex === i ? "2px solid #1976d2" : "1px solid #eee",
                  background: currentIndex === i ? "#e3f2fd" : "#fafafa",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 700 }}>{e.ts.replace("T", " ").slice(0, 19)}</span>
                <span style={{ marginLeft: 8, opacity: 0.9 }}>Risk {Math.round(e.pRisk * 100)}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
