from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
DATABASE_URL = "postgresql://siddharthadep@localhost:5432/ai_ticket_automation"
engine=create_engine(DATABASE_URL)
SessionLocal=sessionmaker(bind=engine)

db=SessionLocal()