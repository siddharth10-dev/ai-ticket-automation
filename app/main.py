from fastapi import FastAPI
from app.database.database import SessionLocal
from sqlalchemy import text

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

@app.get("/users")
def get_users():
    db = SessionLocal()

    try:
        users = db.execute(text("SELECT * FROM users"))
        return users.mappings().all()

    finally:
        db.close()
