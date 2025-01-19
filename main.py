from fastapi import FastAPI
from pydantic import BaseModel
import joblib

# Load the trained model
model = joblib.load('emotion_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/predict/")
def predict_emotion(input: TextInput):
    # Transform the input text
    text_vector = vectorizer.transform([input.text])
    prediction = model.predict(text_vector)
    return {"text": input.text, "emotion": prediction[0]}