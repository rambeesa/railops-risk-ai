"""
Model training for rail safety risk prediction.
"""
import joblib
from pathlib import Path


def train_model(X, y, model=None, model_dir: str | Path = "models"):
    """
    Train a risk prediction model.

    Args:
        X: Feature matrix.
        y: Target (e.g. risk level or score).
        model: Sklearn-compatible estimator (optional).
        model_dir: Directory to save the trained model.

    Returns:
        Fitted model and optional metrics.
    """
    if model is None:
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier(n_estimators=100, random_state=42)

    model.fit(X, y)
    Path(model_dir).mkdir(parents=True, exist_ok=True)
    path = Path(model_dir) / "risk_model.joblib"
    joblib.dump(model, path)
    return model


def load_model(model_path: str | Path = "models/risk_model.joblib"):
    """Load a trained model from disk."""
    return joblib.load(model_path)


if __name__ == "__main__":
    import numpy as np
    from pathlib import Path

    # Default: train on dummy data; override with data/ CSV if present
    base = Path(__file__).resolve().parent.parent
    data_dir = base.parent / "data"
    model_dir = base.parent / "models"

    data_path = data_dir / "train.csv"
    if data_path.exists():
        import pandas as pd
        from app.features import build_features
        df = pd.read_csv(data_path)
        # Assume last column or 'risk' is target; rest are features
        if "risk" in df.columns:
            y = df["risk"].values
            X = build_features(df.drop(columns=["risk"])).values
        else:
            y = df.iloc[:, -1].values
            X = build_features(df.iloc[:, :-1]).values
        print(f"Training on {data_path} ({len(X)} samples)")
    else:
        np.random.seed(42)
        n = 200
        X = np.random.randn(n, 5)
        y = (X[:, 0] + 0.3 * X[:, 1] - 0.2 * X[:, 2] > 0).astype(int)
        print(f"Training on dummy data ({n} samples)")

    model = train_model(X, y, model_dir=model_dir)
    out = model_dir / "risk_model.joblib"
    print(f"Model saved to {out}")
