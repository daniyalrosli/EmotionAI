from fastapi import FastAPI
from pydantic import BaseModel
import joblib

# Load the trained moded



app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/predict/")
def predict_emotion(input: TextInput):
    # Transform the input text
    text_vector = vectorizer.transform([input.text])
    prediction = model.predict(text_vector)
    return {"text": input.text, "emotion": prediction[0]}