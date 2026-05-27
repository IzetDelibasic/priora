import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
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
]

CATEGORICAL_FEATURES = [
    "chiefcomplaint",
]

TARGET = "esi"

ESI_LABELS = {
    1: "Reanimacija - Potrebna hitna intervencija za spašavanje života",
    2: "Urgentno - Visoki rizik, ne smije čekati",
    3: "Žurno - Stabilan, ali zahtijeva više resursa",
    4: "Manje žurno - Potreban jedan resurs",
    5: "Nije urgentno - Nisu potrebni resursi",
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

    # Normalise column names to lowercase with no leading/trailing spaces.
    df.columns = df.columns.str.lower().str.strip()

    df = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES + [TARGET]].copy()

    # Drop rows where ESI target is missing or not a valid integer 1-5.
    df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
    df = df.dropna(subset=[TARGET])
    df[TARGET] = df[TARGET].astype(int)
    df = df[df[TARGET].between(1, 5)]

    # Coerce numeric columns; non-parsable strings become NaN for the imputer.
    for col in NUMERIC_FEATURES:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Standardise chief complaint text to match inference-time normalisation.
    df["chiefcomplaint"] = df["chiefcomplaint"].fillna("unknown").str.lower().str.strip()

    return df
