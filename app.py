from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch


MODEL_NAME = "bhadresh-savani/distilbert-base-uncased-emotion"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
id2label = model.config.id2label

app = FastAPI(title="EmotionAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextInput(BaseModel):
    text: str


@app.get("/")
def read_root():
    return {"message": "EmotionAI API is running"}


@app.post("/predict/")
def predict_emotion(input: TextInput):
    if not input.text.strip():
        return {"text": input.text, "emotion": None, "scores": {}}

    inputs = tokenizer(
        input.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128,
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]

    best_idx = int(torch.argmax(probabilities))
    emotion = id2label[best_idx]
    scores = {
        id2label[i]: float(probabilities[i])
        for i in range(len(probabilities))
    }

    return {"text": input.text, "emotion": emotion, "scores": scores}