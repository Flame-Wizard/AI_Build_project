import pandas as pd
from prophet import Prophet
import io

def generate_forecast(df: pd.DataFrame, periods: int = 4):
    """
    Generate forecast using Prophet.
    Expected df format: requires at least 'date' and 'demand' or 'value' columns.
    If not, we will try to infer or fallback.
    """
    if len(df) == 0:
        return []

    # Try to find a date column
    date_col = next((col for col in df.columns if 'date' in col.lower() or 'time' in col.lower() or 'month' in col.lower() or 'week' in col.lower() or 'year' in col.lower()), None)
    if date_col is None:
        date_col = df.columns[0]  # Fallback to first column
    
    # Try to find value column — check for common names, then pick any numeric column
    numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
    named_val_cols = [col for col in numeric_cols if col.lower() in ['demand', 'sales', 'value', 'amount', 'profit', 'revenue', 'quantity', 'units', 'units_sold', 'qty']]
    val_col = named_val_cols[0] if named_val_cols else (numeric_cols[0] if numeric_cols else df.columns[1])
    
    print(f"[Prophet] Using date_col='{date_col}', val_col='{val_col}' from columns: {list(df.columns)}")

    # Prepare data for Prophet
    prophet_df = pd.DataFrame({
        'ds': pd.to_datetime(df[date_col]),
        'y': pd.to_numeric(df[val_col], errors='coerce')
    }).dropna()

    if len(prophet_df) < 2:
        return []

    # Initialize and fit Prophet
    m = Prophet(yearly_seasonality=False, weekly_seasonality=False, daily_seasonality=False)
    m.fit(prophet_df)

    # Calculate frequency for future dataframe
    diff = prophet_df['ds'].diff().median()
    freq = 'D'
    if pd.notnull(diff):
        if diff >= pd.Timedelta(days=28):
            freq = 'ME'
        elif diff >= pd.Timedelta(days=7):
            freq = 'W'

    # Make future dataframe
    future = m.make_future_dataframe(periods=periods, freq=freq)
    forecast = m.predict(future)

    # Format output
    result = []
    actuals_dict = dict(zip(prophet_df['ds'].dt.strftime('%Y-%m-%d'), prophet_df['y']))

    for _, row in forecast.iterrows():
        date_str = row['ds'].strftime('%Y-%m-%d')
        actual_val = actuals_dict.get(date_str)
        
        # Anomaly detection: flag if actual value falls outside 80% confidence interval
        is_anomaly = False
        if actual_val is not None:
            if actual_val < row['yhat_lower'] or actual_val > row['yhat_upper']:
                is_anomaly = True
        
        result.append({
            "date": date_str,
            "actual": actual_val,
            "yhat": round(row['yhat'], 2),
            "lower": round(row['yhat_lower'], 2),
            "upper": round(row['yhat_upper'], 2),
            "is_anomaly": is_anomaly
        })

    return result

def get_trend_analysis(df: pd.DataFrame):
    """
    Generate trend data (moving average or simple smoothing) for the frontend chart.
    """
    if len(df) == 0:
        return {"data": [], "average_value": 0, "trend_percentage": 0}

    # Try to find a date column
    date_col = next((col for col in df.columns if 'date' in col.lower() or 'time' in col.lower() or 'month' in col.lower() or 'week' in col.lower() or 'year' in col.lower()), None)
    if date_col is None:
        date_col = df.columns[0]
    
    # Broaden value column detection
    numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
    named_val_cols = [col for col in numeric_cols if col.lower() in ['demand', 'sales', 'value', 'amount', 'profit', 'revenue', 'quantity', 'units', 'units_sold', 'qty']]
    val_col = named_val_cols[0] if named_val_cols else (numeric_cols[0] if numeric_cols else df.columns[1])

    temp_df = pd.DataFrame({
        'date': pd.to_datetime(df[date_col]).dt.strftime('%Y-%m-%d'),
        'value': pd.to_numeric(df[val_col], errors='coerce')
    }).dropna().sort_values('date')
    
    if len(temp_df) < 2:
         return {"data": [], "average_value": 0, "trend_percentage": 0}

    # Calculate simple moving average for trend
    temp_df['trend'] = temp_df['value'].rolling(window=min(3, len(temp_df)), min_periods=1).mean()
    
    avg_val = temp_df['value'].mean()
    
    # Calculate trend percentage (first half vs second half)
    half = len(temp_df) // 2
    first_half = temp_df['value'].iloc[:half].mean()
    second_half = temp_df['value'].iloc[half:].mean()
    trend_pct = ((second_half - first_half) / first_half * 100) if first_half != 0 else 0

    return {
        "data": temp_df.to_dict('records'),
        "average_value": round(avg_val, 2),
        "trend_percentage": round(trend_pct, 2)
    }
