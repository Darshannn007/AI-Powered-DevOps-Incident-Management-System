import urllib.request
from PIL import Image
import io

code = """%%{init: {'theme':'dark', 'themeVariables': {'darkMode':true, 'background':'#0f172a', 'primaryColor':'#1e293b', 'primaryTextColor':'#f8fafc', 'primaryBorderColor':'#38bdf8', 'lineColor':'#38bdf8', 'secondaryColor':'#0ea5e9', 'tertiaryColor':'#0f172a', 'actorBkg':'#1e293b', 'actorBorder':'#38bdf8', 'actorTextColor':'#f8fafc', 'signalColor':'#e2e8f0', 'signalTextColor':'#f8fafc', 'activationBkgColor':'#0284c7', 'activationBorderColor':'#38bdf8', 'sequenceNumberColor':'#ffffff'}}}%%
sequenceDiagram
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

url = "https://kroki.io/mermaid/png"
req = urllib.request.Request(
    url,
    data=code.encode("utf-8"),
    headers={"Content-Type": "text/plain; charset=utf-8", "User-Agent": "Mozilla/5.0"}
)

print("Sending request to Kroki...")
with urllib.request.urlopen(req, timeout=30) as res:
    data = res.read()
    print(f"Received {len(data)} bytes from Kroki API.")
    img = Image.open(io.BytesIO(data)).convert("RGB")
    print(f"Original Resolution: {img.size[0]} x {img.size[1]}")

    # Scale up 2x using Lanczos high-quality resampling for super-sharp text
    new_w = img.size[0] * 2
    new_h = img.size[1] * 2
    img_hd = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    print(f"Upscaled HD Resolution: {img_hd.size[0]} x {img_hd.size[1]}")

    jpg_path = r"C:\projects\APDIMS\ai_root_cause_analysis_sequence_diagram.jpeg"
    brain_jpg = r"C:\Users\darsh\.gemini\antigravity\brain\d4862bfa-5c8a-4e16-84c1-2eda41ee0b35\ai_root_cause_analysis_sequence_diagram.jpeg"

    img_hd.save(jpg_path, "JPEG", quality=98, optimize=True)
    img_hd.save(brain_jpg, "JPEG", quality=98, optimize=True)
    print(f"Saved HD JPEG at {jpg_path} and {brain_jpg}")
