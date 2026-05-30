from pydantic import BaseModel
from typing import List, Optional, Any

class ProphetDataPoint(BaseModel):
    date: str
    actual: Optional[float]
    yhat: float
    lower: float
    upper: float

class ProphetResponse(BaseModel):
    data: List[ProphetDataPoint]

class InsightData(BaseModel):
    title: str
    description: str
    type: str # warning, success, info
    icon_type: str # Zap, CheckCircle, Clock

class InsightsResponse(BaseModel):
    insights: List[InsightData]

class TrendDataPoint(BaseModel):
    date: str
    value: float
    trend: float

class TrendResponse(BaseModel):
    data: List[TrendDataPoint]
    average_value: float
    trend_percentage: float
