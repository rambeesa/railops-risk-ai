from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="RailOps Risk API",
    description="Rail safety risk prediction and analytics",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["default"])
def root():
    return {
        "service": "RailOps Risk API",
        "status": "ok",
        "docs": "http://127.0.0.1:8001/docs",
        "endpoints": ["/", "/health", "/predict/risk"],
    }


@app.get("/health", tags=["default"])
def health():
    return {"status": "healthy"}


# --- Risk prediction (model expects 5 features from train.py dummy data) ---
class RiskFeatures(BaseModel):
    features: list[float]  # e.g. [f1, f2, f3, f4, f5]


def _get_risk_model():
    backend_dir = Path(__file__).resolve().parent.parent
    # Prefer railops-risk/models (same as app.train), fallback to backend/models
    model_path = backend_dir.parent / "models" / "risk_model.joblib"
    if not model_path.exists():
        model_path = backend_dir / "models" / "risk_model.joblib"
    if not model_path.exists():
        raise HTTPException(500, "Risk model not found. Run: python -m app.train")
    from app.train import load_model
    return load_model(model_path)


@app.post("/predict/risk", tags=["default"])
def predict_risk(body: RiskFeatures):
    """Predict risk class (0 or 1) from a feature vector of length 5."""
    model = _get_risk_model()
    import numpy as np
    X = np.array([body.features], dtype=float)
    n_features = model.n_features_in_ if hasattr(model, "n_features_in_") else 5
    if X.shape[1] != n_features:
        raise HTTPException(400, f"Expected {n_features} features, got {len(body.features)}")
    pred = model.predict(X)[0]
    proba = getattr(model, "predict_proba", None)
    if proba is not None:
        proba = proba(X)[0].tolist()
    return {"prediction": int(pred), "probabilities": proba}


if __name__ == "__main__":
    import sys
    from pathlib import Path
    backend = Path(__file__).resolve().parent.parent
    if str(backend) not in sys.path:
        sys.path.insert(0, str(backend))
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)