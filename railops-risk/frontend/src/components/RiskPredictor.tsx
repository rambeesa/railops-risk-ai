import { useState } from "react";
import axios from "axios";

export default function RiskPredictor() {

  const [features, setFeatures] = useState<number[]>([0, 0, 0, 0, 0]);
  const [result, setResult] = useState<any>(null);

  const updateFeature = (index: number, value: number) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const predict = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8001/predict/risk",
        { features }
      );
      setResult(res.data);
    } catch (error) {
      console.error("Error predicting risk:", error);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Risk Prediction Tool</h2>

      {features.map((_, i) => (
        <input
          key={i}
          type="number"
          placeholder={`Feature ${i + 1}`}
          onChange={(e) => updateFeature(i, Number(e.target.value))}
          style={{ margin: 5 }}
        />
      ))}

      <br />

      <button onClick={predict}>Predict Risk</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Prediction: {result.prediction}</h3>
          <p>
            Confidence: {(Math.max(...result.probabilities) * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}
