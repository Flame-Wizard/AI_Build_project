from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from schemas import ProphetResponse, InsightsResponse, TrendResponse
from models.forecasting import generate_forecast, get_trend_analysis
from models.insights import generate_insights

app = FastAPI(title="DataBox Analytics API")

# Allow Next.js frontend to communicate with FastAPI
# Requires GROQ_API_KEY environment variable for AI insights
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
    try:
        if global_df.empty:
            dummy_data = pd.DataFrame({
                'date': pd.date_range(start='2023-01-01', periods=30, freq='D'),
                'demand': [100 + (i * 2) + (i % 5 * 10) for i in range(30)]
            })
            forecast = generate_forecast(dummy_data, periods=14)
        else:
            # Sample large CSVs to prevent timeout (max 500 rows for Prophet)
            df_sample = global_df if len(global_df) <= 500 else global_df.tail(500)
            forecast = generate_forecast(df_sample, periods=14)
        
        global_forecast_cache = forecast
        return {"data": forecast}
    except Exception as e:
        print(f"[ERROR] Prophet forecast failed: {e}")
        # Return a minimal fallback so frontend doesn't crash
        return {"data": []}

@app.get("/api/analytics/trend", response_model=TrendResponse)
async def get_trend():
    global global_df
    try:
        if global_df.empty:
            dummy_data = pd.DataFrame({
                'date': pd.date_range(start='2023-01-01', periods=30, freq='D'),
                'demand': [100 + (i * 2) + (i % 5 * 10) for i in range(30)]
            })
            return get_trend_analysis(dummy_data)
        else:
            df_sample = global_df if len(global_df) <= 500 else global_df.tail(500)
            return get_trend_analysis(df_sample)
    except Exception as e:
        print(f"[ERROR] Trend analysis failed: {e}")
        return {"data": [], "average_value": 0, "trend_percentage": 0}

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

@app.get("/api/summary")
async def get_summary():
    """Returns high-level KPI metrics computed from the uploaded CSV."""
    global global_df
    if global_df.empty:
        return {
            "row_count": 0,
            "columns": [],
            "metrics": [],
            "has_data": False
        }

    try:
        numeric_cols = [col for col in global_df.columns if pd.api.types.is_numeric_dtype(global_df[col])]
        date_cols = [col for col in global_df.columns if 'date' in col.lower() or 'time' in col.lower()]
        
        metrics = []
        for col in numeric_cols[:4]:  # Show at most 4 KPI metrics
            series = global_df[col].dropna()
            if len(series) >= 2:
                first_half = series.iloc[:len(series)//2].mean()
                second_half = series.iloc[len(series)//2:].mean()
                change_pct = ((second_half - first_half) / first_half * 100) if first_half != 0 else 0
                metrics.append({
                    "title": col.replace('_', ' ').title(),
                    "value": round(series.mean(), 2),
                    "max": round(series.max(), 2),
                    "min": round(series.min(), 2),
                    "total": round(series.sum(), 2),
                    "change": round(change_pct, 1),
                    "changeLabel": "trend vs first half",
                    "count": len(series)
                })
        
        date_range = None
        if date_cols:
            try:
                dates = pd.to_datetime(global_df[date_cols[0]])
                date_range = {
                    "start": dates.min().strftime('%Y-%m-%d'),
                    "end": dates.max().strftime('%Y-%m-%d'),
                    "days": (dates.max() - dates.min()).days
                }
            except:
                pass
        
        return {
            "row_count": len(global_df),
            "columns": list(global_df.columns),
            "metrics": metrics,
            "date_range": date_range,
            "has_data": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@app.get("/api/analytics/pareto")
async def get_pareto():
    """Generates Pareto (80/20) analysis dynamically from the uploaded CSV."""
    global global_df
    try:
        if global_df.empty:
            # Fallback static data
            pareto_data = [
                {"category": "Electronics", "value": 145000},
                {"category": "Apparel", "value": 65000},
                {"category": "Home Goods", "value": 35000},
                {"category": "Sports", "value": 20000},
                {"category": "Beauty", "value": 12000},
            ]
        else:
            # 1. Find a categorical column (string type)
            cat_cols = [col for col in global_df.columns if global_df[col].dtype == 'object' or global_df[col].dtype == 'string']
            # Prioritize columns like 'brand', 'category', 'product', 'platform'
            cat_col = next((c for c in cat_cols if any(kw in c.lower() for kw in ['brand', 'category', 'platform', 'type', 'name'])), None)
            if not cat_col and cat_cols:
                cat_col = cat_cols[0]
            
            # 2. Find a numeric column
            num_cols = [col for col in global_df.columns if pd.api.types.is_numeric_dtype(global_df[col])]
            num_col = next((c for c in num_cols if any(kw in c.lower() for kw in ['revenue', 'profit', 'sales', 'value', 'amount', 'price', 'count', 'units'])), None)
            if not num_col and num_cols:
                num_col = num_cols[0]
                
            if not cat_col or not num_col:
                 return {"data": []}

            # Group by category, sum the value
            grouped = global_df.groupby(cat_col)[num_col].sum().reset_index()
            # Sort descending
            grouped = grouped.sort_values(by=num_col, ascending=False).head(10) # Top 10
            
            pareto_data = []
            for _, row in grouped.iterrows():
                val = row[num_col]
                # Ensure value is normal float/int and >= 0
                if pd.notna(val) and val >= 0:
                    pareto_data.append({
                        "category": str(row[cat_col])[:20], # truncate long names
                        "value": float(val)
                    })

        if not pareto_data:
             return {"data": []}

        # Calculate cumulative percentages
        total_val = sum(item["value"] for item in pareto_data)
        if total_val == 0:
            return {"data": []}
            
        current_sum = 0
        processed_data = []
        for item in pareto_data:
            current_sum += item["value"]
            processed_data.append({
                "category": item["category"],
                "value": item["value"],
                "cumulativePercent": round((current_sum / total_val) * 100, 1)
            })
            
        return {"data": processed_data, "value_metric": num_col if not global_df.empty else "Profit"}

    except Exception as e:
        print(f"[ERROR] Pareto analysis failed: {e}")
        return {"data": []}

@app.get("/api/data/raw")
async def get_raw_data(page: int = 1, limit: int = 50):
    """Returns paginated raw data from the uploaded CSV."""
    global global_df
    try:
        if global_df.empty:
            return {"columns": [], "data": [], "total_rows": 0, "page": page, "total_pages": 0}

        total_rows = len(global_df)
        total_pages = (total_rows + limit - 1) // limit
        
        # Paginate
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        df_page = global_df.iloc[start_idx:end_idx]

        # Convert to dictionary (handle NaNs by replacing with None)
        # fillna('') ensures JSON serialization doesn't break on NaN
        records = df_page.fillna("").to_dict(orient="records")
        
        return {
            "columns": list(global_df.columns),
            "data": records,
            "total_rows": total_rows,
            "page": page,
            "total_pages": total_pages
        }
    except Exception as e:
        print(f"[ERROR] Raw data fetch failed: {e}")
        return {"columns": [], "data": [], "total_rows": 0, "page": 1, "total_pages": 0}

@app.get("/api/health")
async def health():
    return {"status": "ok", "has_data": not global_df.empty, "rows": len(global_df)}
