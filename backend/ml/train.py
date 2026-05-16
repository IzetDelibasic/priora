"""
Run this script once to train and save the triage model.

Usage:
    1. Download dataset from Kaggle:
       https://www.kaggle.com/datasets/maalona/hospital-triage-and-patient-history-data
    2. Place 'triage.csv' in backend/ml/data/
    3. Run: python -m ml.train
"""

import os
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from xgboost import XGBClassifier

from ml.preprocessing import (
    build_preprocessor,
    clean_dataset,
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    TARGET,
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "triage.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "triage_model.joblib")


def train():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH, low_memory=False)
    print(f"  Raw rows: {len(df):,}")

    print("Cleaning dataset...")
    df = clean_dataset(df)
    print(f"  Clean rows: {len(df):,}")
    print(f"  ESI distribution:\n{df[TARGET].value_counts().sort_index()}")

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET] - 1

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = build_preprocessor()

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            use_label_encoder=False,
            eval_metric="mlogloss",
            random_state=42,
            n_jobs=-1,
        )),
    ])

    print("Training XGBoost model...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest accuracy: {acc:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, y_pred, target_names=[f"ESI {i}" for i in range(1, 6)]))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")


if __name__ == "__main__":
    train()
