export type RiskResponse = {
  prediction: number;
  probabilities: number[];
};

export type RiskEvent = {
  id: string;
  ts: string;
  features: number[];
  prediction: number;
  pRisk: number;
};

export type Incident = {
  id: string;
  ts: string;
  severity: "low" | "medium" | "high" | "critical";
  type: string;
  location: string;
  description: string;
};

export type TelemetryMetric = {
  label: string;
  value: string | number;
  unit?: string;
  status: "green" | "yellow" | "red";
};

export type RegionRisk = {
  region: string;
  risk: number;
  count: number;
};

