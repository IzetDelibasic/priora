import json
from langchain.tools import Tool
from datetime import datetime


def get_current_datetime(_: str = "") -> str:
    return datetime.now().strftime("%d.%m.%Y %H:%M:%S")


def calculate(expression: str) -> str:
    try:
        allowed = set("0123456789+-*/()., ")
        if not all(c in allowed for c in expression):
            return "Error: Expression contains invalid characters."
        result = eval(expression)  # noqa: S307
        return str(result)
    except Exception as e:
        return f"Calculation error: {str(e)}"


def assess_triage(input_json: str) -> str:
    """
    Runs the ML triage model and returns the ESI level with recommendation.
    Input must be a JSON string with keys:
      age, pulse, sbp, dbp, temperature, spo2, resprate, pain, chiefcomplaint
    """
    try:
        from ml.predict import predict_triage, TriageInput

        data = json.loads(input_json)
        triage_input = TriageInput(
            age=float(data["age"]),
            pulse=float(data["pulse"]),
            sbp=float(data["sbp"]),
            dbp=float(data["dbp"]),
            temperature=float(data["temperature"]),
            spo2=float(data["spo2"]),
            resprate=float(data["resprate"]),
            pain=float(data["pain"]),
            chiefcomplaint=str(data["chiefcomplaint"]),
        )

        result = predict_triage(triage_input)

        return (
            f"ESI Level: {result.esi_level}/5 — {result.label}\n"
            f"Confidence: {result.confidence}%\n"
            f"Recommendation: {result.recommendation}\n"
            f"Probability breakdown: {result.probabilities}"
        )
    except FileNotFoundError:
        return (
            "ML model not trained yet. "
            "Download the dataset from Kaggle and run 'python -m ml.train'."
        )
    except (KeyError, ValueError) as e:
        return f"Invalid input: {str(e)}. Required fields: age, pulse, sbp, dbp, temperature, spo2, resprate, pain, chiefcomplaint."
    except Exception as e:
        return f"Triage assessment error: {str(e)}"


def get_tools() -> list[Tool]:
    return [
        Tool(
            name="get_datetime",
            func=get_current_datetime,
            description="Use when the user asks for the current date or time.",
        ),
        Tool(
            name="calculator",
            func=calculate,
            description="Use for mathematical calculations. Input is a math expression.",
        ),
        Tool(
            name="assess_triage",
            func=assess_triage,
            description=(
                "Assess patient triage level using the ML model. "
                "Input must be a JSON string with these fields: "
                "age (years), pulse (bpm), sbp (systolic BP mmHg), dbp (diastolic BP mmHg), "
                "temperature (Celsius), spo2 (oxygen saturation %), resprate (breaths/min), "
                "pain (0-10 scale), chiefcomplaint (text describing main symptom). "
                "Returns ESI triage level 1-5 and clinical recommendation."
            ),
        ),
    ]
