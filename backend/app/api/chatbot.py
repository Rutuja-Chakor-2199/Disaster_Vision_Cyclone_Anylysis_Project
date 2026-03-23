from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

# simple rule-based chatbot
@router.post("/chat")
def chat(request: ChatRequest):
    user_msg = request.message.lower()

    if "hello" in user_msg or "hi" in user_msg:
        reply = "Hello! 👋 I’m your Cyclone Assistant. How can I help you today?"
    elif "forecast" in user_msg:
        reply = "You can check the cyclone forecast under the Forecast tab 🌊."
    elif "safety" in user_msg:
        reply = "Stay indoors, keep an emergency kit ready, and follow official alerts 🚨."
    elif "risk" in user_msg:
        reply = "The risk depends on windspeed and pressure. Try the Risk Predictor card 📊."
    else:
        reply = "Sorry, I didn’t understand 🤔. Try asking about 'forecast', 'safety', or 'risk'."

    return {"reply": reply}
