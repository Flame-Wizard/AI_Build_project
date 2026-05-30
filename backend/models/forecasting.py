import pandas as pd
from prophet import Prophet
import io

def _find_columns(df: pd.DataFrame):
    """
    Intelligently detect date and value columns from any CSV structure.
    Returns (date_col_or_None, val_col).
    """
    # Date column detection
    date_col = next(
        (col for col in df.columns
         if any(kw in col.lower() for kw in ['date', 'time', 'month', 'week', 'year', 'day', 'period'])),
        None
    )

    # Numeric columns for value
    numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]

    # Priority: known sales/demand keywords
    priority_keywords = [
        'demand', 'sales', 'revenue', 'amount', 'profit', 'value',
        'quantity', 'units', 'units_sold', 'qty', 'listed_price',
        'discounted', 'price', 'rating', 'average_r', 'reviews'
    ]
    for kw in priority_keywords:
        for col in numeric_cols:
            if kw in col.lower():
                return date_col, col

    # Fallback: use the first numeric column
    if numeric_cols:
        return date_col, numeric_cols[0]

    # Last resort: use second column
    return date_col, df.columns[1] if len(df.columns) > 1 else df.columns[0]


def generate_forecast(df: pd.DataFrame, periods: int = 14):
    """
    Generate forecast using Prophet.
    Works with ANY CSV — if no date column is found, row index is used as time axis.
    """
    if len(df) == 0:
        return []

    # Cap to last 500 rows for Render free tier performance
    if len(df) > 500:
        df = df.tail(500).reset_index(drop=True)

    date_col, val_col = _find_columns(df)
    print(f"[Prophet] date_col='{date_col}', val_col='{val_col}', columns={list(df.columns)}")

    # Build the ds column
    if date_col:
        try:
            ds_series = pd.to_datetime(df[date_col])
        except Exception:
            # If date parsing fails, fall back to sequential
            ds_series = pd.date_range(start='2023-01-01', periods=len(df), freq='D')
    else:
        # No date column — treat each row as one day sequentially
        ds_series = pd.date_range(start='2023-01-01', periods=len(df), freq='D')

    # Build the y column
    y_series = pd.to_numeric(df[val_col], errors='coerce')

    prophet_df = pd.DataFrame({'ds': ds_series, 'y': y_series}).dropna()

    if len(prophet_df) < 2:
        return []

    # Fit Prophet
    m = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        uncertainty_samples=100
    )
    m.fit(prophet_df)

    # Determine frequency for future dataframe
    if date_col:
        diff = prophet_df['ds'].diff().median()
        freq = 'D'
        if pd.notnull(diff):
            if diff >= pd.Timedelta(days=28):
                freq = 'ME'
            elif diff >= pd.Timedelta(days=7):
                freq = 'W'
    else:
        freq = 'D'

    future = m.make_future_dataframe(periods=periods, freq=freq)
    forecast = m.predict(future)

    # Format output
    actuals_dict = dict(zip(prophet_df['ds'].dt.strftime('%Y-%m-%d'), prophet_df['y']))
    result = []

    for _, row in forecast.iterrows():
        date_str = row['ds'].strftime('%Y-%m-%d')
        actual_val = actuals_dict.get(date_str)

        # Anomaly detection
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
    Generate trend data for the frontend chart. Works with any CSV.
    """
    if len(df) == 0:
        return {"data": [], "average_value": 0, "trend_percentage": 0}

    if len(df) > 500:
        df = df.tail(500).reset_index(drop=True)

    date_col, val_col = _find_columns(df)

    # Build date series
    if date_col:
        try:
            date_series = pd.to_datetime(df[date_col]).dt.strftime('%Y-%m-%d')
        except Exception:
            date_series = pd.date_range(start='2023-01-01', periods=len(df), freq='D').strftime('%Y-%m-%d')
    else:
        date_series = pd.date_range(start='2023-01-01', periods=len(df), freq='D').strftime('%Y-%m-%d')

    temp_df = pd.DataFrame({
        'date': date_series,
        'value': pd.to_numeric(df[val_col], errors='coerce')
    }).dropna().sort_values('date')

    if len(temp_df) < 2:
        return {"data": [], "average_value": 0, "trend_percentage": 0}

    temp_df['trend'] = temp_df['value'].rolling(window=min(10, len(temp_df)), min_periods=1).mean()

    avg_val = temp_df['value'].mean()
    half = len(temp_df) // 2
    first_half = temp_df['value'].iloc[:half].mean()
    second_half = temp_df['value'].iloc[half:].mean()
    trend_pct = ((second_half - first_half) / first_half * 100) if first_half != 0 else 0

    return {
        "data": temp_df.to_dict('records'),
        "average_value": round(avg_val, 2),
        "trend_percentage": round(trend_pct, 2)
    }
