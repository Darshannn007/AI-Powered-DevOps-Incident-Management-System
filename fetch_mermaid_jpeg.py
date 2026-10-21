import base64
import urllib.request
import json
from PIL import Image
import io

code = """sequenceDiagram
    autonumber
    actor Engineer as SRE Engineer / Admin
    participant UI as React Dashboard
    participant AIC as AIAnalysisController
    participant AIS as GeminiAIService
    participant IR as IncidentRepository
    participant Gemini as Google Gemini 1.5 Flash API
    participant AR as AIAnalysisRepository
    participant DB as MySQL Database

    Engineer->>UI: Click "Analyze with AI" Button
    activate UI
    UI->>AIC: POST /api/v1/ai/analyze/{incidentId} (Bearer JWT)
    activate AIC
    
    AIC->>AIS: analyzeIncident(incidentId)
    activate AIS
    
    AIS->>IR: findById(incidentId)
    activate IR
    IR->>DB: SELECT * FROM incidents WHERE id = ?
    activate DB
    DB-->>IR: Incident Entity (title, description, logs, service)
    deactivate DB
    IR-->>AIS: Incident Object
    deactivate IR
    
    AIS->>AIS: Build SRE Prompt Template (Context + Stack Trace + Runbook format)
    
    alt Gemini API Available & Healthy
        AIS->>Gemini: POST /v1beta/models/gemini-1.5-flash:generateContent (Prompt)
        activate Gemini
        Gemini-->>AIS: 200 OK (JSON with Root Cause, Mitigation Steps, Confidence)
        deactivate Gemini
    else API Timeout / Rate Limit / Error
        AIS->>AIS: Trigger Heuristic Diagnostic Fallback Engine
    end
    
    AIS->>AR: save(AIAnalysis Entity)
    activate AR
    AR->>DB: INSERT INTO ai_analyses (...)
    activate DB
    DB-->>AR: Saved AIAnalysis Entity
    deactivate DB
    AR-->>AIS: Persisted Analysis Record
    deactivate AR
    
    AIS-->>AIC: AIAnalysisResponse DTO
    deactivate AIS
    AIC-->>UI: 200 OK (Root Cause, Runbook Commands, Confidence Score)
    deactivate AIC
    
    UI->>Engineer: Render AI Root Cause Modal (Markdown + Actionable Runbooks)
    deactivate UI"""

# Prepare base64 URL for Mermaid Ink with 3x resolution scale and dark theme
encoded_code = base64.b64encode(code.encode("utf-8")).decode("utf-8")
url = f"https://mermaid.ink/img/{encoded_code}?bgColor=!0f172a&scale=3"

print("Requesting 3x high-res diagram from Mermaid.ink API...")
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

with urllib.request.urlopen(req, timeout=30) as response:
    raw_data = response.read()
    print(f"Downloaded {len(raw_data)} bytes image data.")
    
    img = Image.open(io.BytesIO(raw_data)).convert("RGB")
    print(f"Image Resolution: {img.size[0]} x {img.size[1]} pixels")
    
    jpg_path = r"C:\projects\APDIMS\ai_root_cause_analysis_sequence_diagram.jpeg"
    brain_jpg = r"C:\Users\darsh\.gemini\antigravity\brain\d4862bfa-5c8a-4e16-84c1-2eda41ee0b35\ai_root_cause_analysis_sequence_diagram.jpeg"
    
    img.save(jpg_path, "JPEG", quality=98, optimize=True)
    img.save(brain_jpg, "JPEG", quality=98, optimize=True)
    print(f"Saved JPEG at {jpg_path}")
