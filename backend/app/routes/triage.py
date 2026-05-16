from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ml.predict import predict_triage, TriageInput


router = APIRouter()


class TriageRequest(BaseModel):
    age: float = Field(..., ge=0, le=120, description="Patient age in years")
    pulse: float = Field(..., ge=0, le=300, description="Heart rate in bpm")
    sbp: float = Field(..., ge=0, le=300, description="Systolic blood pressure mmHg")
    dbp: float = Field(..., ge=0, le=200, description="Diastolic blood pressure mmHg")
    temperature: float = Field(..., ge=30.0, le=45.0, description="Body temperature in Celsius")
    spo2: float = Field(..., ge=0, le=100, description="Oxygen saturation %")
    resprate: float = Field(..., ge=0, le=60, description="Respiratory rate breaths/min")
    pain: float = Field(..., ge=0, le=10, description="Pain scale 0-10")
    chiefcomplaint: str = Field(..., min_length=1, description="Main symptom or complaint")


class TriageResponse(BaseModel):
    esi_level: int
    label: str
    color: str
    confidence: float
    probabilities: dict[int, float]
    recommendation: str


@router.post("/triage", response_model=TriageResponse)
async def triage(request: TriageRequest):
    try:
        result = predict_triage(TriageInput(
            age=request.age,
            pulse=request.pulse,
            sbp=request.sbp,
            dbp=request.dbp,
            temperature=request.temperature,
            spo2=request.spo2,
            resprate=request.resprate,
            pain=request.pain,
            chiefcomplaint=request.chiefcomplaint,
        ))
        return TriageResponse(
            esi_level=result.esi_level,
            label=result.label,
            color=result.color,
            confidence=result.confidence,
            probabilities=result.probabilities,
            recommendation=result.recommendation,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Triage error: {str(e)}")
