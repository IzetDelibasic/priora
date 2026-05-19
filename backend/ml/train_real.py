import os
import joblib
import pandas as pd
import pyreadr
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBClassifier

from ml.preprocessing import CATEGORICAL_FEATURES, TARGET

RDATA_PATH = os.path.join(os.path.dirname(__file__), "data", "5v_cleandf.rdata")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "triage_model.joblib")

NUMERIC_FEATURES = ["age", "pulse", "sbp", "dbp", "temperature", "spo2", "resprate"]


def build_preprocessor():
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


def extract_chief_complaint(df):
    cc_cols = [c for c in df.columns if c.startswith("cc_")]
    cc_df = df[cc_cols].apply(pd.to_numeric, errors="coerce").fillna(0).astype(int)
    mask = cc_df == 1
    has_any = mask.any(axis=1)
    result = pd.Series("other", index=df.index)
    result[has_any] = (
        mask[has_any]
        .idxmax(axis=1)
        .str.replace("^cc_", "", regex=True)
        .str.replace(r"[-_]", " ", regex=True)
    )
    return result


def load_and_prepare():
    print("Loading real dataset from .rdata file...")
    r = pyreadr.read_r(RDATA_PATH)
    df = list(r.values())[0]
    print(f"  Raw rows: {len(df):,}")

    result = pd.DataFrame(index=df.index)
    result["age"] = pd.to_numeric(df["age"], errors="coerce")
    result["pulse"] = pd.to_numeric(df["triage_vital_hr"], errors="coerce")
    result["sbp"] = pd.to_numeric(df["triage_vital_sbp"], errors="coerce")
    result["dbp"] = pd.to_numeric(df["triage_vital_dbp"], errors="coerce")
    temp_f = pd.to_numeric(df["triage_vital_temp"], errors="coerce")
    result["temperature"] = (temp_f - 32) * 5 / 9
    result["spo2"] = pd.to_numeric(df["triage_vital_o2"], errors="coerce")
    result["resprate"] = pd.to_numeric(df["triage_vital_rr"], errors="coerce")

    print("  Extracting chief complaints from binary flags...")
    result["chiefcomplaint"] = extract_chief_complaint(df)

    result["esi"] = pd.to_numeric(df["esi"], errors="coerce")
    result = result.dropna(subset=["esi", "age"])
    result["esi"] = result["esi"].astype(int)
    result = result[result["esi"].between(1, 5)]

    print(f"  Clean rows: {len(result):,}")
    print(f"  ESI distribution:\n{result['esi'].value_counts().sort_index()}")
    return result


def train():
    df = load_and_prepare()

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET] - 1

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = Pipeline([
        ("preprocessor", build_preprocessor()),
        ("classifier", XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            eval_metric="mlogloss",
            random_state=42,
            n_jobs=-1,
        )),
    ])

    print("Training XGBoost model on real data...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest accuracy: {acc:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, y_pred, target_names=[f"ESI {i}" for i in range(1, 6)]))

    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")


if __name__ == "__main__":
    train()
