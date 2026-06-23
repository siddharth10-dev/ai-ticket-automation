# app/models/ticket.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.base import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    description = Column(Text)
    status = Column(String(50), default="Open")