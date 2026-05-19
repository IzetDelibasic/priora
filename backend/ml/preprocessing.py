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
    "pain",
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
    """Build the sklearn ColumnTransformer used for both training and inference.

    Numeric pipeline:
    - SimpleImputer(median): fills missing values with the column median.
    - StandardScaler: zero-mean, unit-variance normalisation.

    Categorical pipeline:
    - SimpleImputer(most_frequent): fills missing chief complaints with mode.
    - OneHotEncoder(handle_unknown='ignore'): encodes known categories;
      unseen values at inference time produce an all-zero row (no crash).
    """
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
    """Normalise and filter a raw dataset DataFrame for training.

    Steps:
    1. Lowercase and strip all column names for consistent access.
    2. Keep only the feature columns + target; drop everything else.
    3. Coerce ESI target to numeric and drop rows where it is null/invalid.
    4. Keep only rows with ESI 1-5 (discard out-of-range labels).
    5. Coerce all numeric feature columns to float (errors become NaN for imputer).
    6. Fill missing chief complaints with 'unknown' and normalise case.
    """
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
