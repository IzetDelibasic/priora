"""
Downloads the triage dataset from Kaggle automatically.

Setup (one-time):
    1. Go to https://www.kaggle.com/settings → API → "Create New Token"
    2. This downloads kaggle.json — place it at: C:/Users/<YOU>/.kaggle/kaggle.json
       OR set environment variables in your .env file:
       KAGGLE_USERNAME=your_username
       KAGGLE_KEY=your_api_key

Usage:
    python -m ml.download_data
"""

import os
import zipfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATASET_SLUG = "maalona/hospital-triage-and-patient-history-data"
DATA_DIR = Path(__file__).parent / "data"
CSV_NAME = "triage.csv"


def download():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    target = DATA_DIR / CSV_NAME
    if target.exists():
        print(f"Dataset already exists at {target} — skipping download.")
        return

    kaggle_username = os.getenv("KAGGLE_USERNAME")
    kaggle_key = os.getenv("KAGGLE_KEY")

    if kaggle_username and kaggle_key:
        os.environ["KAGGLE_USERNAME"] = kaggle_username
        os.environ["KAGGLE_KEY"] = kaggle_key
        print("Using Kaggle credentials from environment variables.")
    else:
        kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
        if not kaggle_json.exists():
            print(
                "ERROR: Kaggle credentials not found.\n"
                "Options:\n"
                "  A) Place kaggle.json at: C:/Users/<YOU>/.kaggle/kaggle.json\n"
                "     (Download from: https://www.kaggle.com/settings → API → Create New Token)\n"
                "  B) Add to backend/.env:\n"
                "     KAGGLE_USERNAME=your_username\n"
                "     KAGGLE_KEY=your_api_key"
            )
            return
        print(f"Using Kaggle credentials from {kaggle_json}")

    try:
        import kaggle
    except ImportError:
        print("ERROR: kaggle package not installed. Run: pip install -r requirements.txt")
        return

    print(f"Downloading dataset: {DATASET_SLUG} ...")
    kaggle.api.authenticate()
    kaggle.api.dataset_download_files(
        DATASET_SLUG,
        path=str(DATA_DIR),
        unzip=False,
    )

    zip_files = list(DATA_DIR.glob("*.zip"))
    if zip_files:
        zip_path = zip_files[0]
        print(f"Extracting {zip_path.name} ...")
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(DATA_DIR)
        zip_path.unlink()
        print("Zip file removed.")

    csv_files = list(DATA_DIR.glob("*.csv"))
    if not csv_files:
        print("ERROR: No CSV file found after extraction. Check the dataset contents.")
        return

    if len(csv_files) == 1 and csv_files[0].name != CSV_NAME:
        csv_files[0].rename(DATA_DIR / CSV_NAME)
        print(f"Renamed {csv_files[0].name} → {CSV_NAME}")

    print(f"\nDataset ready at: {DATA_DIR / CSV_NAME}")
    print("You can now run: python -m ml.train")


if __name__ == "__main__":
    download()
