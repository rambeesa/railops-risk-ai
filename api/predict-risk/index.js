const axios = require("axios");

const AML_SCORING_URL = process.env.AZUREML_SCORING_URL || "";
const AML_API_KEY = process.env.AZUREML_API_KEY || "";

module.exports = async function (context, req) {
  if (!AML_SCORING_URL || !AML_API_KEY) {
    context.res = {
      status: 503,
      body: {
        error:
          "Backend not configured. Set AZUREML_SCORING_URL and AZUREML_API_KEY in Static Web App Configuration.",
      },
      headers: { "Content-Type": "application/json" },
    };
    return;
  }

  const features = req.body?.features;
  if (!Array.isArray(features) || features.length !== 5) {
    context.res = {
      status: 400,
      body: { error: "Expected body: { features: number[5] }" },
      headers: { "Content-Type": "application/json" },
    };
    return;
  }

  try {
    // score.py accepts {"features": [f1, f2, f3, f4, f5]}
    const payload = { features };
    const { data } = await axios.post(AML_SCORING_URL, payload, {
      headers: {
        Authorization: `Bearer ${AML_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
    // run() returns a list e.g. [0] or [1]; Azure may wrap it
    const raw = Array.isArray(data) ? data : data?.result ?? data?.predict ?? data?.output ?? data;
    const predList = Array.isArray(raw) ? raw : [raw];
    const prediction = Number(predList[0]);
    const probabilities = data?.probabilities ?? data?.predict_proba ?? null;
    context.res = {
      status: 200,
      body: { prediction, probabilities },
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    context.res = {
      status: 502,
      body: {
        error: "Scoring failed",
        detail: err.response?.data?.error ?? err.message,
      },
      headers: { "Content-Type": "application/json" },
    };
  }
};
