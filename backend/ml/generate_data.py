import numpy as np
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
OUTPUT_PATH = DATA_DIR / "triage.csv"
N_SAMPLES = 60_000
RANDOM_STATE = 42

rng = np.random.default_rng(RANDOM_STATE)

ESI_WEIGHTS = [0.02, 0.15, 0.43, 0.25, 0.15]

CHIEF_COMPLAINTS = {
    1: [
        "cardiac arrest", "respiratory failure", "unresponsive", "severe trauma",
        "active seizure", "anaphylaxis", "stroke with altered consciousness",
        "major hemorrhage", "unconscious", "code blue",
    ],
    2: [
        "chest pain", "shortness of breath", "severe abdominal pain",
        "altered mental status", "stroke symptoms", "severe allergic reaction",
        "overdose", "sepsis", "high fever with stiff neck", "acute MI",
        "severe headache sudden onset", "near drowning", "severe burns",
    ],
    3: [
        "abdominal pain", "back pain", "headache", "dizziness", "vomiting",
        "urinary tract infection", "dehydration", "asthma attack",
        "diabetes complication", "pneumonia", "fracture", "chest tightness",
        "nausea and vomiting", "flank pain", "palpitations",
    ],
    4: [
        "ear pain", "sore throat", "mild rash", "sprain", "minor laceration",
        "dental pain", "eye redness", "constipation", "mild fever",
        "cough", "upper respiratory infection", "minor burn", "insect bite",
    ],
    5: [
        "prescription refill", "medication question", "minor bruise",
        "common cold symptoms", "routine check", "suture removal",
        "rash follow up", "mild skin irritation", "blister", "anxiety",
    ],
}

VITALS = {
    1: {
        "age":         (55, 20, 0, 100),
        "pulse":       (120, 35, 30, 200),
        "sbp":         (80, 30, 50, 220),
        "dbp":         (50, 20, 30, 130),
        "temperature": (38.5, 1.2, 34.0, 41.5),
        "spo2":        (82, 10, 50, 100),
        "resprate":    (28, 8, 6, 50),
        "pain":        (8, 2, 0, 10),
    },
    2: {
        "age":         (58, 18, 1, 100),
        "pulse":       (108, 25, 45, 180),
        "sbp":         (130, 35, 70, 220),
        "dbp":         (80, 20, 40, 130),
        "temperature": (38.2, 1.0, 35.0, 41.0),
        "spo2":        (91, 6, 70, 100),
        "resprate":    (22, 6, 10, 40),
        "pain":        (8, 2, 4, 10),
    },
    3: {
        "age":         (45, 20, 1, 100),
        "pulse":       (90, 18, 50, 150),
        "sbp":         (128, 20, 90, 200),
        "dbp":         (78, 14, 50, 120),
        "temperature": (37.8, 0.8, 36.0, 40.5),
        "spo2":        (96, 3, 85, 100),
        "resprate":    (18, 4, 12, 30),
        "pain":        (6, 2, 0, 10),
    },
    4: {
        "age":         (35, 18, 1, 95),
        "pulse":       (80, 12, 55, 120),
        "sbp":         (122, 15, 95, 170),
        "dbp":         (74, 10, 50, 110),
        "temperature": (37.3, 0.5, 36.2, 39.5),
        "spo2":        (98, 1.5, 93, 100),
        "resprate":    (16, 2, 12, 22),
        "pain":        (4, 2, 0, 8),
    },
    5: {
        "age":         (30, 15, 1, 90),
        "pulse":       (76, 10, 55, 105),
        "sbp":         (118, 12, 95, 155),
        "dbp":         (72, 9, 50, 105),
        "temperature": (37.0, 0.3, 36.4, 38.5),
        "spo2":        (99, 1, 96, 100),
        "resprate":    (15, 1.5, 12, 20),
        "pain":        (2, 2, 0, 5),
    },
}


def sample_vitals(esi: int, n: int) -> dict:
    v = VITALS[esi]
    result = {}
    for col, (mean, std, lo, hi) in v.items():
        vals = rng.normal(mean, std, n)
        vals = np.clip(vals, lo, hi)
        if col in ("age", "pulse", "sbp", "dbp", "resprate"):
            vals = np.round(vals).astype(int)
        elif col == "pain":
            vals = np.clip(np.round(vals).astype(int), 0, 10)
        else:
            vals = np.round(vals, 1)
        result[col] = vals
    return result


def generate():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if OUTPUT_PATH.exists():
        print(f"Dataset already exists at {OUTPUT_PATH} - skipping generation.")
        return

    print(f"Generating {N_SAMPLES:,} synthetic triage records...")

    counts = (np.array(ESI_WEIGHTS) * N_SAMPLES).astype(int)
    counts[-1] += N_SAMPLES - counts.sum()

    frames = []
    for esi_level in range(1, 6):
        n = counts[esi_level - 1]
        vitals = sample_vitals(esi_level, n)
        complaints = rng.choice(CHIEF_COMPLAINTS[esi_level], n)
        df = pd.DataFrame(vitals)
        df["chiefcomplaint"] = complaints
        df["esi"] = esi_level
        frames.append(df)

    df_all = pd.concat(frames, ignore_index=True)
    df_all = df_all.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)

    df_all.to_csv(OUTPUT_PATH, index=False)
    print(f"Dataset saved: {OUTPUT_PATH}")
    print(f"Shape: {df_all.shape}")
    print(f"\nESI distribution:")
    print(df_all["esi"].value_counts().sort_index())
    print(f"\nSample row:\n{df_all.iloc[0].to_dict()}")
    print("\nYou can now run: python -m ml.train")


if __name__ == "__main__":
    generate()
