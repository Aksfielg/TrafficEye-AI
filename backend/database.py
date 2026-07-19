import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# Get DB URL from environment variable, but override it to use SQLite due to Supabase inactivity
db_url = "sqlite:///./traffic_eye.db"

# Create the SQLModel engine
engine = create_engine(db_url, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    # Import models here to avoid circular imports and ensure they are registered
    import models.db_models
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
