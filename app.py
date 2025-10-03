import io, base64
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
import torch.nn.functional as F
from transformers import AutoImageProcessor, AutoModelForImageClassification
import uvicorn
from datetime import datetime

app = FastAPI()

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "mo-thecreator/vit-Facial-Expression-Recognition"
device = "cuda" if torch.cuda.is_available() else "cpu"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME).to(device)
labels = model.config.id2label

class ImageRequest(BaseModel):
    image: str  # base64 string

@app.post("/analyze-emotion")
def analyze_emotion(req: ImageRequest):
    image_bytes = base64.b64decode(req.image)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)[0]

    idx = torch.argmax(probs).item()
    emotion = labels[idx]
    confidence = float(probs[idx])

    predictions = [
        {"emotion": labels[i], "score": float(score), "percentage": float(score) * 100}
        for i, score in enumerate(probs)
    ]

    return {
        "emotion": emotion,
        "confidence": confidence,
        "predictions": sorted(predictions, key=lambda x: -x["score"])[:5],
        "analysis_method": "huggingface-vit",
        "model_used": MODEL_NAME,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8501)
