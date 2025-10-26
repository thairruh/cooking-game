from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY present:", bool(api_key))

if not api_key:
    print("Set GEMINI_API_KEY in backend/.env or your environment before running this script.")
    raise SystemExit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro")

prompt = "Write one short friendly sentence about a steaming cup of tea."
print("Prompt:\n", prompt)
try:
    resp = model.generate_content(prompt)
    text = getattr(resp, 'text', None)
    if text is None:
        text = str(resp)
    print('\nGenerated text:\n', text)
    print('\nRaw response:\n', resp)
except Exception as e:
    print('Gemini API error:', e)
    raise
