# app/models/user.py

from sqlalchemy import Column, Integer, String
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    mobile_number = Column(String(20))
    email = Column(String(255))
    password_hash = Column(String(255))