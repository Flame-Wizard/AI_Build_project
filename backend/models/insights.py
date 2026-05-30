import os
import json
import pandas as pd
from groq import Groq

def generate_insights(df: pd.DataFrame, forecast_data: list = None):
    """
    Generate AI insights using Groq's free LLM API (Llama 3.3 70B).
    Falls back to rule-based insights if API key is missing or call fails.
    """
    if len(df) == 0:
        return []

    # Get API key from environment
    groq_key = os.environ.get("GROQ_API_KEY")
    
    # If no token, return fallback insights based on basic stats
    if not groq_key:
        return _generate_fallback_insights(df)

    try:
        client = Groq(api_key=groq_key)

        # Detect data type based on column names
        cols_lower = [c.lower() for c in df.columns]
        is_ecommerce = any(kw in ' '.join(cols_lower) for kw in ['price', 'rating', 'brand', 'product', 'discount', 'review'])
        
        summary = df.describe().to_dict()
        columns = list(df.columns)
        row_count = len(df)

        forecast_context = ""
        if forecast_data:
            future_only = [f for f in forecast_data if f.get("actual") is None]
            if future_only:
                avg_future = sum([f['yhat'] for f in future_only]) / len(future_only)
                max_future = max([f['yhat'] for f in future_only])
                forecast_context = f"\nProphet ML Forecast: The model projects an average future value of {avg_future:.2f}, peaking at {max_future:.2f}."

        if is_ecommerce:
            domain_context = "This is an e-commerce product dataset. Focus insights on pricing strategy, discount effectiveness, brand performance, ratings quality, and inventory/availability patterns."
        else:
            domain_context = "This is a time-series business dataset. Focus insights on demand trends, forecasting accuracy, seasonal patterns, and operational recommendations."

        prompt = f"""You are a Data Scientist AI analyzing a company's data.

Dataset: {row_count} rows, columns: {columns}
{domain_context}
Key statistics: {json.dumps({k: {s: round(v, 2) for s, v in vals.items()} for k, vals in summary.items() if isinstance(vals, dict)}, indent=2)}
{forecast_context}

Provide exactly 3 specific, actionable business insights based on this data.

IMPORTANT: Respond ONLY with a valid JSON array. No explanation, no markdown, no extra text.
[
  {{"title": "Short title", "description": "1 sentence actionable insight", "type": "warning|success|info", "icon_type": "AlertTriangle|CheckCircle|Zap"}}
]"""

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=400,
        )

        response_text = chat_completion.choices[0].message.content.strip()

        # Try to parse the JSON response
        try:
            # Clean up potential markdown formatting
            cleaned = response_text
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]

            insights = json.loads(cleaned.strip())
            if isinstance(insights, list) and len(insights) > 0:
                return insights
            return _generate_fallback_insights(df)

        except json.JSONDecodeError:
            print("Failed to parse JSON from LLM:", response_text)
            return _generate_fallback_insights(df)

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return _generate_fallback_insights(df)


def _generate_fallback_insights(df: pd.DataFrame):
    """Fallback rule-based insights if API fails or token is missing"""
    val_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
    if not val_cols:
        return [{"title": "Data Loaded", "description": f"Successfully loaded {len(df)} rows.", "type": "info", "icon_type": "CheckCircle"}]

    val_col = val_cols[0]
    mean_val = df[val_col].mean()
    max_val = df[val_col].max()
    min_val = df[val_col].min()
    std_val = df[val_col].std()
    cv = (std_val / mean_val * 100) if mean_val != 0 else 0

    return [
        {
            "title": "Enable AI Insights",
            "description": "Set the GROQ_API_KEY environment variable on Render to activate Llama 3.3 70B AI recommendations.",
            "type": "warning",
            "icon_type": "AlertTriangle"
        },
        {
            "title": f"Demand Range",
            "description": f"{val_col.title()} ranges from {min_val:.0f} to {max_val:.0f} — set your reorder points accordingly.",
            "type": "success",
            "icon_type": "Zap"
        },
        {
            "title": "Volatility Alert" if cv > 20 else "Stable Trend",
            "description": f"Demand variability (CV={cv:.1f}%) is {'high — consider safety stock buffers.' if cv > 20 else 'low — operations are stable.'}",
            "type": "warning" if cv > 20 else "success",
            "icon_type": "AlertTriangle" if cv > 20 else "CheckCircle"
        }
    ]
