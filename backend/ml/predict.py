import os
import joblib
import pandas as pd
import numpy as np
from dataclasses import dataclass

from ml.preprocessing import (
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    ESI_LABELS,
    ESI_COLORS,
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "triage_model.joblib")

# Module-level cache so the model is loaded from disk only once per process.
_model = None


def _load_model():
    """Load the trained pipeline from disk, caching it after the first call.

    Raises FileNotFoundError if the model file has not been created yet —
    the caller should run ml.train to generate it.
    """
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
    1: "HITNO: Odmah aktivirati tim za reanimaciju. Pacijent zahtijeva intervenciju koja spašava život.",
    2: "URGENTNO: Odmah rasporediti u sobu za liječenje. Pregled ljekara u roku od 10 minuta.",
    3: "ŽURNO: Pacijent stabilan, ali treba više resursa. Pregled u roku od 30 minuta.",
    4: "MANJE ŽURNO: Potreban jedan resurs. Pregled u roku od 1-2 sata.",
    5: "NIJE URGENTNO: Rutinska njega. Pregled u roku od 2-4 sata ili uputiti u primarnu zdravstvenu zaštitu.",
}


def predict_triage(input_data: TriageInput) -> TriageResult:
    """Run the trained XGBoost pipeline on a single patient record.

    Steps:
    1. Build a one-row DataFrame matching the feature schema used at training.
    2. Call model.predict to get the ESI class (0-indexed internally, 1-5 externally).
    3. Call model.predict_proba to get per-class probabilities.
    4. Round probabilities to one decimal place and find the confidence (max prob).
    5. Return a TriageResult with the ESI level, label, recommendation and probs.
    """
    model = _load_model()

    # Chief complaint must be lowercase/stripped to match training encoding.
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

    # Model outputs class indices 0-4; add 1 to get the ESI level 1-5.
    esi_pred = int(model.predict(df)[0]) + 1
    proba = model.predict_proba(df)[0]

    # Convert raw probabilities (0-1) to percentage rounded to 1 decimal.
    probabilities = {i + 1: round(float(p) * 100, 1) for i, p in enumerate(proba)}
    # Confidence = probability of the predicted class.
    confidence = round(float(np.max(proba)) * 100, 1)

    return TriageResult(
        esi_level=esi_pred,
        label=ESI_LABELS[esi_pred],
        color=ESI_COLORS[esi_pred],
        confidence=confidence,
        probabilities=probabilities,
        recommendation=RECOMMENDATIONS[esi_pred],
    )
