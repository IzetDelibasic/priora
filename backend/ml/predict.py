import os
import joblib
import pandas as pd
import numpy as np
from dataclasses import dataclass
from typing import Optional

from ml.preprocessing import (
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    ESI_LABELS,
    ESI_COLORS,
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "triage_model.joblib")

_model = None


def _load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Trained model not found at {MODEL_PATH}. "
                "Run 'python -m ml.train' first."
            )
        _model = joblib.load(MODEL_PATH)
    return _model


@dataclass
class TriageInput:
    age: float
    pulse: float
    sbp: float
    dbp: float
    temperature: float
    spo2: float
    resprate: float
    pain: float
    chiefcomplaint: str


@dataclass
class TriageResult:
    esi_level: int
    label: str
    color: str
    confidence: float
    probabilities: dict[int, float]
    recommendation: str


RECOMMENDATIONS = {
    1: "IMMEDIATE: Activate resuscitation team now. Patient requires life-saving intervention.",
    2: "EMERGENT: Assign to treatment room immediately. Physician assessment within 10 minutes.",
    3: "URGENT: Patient stable but needs multiple resources. Assessment within 30 minutes.",
    4: "LESS URGENT: One resource needed. Assessment within 1-2 hours.",
    5: "NON-URGENT: Routine care. Assessment within 2-4 hours or refer to primary care.",
}


def predict_triage(input_data: TriageInput) -> TriageResult:
    model = _load_model()

    row = {
        "age": input_data.age,
        "pulse": input_data.pulse,
        "sbp": input_data.sbp,
        "dbp": input_data.dbp,
        "temperature": input_data.temperature,
        "spo2": input_data.spo2,
        "resprate": input_data.resprate,
        "pain": input_data.pain,
        "chiefcomplaint": input_data.chiefcomplaint.lower().strip(),
    }

    df = pd.DataFrame([row])

    esi_pred = int(model.predict(df)[0]) + 1
    proba = model.predict_proba(df)[0]

    probabilities = {i + 1: round(float(p) * 100, 1) for i, p in enumerate(proba)}
    confidence = round(float(np.max(proba)) * 100, 1)

    return TriageResult(
        esi_level=esi_pred,
        label=ESI_LABELS[esi_pred],
        color=ESI_COLORS[esi_pred],
        confidence=confidence,
        probabilities=probabilities,
        recommendation=RECOMMENDATIONS[esi_pred],
    )
