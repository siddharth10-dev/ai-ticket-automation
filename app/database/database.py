import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print("DATABASE_URL FOUND:", DATABASE_URL is not None)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)