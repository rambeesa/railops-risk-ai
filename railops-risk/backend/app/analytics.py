"""
Analytics and reporting for rail safety risk.
"""
import pandas as pd


def risk_summary(df: pd.DataFrame, risk_col: str = "risk") -> dict:
    """
    Compute summary statistics for risk values.

    Args:
        df: DataFrame with risk predictions or scores.
        risk_col: Name of the risk column.

    Returns:
        Dict with count, mean, std, min, max, and optional quantiles.
    """
    if risk_col not in df.columns or df.empty:
        return {}
    s = df[risk_col]
    return {
        "count": int(s.count()),
        "mean": float(s.mean()),
        "std": float(s.std()) if s.count() > 1 else 0.0,
        "min": float(s.min()),
        "max": float(s.max()),
    }


def aggregate_by(df: pd.DataFrame, group_col: str, value_col: str, agg: str = "mean") -> pd.DataFrame:
    """Aggregate risk (or other metric) by a grouping column."""
    return df.groupby(group_col)[value_col].agg(agg).reset_index()
