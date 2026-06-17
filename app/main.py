from app.schemas import tickets
from app.schemas import user
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

@app.post("/create_user")
def create_user(request_body:user.UserCreate):
    db = SessionLocal()
    try:
        db.execute(text("INSERT INTO users (name, mobile_number, email, password_hash) VALUES (:name, :mobile_number, :email, :password_hash)"), {
            "name": request_body.name,
            "mobile_number": request_body.mobile_number,
            "email": request_body.email,
            "password_hash": request_body.password
        })
        db.commit()
        return {
            "message": "User created successfully",
            "status": "success"
        }
    except Exception as e:
        return {
            "message": str(e),
            "status": "error"
        }
    finally:
        db.close()

@app.post("/create_ticket")
def create_ticket(request_body:tickets.TicketCreate):
    db=SessionLocal()
    try:
        db.execute(text("INSERT INTO tickets (user_id, title, description) VALUES (:user_id, :title, :description)"), {
            "user_id": request_body.user_id,
            "title": request_body.title,
            "description": request_body.description
        })
        db.commit()
        return {
            "message": "Ticket created successfully",
            "status": "success"
        }
    except Exception as e:
        return {
            "message": str(e),
            "status": "error"
        }
    finally:
        db.close()


@app.get("/view_tickets")
def view_tickets():
    db=SessionLocal()
    try:
        tickets = db.execute(text("SELECT * FROM tickets"))
        return tickets.mappings().all()
    finally:
        db.close()

@app.get("/ticket{id}")
def get_ticket(id:int):
    db=SessionLocal()
    try:
        ticket = db.execute(text("SELECT * FROM tickets WHERE id = :id"), {"id": id})
        return ticket.mappings().all()
    finally:
        db.close()

    

