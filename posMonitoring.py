import cv2
import time
import requests
import base64
import google.auth
from google.auth.transport.requests import Request
import os
import json
import warnings
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Suppress harmless Google Cloud CLI warnings
warnings.filterwarnings("ignore", category=UserWarning)

# ==========================================
# 1. CONFIGURATION & KEYS
# ==========================================
load_dotenv()

# ==========================================
# 1. CONFIGURATION & KEYS
# ==========================================
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
ENDPOINT_URL = os.getenv("ENDPOINT_URL")
app = FastAPI()

# Allow the React frontend to communicate with this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 2. CORE LOGIC
# ==========================================
def send_telegram_alert(video_path, message):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendVideo"
    try:
        with open(video_path, 'rb') as video:
            files = {'video': video}
            data = {'chat_id': CHAT_ID, 'caption': message}
            response = requests.post(url, data=data, files=files) 
            if response.status_code == 200:
                print(">>> Video alert successfully delivered to Telegram! <<<")
            else:
                print(f"Telegram API Error: {response.text}")
    except Exception as e:
        print(f"Failed to send Telegram alert: {e}")

def analyze_clip(video_path):
    print(f"\n--- Analyzing {video_path} via Vertex AI ---")
    try:
        credentials, project_id = google.auth.default()
        credentials.refresh(Request())
        token = credentials.token
        
        with open(video_path, "rb") as f:
            video_bytes = f.read()
        encoded_video = base64.b64encode(video_bytes).decode('utf-8')
        
        prompt_text = """Task: Watch this video and answer two questions with strictly true or false.
1. "picked_up": Did the person's hand physically pick up the cash from the table?
2. "concealed": Did the person put that cash into a pocket or waistband?

Output ONLY a JSON object:
{
  "picked_up": true/false,
  "concealed": true/false
}"""

        payload = {
            "contents": [{
                "role": "user",
                "parts": [
                    {"text": prompt_text},
                    {"inlineData": {"mimeType": "video/mp4", "data": encoded_video}}
                ]
            }]
        }
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(ENDPOINT_URL, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            prediction = data['candidates'][0]['content']['parts'][0]['text'].strip()
            clean_text = prediction.replace("```json", "").replace("```", "").strip()
            
            try:
                ai_result = json.loads(clean_text)
                print(f"\n>>> AI JSON OUTPUT:\n{json.dumps(ai_result, indent=2)}\n<<<")
                
                # Logic Gate
                if ai_result.get("picked_up") == True and ai_result.get("concealed") == True:
                    print("🚨 THEFT DETECTED! Uploading footage to Telegram... 🚨")
                    send_telegram_alert(video_path, "🚨 ALERT: Cash Pocketing Detected!")
                    ai_result["alert_sent"] = True
                else:
                    print("✅ Normal behavior confirmed. No alert sent.")
                    ai_result["alert_sent"] = False
                    
                return ai_result
            except json.JSONDecodeError:
                return {"error": "Failed to parse AI JSON", "raw": clean_text}
        else:
            return {"error": f"API Error {response.status_code}"}
            
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 3. WEB ENDPOINTS
# ==========================================
@app.post("/api/analyze")
async def handle_video_upload(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
      
        result = analyze_clip(temp_path)
        return {"filename": file.filename, "analysis": result}
    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"--- Cleaned up temp file: {temp_path} ---")

if __name__ == "__main__":
    print("Starting NAOL MONITORING AI Backend on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)