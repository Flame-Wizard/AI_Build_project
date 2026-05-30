import os
import json
import pandas as pd
from huggingface_hub import InferenceClient

def generate_insights(df: pd.DataFrame):
    """
    Generate insights using a Hugging Face model (like Gemma or GLM-4) 
    via the Hugging Face Inference API.
    """
    if len(df) == 0:
        return []

    # Get API key from environment
    hf_token = os.environ.get("HF_TOKEN")
    
    # If no token, return fallback insights based on basic stats
    if not hf_token:
        return _generate_fallback_insights(df)

    # Initialize client with a free model (e.g., google/gemma-2b-it or similar)
    try:
        client = InferenceClient(model="google/gemma-1.1-2b-it", token=hf_token)
        
        # Create a summary of the data
        summary = df.describe().to_json()
        
        prompt = f"""
        You are a Data Scientist AI. Analyze the following statistical summary of a company's data and provide exactly 3 key business insights.
        Data summary: {summary}
        
        Respond ONLY in the following JSON format:
        [
          {{"title": "Short title", "description": "1 sentence description", "type": "warning|success|info", "icon_type": "AlertTriangle|CheckCircle|Zap"}}
        ]
        """
        
        response = client.text_generation(
            prompt,
            max_new_tokens=300,
            temperature=0.3,
            return_full_text=False
        )
        
        # Try to parse the JSON response
        try:
            # Clean up potential markdown formatting from the response
            cleaned_resp = response.strip()
            if cleaned_resp.startswith("```json"):
                cleaned_resp = cleaned_resp[7:]
            if cleaned_resp.endswith("```"):
                cleaned_resp = cleaned_resp[:-3]
                
            insights = json.loads(cleaned_resp)
            return insights
        except json.JSONDecodeError:
            print("Failed to parse JSON from LLM:", response)
            return _generate_fallback_insights(df)
            
    except Exception as e:
        print(f"Error calling Hugging Face API: {e}")
        return _generate_fallback_insights(df)

def _generate_fallback_insights(df: pd.DataFrame):
    """Fallback rule-based insights if API fails or token is missing"""
    val_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
    if not val_cols:
        return [{"title": "Data Loaded", "description": f"Successfully loaded {len(df)} rows.", "type": "info", "icon_type": "CheckCircle"}]
        
    val_col = val_cols[0]
    mean_val = df[val_col].mean()
    max_val = df[val_col].max()
    
    insights = [
        {
            "title": "Data Overview",
            "description": f"Dataset contains {len(df)} records with an average {val_col} of {mean_val:.2f}.",
            "type": "info",
            "icon_type": "CheckCircle"
        },
        {
            "title": f"Peak {val_col.title()}",
            "description": f"The maximum {val_col} recorded was {max_val:.2f}.",
            "type": "success",
            "icon_type": "Zap"
        },
        {
            "title": "API Key Missing",
            "description": "Set HF_TOKEN environment variable to enable Gemma AI insights.",
            "type": "warning",
            "icon_type": "AlertTriangle"
        }
    ]
    return insights
