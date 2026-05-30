import os
from groq import Groq

# Paste your Groq API key here for testing
api_key = os.environ.get("GROQ_API_KEY", "YOUR_GROQ_KEY_HERE")

print("Testing Groq API...")
try:
    client = Groq(api_key=api_key)
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "Reply with exactly the word: working"}],
        model="llama-3.3-70b-versatile",
        max_tokens=5,
    )
    response = chat_completion.choices[0].message.content.strip()
    print(f"SUCCESS! Groq API is working. Model replied: {response}")
except Exception as e:
    print(f"ERROR: {e}")
