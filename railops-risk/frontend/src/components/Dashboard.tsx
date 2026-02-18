import { useMemo, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import KPICard from "./KPICard";
import RiskGauge from "./RiskGauge";
import RiskTrendChart from "./RiskTrendChart";
import AlertsTable from "./AlertsTable";
import StatusIndicators from "./StatusIndicators";
import LiveIncidentFeed from "./LiveIncidentFeed";
import AIRecommendationsPanel from "./AIRecommendationsPanel";
import SystemTelemetryMonitor from "./SystemTelemetryMonitor";
import TrackRiskHeatmap from "./TrackRiskHeatmap";
import MultiRegionRiskView from "./MultiRegionRiskView";
import LiveStreamingPredictions from "./LiveStreamingPredictions";
import EventReplayTimeline from "./EventReplayTimeline";
import type { RiskEvent, RiskResponse, Incident, TelemetryMetric, RegionRisk } from "../types/risk";
import type { Indicator } from "./StatusIndicators";

function uid() {
  return Date.now().toString() + Math.random().toString(16);
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "1",
    ts: new Date(Date.now() - 3600000).toISOString(),
    severity: "medium",
    type: "Track anomaly",
    location: "Segment NW-12",
    description: "Vibration threshold exceeded; inspection recommended within 48h.",
  },
  {
    id: "2",
    ts: new Date(Date.now() - 7200000).toISOString(),
    severity: "low",
    type: "Weather",
    location: "Region Central",
    description: "Heavy rain may affect braking distance; speed limits applied.",
  },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: "r1",
    priority: "high" as const,
    action: "Inspect Segment NW-12",
    reason: "Risk score elevated; 3 anomalies in the last 24h.",
    eta: "Next maintenance window",
  },
  {
    id: "r2",
    priority: "medium" as const,
    action: "Review Region Central thresholds",
    reason: "Weather-related risk trending up; consider temporary speed limits.",
    eta: "Within 2h",
  },
];

const REGION_NAMES = ["North", "South", "Central", "East", "West"];

/** Labels and guidance for the 5 risk prediction inputs (must match backend model order). */
const RISK_FEATURE_LABELS: { name: string; placeholder: string; hint: string }[] = [
  { name: "Severity / incident type", placeholder: "0–2", hint: "Encoded severity (e.g. 0=low, 1=medium, 2=high)" },
  { name: "Equipment condition score", placeholder: "0–3", hint: "Normalized condition (higher = worse)" },
  { name: "Environmental factor", placeholder: "0–2", hint: "Weather/visibility (e.g. 0=clear, 2=adverse)" },
  { name: "Traffic / volume factor", placeholder: "0–5", hint: "Usage or traffic level (normalized)" },
  { name: "Human / procedural factor", placeholder: "0–2", hint: "Safety/training score (higher = more risk)" },
];

export default function Dashboard() {
  const [features, setFeatures] = useState<number[]>([0.5, 1.2, 0.3, 2.1, 0.8]);
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [telemetry, setTelemetry] = useState<TelemetryMetric[]>([
    { label: "API latency", value: "—", unit: "ms", status: "green" },
    { label: "Predictions/min", value: "0", status: "green" },
    { label: "Model load", value: "OK", status: "green" },
  ]);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  const latest = events[events.length - 1];
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()),
    [events]
  );

  const kpis = useMemo(() => {
    const total = events.length;
    const avgRisk = total ? events.reduce((a, e) => a + e.pRisk, 0) / total : 0;
    const highCount = events.filter((e) => e.pRisk >= 0.85).length;
    return { total, avgRisk, highCount };
  }, [events]);

  const statusIndicators = useMemo((): Indicator[] => {
    const avg = kpis.avgRisk;
    const riskStatus = avg <= 0.33 ? "green" : avg <= 0.66 ? "yellow" : "red";
    return [
      { label: "System", status: "green", sub: "All systems nominal" },
      { label: "Overall risk", status: riskStatus, sub: `${Math.round(avg * 100)}% avg` },
      { label: "API", status: error ? "red" : "green", sub: error ? "Unreachable" : "Connected" },
    ];
  }, [kpis.avgRisk, error]);

  const regionRisks = useMemo((): RegionRisk[] => {
    if (events.length === 0) {
      return REGION_NAMES.map((r) => ({ region: r, risk: 0, count: 0 }));
    }
    return REGION_NAMES.map((region, i) => {
      const regionEvents = events.filter((_, j) => j % REGION_NAMES.length === i);
      const risk = regionEvents.length
        ? regionEvents.reduce((a, e) => a + e.pRisk, 0) / regionEvents.length
        : 0;
      return { region, risk, count: regionEvents.length };
    });
  }, [events]);

  const trackSegments = useMemo(() => {
    const segs = Array.from({ length: 24 }, (_, i) => ({
      segmentId: `S${i + 1}`,
      risk: events.length
        ? events[i % events.length]?.pRisk ?? 0.1 + (i % 5) * 0.15
        : 0.1 + (i % 5) * 0.15,
    }));
    return segs;
  }, [events]);

  useEffect(() => {
    const t = setInterval(() => {
      setTelemetry((prev) => [
        { ...prev[0], value: Math.round(20 + Math.random() * 80), status: "green" as const },
        { ...prev[1], value: String(events.length), status: events.length > 10 ? "yellow" : "green" },
        prev[2],
      ]);
    }, 4000);
    return () => clearInterval(t);
  }, [events.length]);

  useEffect(() => {
    if (!replayPlaying || sortedEvents.length === 0) return;
    const id = setInterval(() => {
      setReplayIndex((i) => (i + 1) % Math.max(1, sortedEvents.length));
    }, 1500);
    return () => clearInterval(id);
  }, [replayPlaying, sortedEvents.length]);

  const updateFeature = useCallback((idx: number, value: number) => {
    setFeatures((f) => {
      const copy = [...f];
      copy[idx] = value;
      return copy;
    });
  }, []);

  const predict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<RiskResponse>("/predict/risk", { features });
      const pRisk = res.data.probabilities?.[1] ?? 0;
      const ev: RiskEvent = {
        id: uid(),
        ts: new Date().toISOString(),
        features,
        prediction: res.data.prediction,
        pRisk,
      };
      setEvents((prev) => [...prev, ev]);
    } catch (e: any) {
      const isNetworkError =
        e?.code === "ERR_NETWORK" ||
        e?.message === "Network Error" ||
        (e?.response == null && e?.request != null);
      const message = isNetworkError
        ? "Backend not reachable. Start it from the backend folder: python -m app.main"
        : e?.response?.data?.detail ?? e?.message ?? "Request failed";
      setError(typeof message === "string" ? message : JSON.stringify(message));
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReplaySeek = useCallback((index: number) => {
    setReplayIndex(index);
    setReplayPlaying(false);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial", background: "#fafafa", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/logo.jpg" alt="BNSF Railway" style={{ height: 48, width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>RailOps Command Center</div>
          <div style={{ opacity: 0.7 }}>Enterprise Rail Safety Risk Prediction Dashboard by Ramakanth</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <StatusIndicators indicators={statusIndicators} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14, marginTop: 18 }}>
        <KPICard title="Total Predictions" value={String(kpis.total)} />
        <KPICard title="Average Risk" value={`${Math.round(kpis.avgRisk * 100)}%`} sub="Across this session" />
        <KPICard title="High Risk Alerts" value={String(kpis.highCount)} sub="Risk ≥ 85%" />
        <KPICard title="Backend Status" value={error ? "Offline" : "Healthy"} sub="FastAPI @ :8001" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <MultiRegionRiskView regions={regionRisks} />
        <SystemTelemetryMonitor metrics={telemetry} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14, marginTop: 14 }}>
        <RiskTrendChart events={events} />
        <RiskGauge pRisk={latest?.pRisk ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <LiveIncidentFeed incidents={incidents} />
        <AIRecommendationsPanel recommendations={MOCK_RECOMMENDATIONS} />
      </div>

      <div style={{ marginTop: 14 }}>
        <TrackRiskHeatmap segments={trackSegments} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e6e6e6",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Risk Prediction Console</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>
            Enter the 5 rail risk factors below; then click Predict Risk to get a live prediction.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {features.map((v, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#333" }} title={RISK_FEATURE_LABELS[i].hint}>
                  {RISK_FEATURE_LABELS[i].name}
                </label>
                <input
                  type="number"
                  value={v}
                  onChange={(e) => updateFeature(i, Number(e.target.value))}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                  placeholder={RISK_FEATURE_LABELS[i].placeholder}
                  title={RISK_FEATURE_LABELS[i].hint}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <button
              onClick={predict}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Predicting..." : "Predict Risk"}
            </button>
            {error && <div style={{ color: "crimson", fontSize: 13 }}>{error}</div>}
          </div>
          {latest && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                Latest Prediction: {latest.prediction} (Risk {Math.round(latest.pRisk * 100)}%)
              </div>
              <div style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                Timestamp: {latest.ts.replace("T", " ").slice(0, 19)}
              </div>
            </div>
          )}
        </div>
        <AlertsTable events={events} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <LiveStreamingPredictions events={events} />
        <EventReplayTimeline
          events={events}
          currentIndex={replayIndex}
          onSeek={handleReplaySeek}
          isPlaying={replayPlaying}
          onPlayPause={() => setReplayPlaying((p) => !p)}
        />
      </div>
    </div>
  );
}
