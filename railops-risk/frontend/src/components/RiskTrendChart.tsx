import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { RiskEvent } from "../types/risk";

export default function RiskTrendChart({ events }: { events: RiskEvent[] }) {
  const data = events
    .slice(-30)
    .map((e) => ({
      ts: e.ts.split("T")[1]?.slice(0, 8) ?? e.ts,
      pRisk: Math.round(e.pRisk * 100),
    }));

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e6e6e6",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Risk Trend (last 30 predictions)</div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="pRisk" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
