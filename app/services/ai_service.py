from google import genai
from pydantic import BaseModel, Field
import json
import os
import dotenv
dotenv.load_dotenv()
class TicketAnalysis(BaseModel):
    category: str = Field(description="Category of the ticket: Billing, Technical, Feature Request, or Other")
    priority: str = Field(description="Priority level: High, Medium, or Low")
    draft_response: str = Field(description="A draft response to the customer to help resolve their support ticket")
    confidence_score: float = Field(description="Confidence score of the analysis between 0.0 and 1.0")


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_ticket(description: str) -> dict:
    prompt = f"Analyze this customer support ticket: {description}"
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": TicketAnalysis,
            }
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        analysis_data = json.loads(text.strip())
        return {
            "status": "success",
            "analysis": analysis_data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
