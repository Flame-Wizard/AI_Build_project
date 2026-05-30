from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from schemas import ProphetResponse, InsightsResponse, TrendResponse
from models.forecasting import generate_forecast, get_trend_analysis
from models.insights import generate_insights

app = FastAPI(title="DataBox Analytics API")

# Allow Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Netlify dynamic preview URLs
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory storage for the uploaded dataframe (for demo purposes)
# In production, you'd store this in a database or cloud storage
global_df = pd.DataFrame()
global_forecast_cache = []

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    global global_df
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        global_df = pd.read_csv(io.BytesIO(contents))
        return {"message": f"Successfully uploaded {file.filename} with {len(global_df)} rows."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/api/forecast/prophet", response_model=ProphetResponse)
async def get_prophet_forecast():
    global global_df, global_forecast_cache
    # If no data is uploaded, use some default dummy data to prevent frontend crash
    if global_df.empty:
        dummy_data = pd.DataFrame({
            'date': pd.date_range(start='2023-01-01', periods=30, freq='D'),
            'demand': [100 + (i * 2) + (i % 5 * 10) for i in range(30)]
        })
        forecast = generate_forecast(dummy_data, periods=14)
    else:
        forecast = generate_forecast(global_df, periods=14)
    
    global_forecast_cache = forecast
    return {"data": forecast}

@app.get("/api/analytics/trend", response_model=TrendResponse)
async def get_trend():
    global global_df
    if global_df.empty:
        dummy_data = pd.DataFrame({
            'date': pd.date_range(start='2023-01-01', periods=30, freq='D'),
            'demand': [100 + (i * 2) + (i % 5 * 10) for i in range(30)]
        })
        trend = get_trend_analysis(dummy_data)
    else:
        trend = get_trend_analysis(global_df)
        
    return trend

@app.get("/api/insights", response_model=InsightsResponse)
async def get_insights():
    global global_df, global_forecast_cache
    if global_df.empty:
        dummy_data = pd.DataFrame({
            'date': pd.date_range(start='2023-01-01', periods=30, freq='D'),
            'demand': [100 + (i * 2) + (i % 5 * 10) for i in range(30)]
        })
        insights = generate_insights(dummy_data, [])
    else:
        insights = generate_insights(global_df, global_forecast_cache)
        
    return {"insights": insights}
