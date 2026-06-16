from fastapi import FastAPI

app = FastAPI(
    title="AI Ticket Automation API",
    description="Automated support ticket processing and handling using AI",
    version="0.1.0"
)

@app.get("/")
def health_check():
    return {
        "message": "Welcome to the AI Ticket Automation API",
        "status": "healthy"
    }
