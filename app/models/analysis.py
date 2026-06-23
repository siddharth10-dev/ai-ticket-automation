# app/models/analysis.py

from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from app.database.base import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    category = Column(String(50))
    priority = Column(String(20))
    draft_response = Column(Text)
    confidence_score = Column(Float)