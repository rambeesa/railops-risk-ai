export default function KPICard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e6e6e6",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
