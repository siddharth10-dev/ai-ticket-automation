from app.services.ai_service import analyze_ticket
from app.schemas import tickets
from app.schemas import user
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import SessionLocal
from sqlalchemy import text

app = FastAPI(
    title="AI Ticket Automation API",
    description="Automated support ticket processing and handling using AI",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        # 1. Save Ticket first and commit
        ticket = db.execute(text("INSERT INTO tickets (user_id, title, description) VALUES (:user_id, :title, :description) RETURNING id"), {
            "user_id": request_body.user_id,
            "title": request_body.title,
            "description": request_body.description
        })
        ticket_id = ticket.scalar()
        db.commit()

        # 2. Analyze Ticket & Save AI Analysis (isolated from ticket creation flow)
        analysis = None
        try:
            analysis_res = analyze_ticket(request_body.description)
            if analysis_res["status"] == "success":
                analysis = analysis_res["analysis"]
                db.execute(text("""
                    INSERT INTO ai_analysis (ticket_id, category, priority, draft_response, confidence_score) 
                    VALUES (:ticket_id, :category, :priority, :draft_response, :confidence_score)
                """), {
                    "ticket_id": ticket_id,
                    "category": analysis['category'],
                    "priority": analysis['priority'],
                    "draft_response": analysis['draft_response'],
                    "confidence_score": analysis['confidence_score']
                })
                db.commit()
            else:
                print(f"AI analysis returned error status: {analysis_res.get('message')}")
        except Exception as ai_err:
            print(f"AI analysis failed: {ai_err}")

        return {
            "message": "Ticket created successfully",
            "id": ticket_id,
            "analysis": analysis,
            "status": "success"
        }
    except Exception as e:
        db.rollback()
        return {
            "message": str(e),
            "status": "error"
        }
    finally:
        db.close()


@app.get("/ticket/{id}")
def get_ticket(id:int):
    db=SessionLocal()
    try:
        ticket = db.execute(text("SELECT * FROM tickets WHERE id = :id"), {"id": id})
        return ticket.mappings().all()
    finally:
        db.close()


@app.get("/ticket_details/{id}")
def get_details(id: int):
    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                SELECT
                    t.id,
                    t.title,
                    t.description,
                    t.status,
                    a.category,
                    a.priority,
                    a.draft_response,
                    a.confidence_score
                FROM tickets t
                LEFT JOIN ai_analysis a
                    ON t.id = a.ticket_id
                WHERE t.id = :id
            """),
            {"id": id}
        )

        return result.mappings().first()

    finally:
        db.close()

@app.get("/all_tickets")
def get_all_tickets():
    db=SessionLocal()
    try:
        tickets = db.execute(text("""
            SELECT 
                t.id, 
                t.title, 
                t.description, 
                t.status, 
                a.category, 
                a.priority, 
                a.draft_response, 
                a.confidence_score 
            FROM tickets t 
            LEFT JOIN ai_analysis a 
                ON t.id = a.ticket_id
        """))
        return tickets.mappings().all()
    finally:
        db.close()