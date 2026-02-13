import type { RegionRisk } from "../types/risk";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function riskToColor(risk: number): string {
  if (risk <= 0.33) return "#4caf50";
  if (risk <= 0.66) return "#ffc107";
  return "#f44336";
}

export default function MultiRegionRiskView({ regions }: { regions: RegionRisk[] }) {
  const data = regions.map((r) => ({ name: r.region, risk: Math.round(r.risk * 100), count: r.count }));
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
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>📊 Multi-region risk view</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number | undefined) => [v != null ? `${v}%` : "—", "Risk"]} />
            <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={riskToColor(data[i].risk / 100)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
