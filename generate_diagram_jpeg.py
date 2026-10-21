import subprocess
import os
import time
from PIL import Image

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
html_path = r"file:///C:/projects/APDIMS/render_diagram.html"
png_path = r"C:\projects\APDIMS\diagram_raw.png"
jpg_path = r"C:\projects\APDIMS\ai_root_cause_analysis_sequence_diagram.jpeg"
brain_jpg = r"C:\Users\darsh\.gemini\antigravity\brain\d4862bfa-5c8a-4e16-84c1-2eda41ee0b35\ai_root_cause_analysis_sequence_diagram.jpeg"

if os.path.exists(png_path):
    os.remove(png_path)

cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--force-device-scale-factor=2",
    "--window-size=3600,2200",
    f"--screenshot={png_path}",
    html_path
]

print("Running Edge headless...")
subprocess.run(cmd, check=True, timeout=30)
time.sleep(1)

if os.path.exists(png_path):
    print(f"PNG captured successfully: {os.path.getsize(png_path)} bytes")
    img = Image.open(png_path).convert("RGB")
    width, height = img.size
    bg_color = img.getpixel((0, 0))

    # Scan for non-background content box
    left, top, right, bottom = width, height, 0, 0
    step = 5
    for y in range(0, height, step):
        for x in range(0, width, step):
            if img.getpixel((x, y)) != bg_color:
                left = min(left, x)
                top = min(top, y)
                right = max(right, x)
                bottom = max(bottom, y)

    # Margin
    left = max(0, left - 40)
    top = max(0, top - 40)
    right = min(width, right + 40)
    bottom = min(height, bottom + 40)

    cropped = img.crop((left, top, right, bottom))
    cropped.save(jpg_path, "JPEG", quality=98, optimize=True)
    cropped.save(brain_jpg, "JPEG", quality=98, optimize=True)
    print(f"Cropped to: {cropped.size}")
    print(f"Saved JPEG at: {jpg_path}")
    print(f"Saved Brain JPEG at: {brain_jpg}")
else:
    print("Error: PNG not created.")
