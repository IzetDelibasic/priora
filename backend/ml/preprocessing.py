import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder


NUMERIC_FEATURES = [
    "age",
    "pulse",
    "sbp",
    "dbp",
    "temperature",
    "spo2",
    "resprate",
    "pain",
]

CATEGORICAL_FEATURES = [
    "chiefcomplaint",
]

TARGET = "esi"

ESI_LABELS = {
    1: "Resuscitation — Immediate life-saving intervention required",
    2: "Emergent — High risk, should not wait",
    3: "Urgent — Stable but requires multiple resources",
    4: "Less Urgent — One resource needed",
    5: "Non-Urgent — No resources needed",
}

ESI_COLORS = {
    1: "red",
    2: "orange",
    3: "yellow",
    4: "green",
    5: "blue",
}


def build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    return ColumnTransformer([
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ])


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df.columns = df.columns.str.lower().str.strip()

    df = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES + [TARGET]].copy()

    df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
    df = df.dropna(subset=[TARGET])
    df[TARGET] = df[TARGET].astype(int)
    df = df[df[TARGET].between(1, 5)]

    for col in NUMERIC_FEATURES:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["chiefcomplaint"] = df["chiefcomplaint"].fillna("unknown").str.lower().str.strip()

    return df
